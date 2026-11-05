import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'varese_admin';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

// --- Admin session: "<expiresAt>.<hmac>" signed with ADMIN_PASSWORD (changing it logs everyone out)

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(`varese-admin:${payload}`).digest('hex');
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkAdminPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && safeEqual(input, expected);
}

export function createSessionToken() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error('ADMIN_PASSWORD not set');
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS);
  return { token: `${expiresAt}.${sign(expiresAt, secret)}`, maxAge: SESSION_TTL_SECONDS };
}

export function isValidSessionToken(token: string | undefined) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || !token) return false;
  const [expiresAt, mac] = token.split('.');
  if (!expiresAt || !mac || Number(expiresAt) < Date.now() / 1000) return false;
  return safeEqual(mac, sign(expiresAt, secret));
}

export async function isAdmin() {
  const store = await cookies();
  return isValidSessionToken(store.get(ADMIN_COOKIE)?.value);
}
