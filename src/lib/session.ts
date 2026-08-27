/**
 * Cross-runtime session tokens (HMAC-SHA256 via Web Crypto).
 * Works in Next.js Edge middleware AND Node server runtimes.
 *
 * Token format: base64url(header).base64url(payload).base64url(hmac)
 * Payload: { sub: userId, role, name, iat, exp, sid }
 */

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  const bin = atob(b64 + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return b64url(new Uint8Array(sig));
}

export function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET (min 32 chars) must be set in production');
  }
  return 'dev-only-secret-change-me-0123456789abcdef';
}

export interface SessionPayload {
  sub: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
  sid: string;
}

export async function createSessionToken(
  user: { id: string; name: string; role: string },
  ttlMs: number
): Promise<string> {
  const secret = getSecret();
  const header = b64url(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const now = Date.now();
  const payload: SessionPayload = {
    sub: user.id,
    role: user.role,
    name: user.name,
    iat: now,
    exp: now + ttlMs,
    sid: crypto.getRandomValues(new Uint8Array(16)).reduce((a, b) => a + b.toString(16).padStart(2, '0'), ''),
  };
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = await hmacSign(secret, `${header}.${body}`);
  return `${header}.${body}.${sig}`;
}

export type VerifyResult =
  | { ok: true; payload: SessionPayload }
  | { ok: false; reason: 'expired' | 'invalid' };

export async function verifySessionToken(token: string | undefined): Promise<VerifyResult> {
  if (!token) return { ok: false, reason: 'invalid' };
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'invalid' };
  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  const expected = await hmacSign(secret, `${parts[0]}.${parts[1]}`);
  if (expected.length !== parts[2].length) return { ok: false, reason: 'invalid' };
  let a = 0;
  for (let i = 0; i < expected.length; i++) a |= expected.charCodeAt(i) ^ parts[2].charCodeAt(i);
  if (a !== 0) return { ok: false, reason: 'invalid' };

  let data: SessionPayload;
  try {
    data = JSON.parse(new TextDecoder().decode(fromB64url(parts[1])));
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  if (!data || typeof data.sub !== 'string' || typeof data.exp !== 'number') {
    return { ok: false, reason: 'invalid' };
  }
  if (data.exp < Date.now()) return { ok: false, reason: 'expired' };
  return { ok: true, payload: data };
}

/** Timing-safe constant for the forgot-password flow (hash comparison). */
export async function sha256hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
