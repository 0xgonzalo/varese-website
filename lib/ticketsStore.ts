import { del, list, put } from '@vercel/blob';
import type { TicketEvent } from '@/lib/tickets';

// All dates live in one JSON file in Vercel Blob; flyers are separate blobs under flyers/.
// The public Blob CDN ignores query strings and caches by pathname (including 404s for deleted
// blobs), so the JSON is never overwritten and no pathname is ever reused: each save writes
// data/tickets-v<n+1>-<random>.json and readers pick the highest version via list() (API, always
// fresh). If two saves race to the same n, the one with the smallest suffix wins and the other
// retries on top of it (two saves within the same second can still lose one edit; fine for one admin).
const VERSION_PREFIX = 'data/tickets-v';
const FLYER_PREFIX = 'flyers/';
const KEEP_VERSIONS = 5;
const MAX_ATTEMPTS = 4;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const randomSuffix = () => crypto.randomUUID().replace(/-/g, '').slice(0, 12);

export function isStoreConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

type Version = { n: number; suffix: string; url: string };

// Legacy files (data/tickets-v3.json) have no suffix and win ties
const VERSION_RE = /^data\/tickets-v(\d+)(?:-([a-z0-9]+))?\.json$/;

async function listVersions(): Promise<Version[]> {
  const versions: Version[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: VERSION_PREFIX, cursor });
    for (const b of page.blobs) {
      const m = VERSION_RE.exec(b.pathname);
      if (m) versions.push({ n: Number(m[1]), suffix: m[2] ?? '', url: b.url });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return versions.sort((a, b) => b.n - a.n || a.suffix.localeCompare(b.suffix));
}

async function readLatest(): Promise<{ events: TicketEvent[]; version: number; versions: Version[] }> {
  const versions = await listVersions();
  const latest = versions[0];
  if (!latest) return { events: [], version: 0, versions };
  // Version pathnames are unique and never overwritten, so caching their body is always safe
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
    const n = version + 1;
    const mine = await put(`${VERSION_PREFIX}${n}-${randomSuffix()}.json`, JSON.stringify(next.events), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: false,
    });
    const winner = (await listVersions()).find((v) => v.n === n);
    if (winner && winner.url !== mine.url) {
      await del(mine.url).catch((err) => console.error('tickets losing version delete failed', err));
      continue;
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
