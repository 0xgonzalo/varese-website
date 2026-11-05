import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, checkAdminPassword, createSessionToken } from '@/lib/ticketsServer';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const password = (body as { password?: unknown } | null)?.password;

  if (typeof password !== 'string' || !checkAdminPassword(password)) {
    // Slow down brute force a little
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const { token, maxAge } = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
