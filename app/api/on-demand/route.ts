import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ON_DEMAND_TRACKS, MAX_TRACKS_PER_VOTE } from '@/lib/onDemandTracks';

export const runtime = 'nodejs';

const VALID_TRACKS = new Set(ON_DEMAND_TRACKS);

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const tracks = (body as { tracks?: unknown } | null)?.tracks;

  if (
    !Array.isArray(tracks) ||
    tracks.length === 0 ||
    tracks.length > MAX_TRACKS_PER_VOTE ||
    !tracks.every((t) => typeof t === 'string' && VALID_TRACKS.has(t))
  ) {
    return NextResponse.json({ error: 'Invalid tracks' }, { status: 400 });
  }

  const submission_id = crypto.randomUUID();
  const rows = [...new Set(tracks as string[])].map((track) => ({ submission_id, track }));

  const supabase = createClient(url, key);
  const { error } = await supabase.from('on_demand_votes').insert(rows);

  if (error) {
    console.error('on_demand_votes insert failed', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
