import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const EVENT_CHOICES = new Set([1, 2, 3]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { first_name, last_name, event, email, presave_completed } = body as Record<string, unknown>;

  if (
    typeof first_name !== 'string' || !first_name.trim() ||
    typeof last_name !== 'string' || !last_name.trim() ||
    typeof email !== 'string' || !EMAIL_RE.test(email) ||
    typeof event !== 'number' || !EVENT_CHOICES.has(event) ||
    typeof presave_completed !== 'boolean'
  ) {
    return NextResponse.json({ error: 'Invalid fields' }, { status: 400 });
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.from('presave_signups').insert({
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    event,
    email: email.trim().toLowerCase(),
    presave_completed,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
