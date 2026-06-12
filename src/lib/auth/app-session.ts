import 'server-only';

import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const APP_SESSION_COOKIE = 'keepdb_app_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export type AppSessionUser = {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
};

type SessionPayload = AppSessionUser & {
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.KEEPDB_KEY_ENCRYPTION_SECRET || process.env.KEEPDB_DASHBOARD_SECRET;
  if (!secret) throw new Error('KEEPDB_KEY_ENCRYPTION_SECRET is required for app sessions.');
  return secret;
}

function base64Url(value: string) {
  return Buffer.from(value).toString('base64url');
}

function sign(value: string) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('base64url');
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAppSessionToken(user: AppSessionUser) {
  const payload: SessionPayload = {
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata || {},
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = base64Url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyAppSessionToken(token?: string | null): AppSessionUser | null {
  if (!token) return null;

  const [encoded, signature] = token.split('.');
  if (!encoded || !signature || !safeEqual(sign(encoded), signature)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.id || !payload.email || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return {
      id: payload.id,
      email: payload.email,
      user_metadata: payload.user_metadata || {},
    };
  } catch {
    return null;
  }
}

export async function getAppSessionUser() {
  const cookieStore = await cookies();
  return verifyAppSessionToken(cookieStore.get(APP_SESSION_COOKIE)?.value);
}

export function getAppSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}
