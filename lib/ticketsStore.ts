import { BlobError, del, list, put } from '@vercel/blob';
import type { TicketEvent } from '@/lib/tickets';

// All dates live in one JSON file in Vercel Blob; flyers are separate blobs under flyers/.
// The public Blob CDN ignores query strings and can serve an overwritten file for up to a minute,
// so the JSON is never overwritten: each save writes data/tickets-v<n+1>.json and readers pick the
// highest version via list() (API, always fresh). allowOverwrite:false makes concurrent saves of the
// same version collide, so the loser re-reads and retries instead of dropping an edit.
const VERSION_PREFIX = 'data/tickets-v';
const FLYER_PREFIX = 'flyers/';
const KEEP_VERSIONS = 5;
const MAX_ATTEMPTS = 4;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function isStoreConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

type Version = { n: number; url: string };

async function listVersions(): Promise<Version[]> {
  const versions: Version[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: VERSION_PREFIX, cursor });
    for (const b of page.blobs) {
      const n = Number(b.pathname.slice(VERSION_PREFIX.length).replace(/\.json$/, ''));
      if (Number.isInteger(n)) versions.push({ n, url: b.url });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return versions.sort((a, b) => b.n - a.n);
}

async function readLatest(): Promise<{ events: TicketEvent[]; version: number; versions: Version[] }> {
  const versions = await listVersions();
  const latest = versions[0];
  if (!latest) return { events: [], version: 0, versions };
  // Version files are immutable, so caching their body is always safe
  const res = await fetch(latest.url, { cache: 'force-cache' });
  if (!res.ok) throw new Error(`tickets read failed: ${res.status}`);
  const parsed = await res.json();
  if (!Array.isArray(parsed)) throw new Error('tickets data is corrupted');
  return { events: parsed as TicketEvent[], version: latest.n, versions };
}

export async function readEvents(): Promise<TicketEvent[]> {
  return (await readLatest()).events;
}

export async function mutateEvents<R>(fn: (events: TicketEvent[]) => { events: TicketEvent[]; result: R }): Promise<R> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) await sleep(150 * attempt);
    const { events, version, versions } = await readLatest();
    const next = fn(events);
    try {
      await put(`${VERSION_PREFIX}${version + 1}.json`, JSON.stringify(next.events), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: false,
      });
    } catch (err) {
      if (err instanceof BlobError && /already exists/i.test(err.message)) continue;
      throw err;
    }
    // Prune old versions (the new one plus the most recent previous ones stay)
    const stale = versions.slice(KEEP_VERSIONS - 1).map((v) => v.url);
    if (stale.length) await del(stale).catch((err) => console.error('tickets prune failed', err));
    return next.result;
  }
  throw new Error('conflict');
}

export async function putFlyer(file: Blob, ext: string): Promise<string> {
  const blob = await put(`${FLYER_PREFIX}${crypto.randomUUID()}.${ext}`, file, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function deleteFlyer(url: string | null) {
  if (!url) return;
  try {
    if (new URL(url).pathname.slice(1).startsWith(FLYER_PREFIX)) await del(url);
  } catch (err) {
    console.error('flyer delete failed', url, err);
  }
}
