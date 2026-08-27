import 'server-only';
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { hasPermission, type RoleName } from './permissions';

const SESSION_COOKIE = 'gwarzo_admin_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET (min 32 chars) must be set in production');
  }
  // Dev-only fallback — NEVER rely on this in production.
  return 'dev-only-secret-change-me-0123456789abcdef';
}

interface SessionPayload {
  sub: string; // user id
  role: string;
  name: string;
  iat: number;
  exp: number;
  sid: string;
}

function sign(data: string): string {
  return createHmac('sha256', secret()).update(data).digest('base64url');
}

function b64url(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function parseB64url(s: string): any {
  try {
    return JSON.parse(Buffer.from(s, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export function createSessionToken(user: { id: string; name: string; role: string }): string {
  const header = b64url({ alg: 'HS256', typ: 'JWT' });
  const now = Date.now();
  const payload = b64url({
    sub: user.id,
    role: user.role,
    name: user.name,
    iat: now,
    exp: now + SESSION_TTL_MS,
    sid: randomBytes(16).toString('hex'),
  } satisfies SessionPayload);
  return `${header}.${payload}.${sign(`${header}.${payload}`)}`;
}

function verifyToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts;
  const expected = sign(`${header}.${payload}`);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  const data = parseB64url(payload) as SessionPayload | null;
  if (!data || typeof data.exp !== 'number') return null;
  if (data.exp < Date.now()) return null;
  return data;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/** Read the current admin session (null when signed out / invalid). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const payload = verifyToken(store.get(SESSION_COOKIE)?.value);
  if (!payload) return null;
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  if (!user || !user.isActive) return null;
  return user;
}

export async function setSessionCookie(user: { id: string; name: string; role: string }): Promise<void> {
  const token = createSessionToken(user);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

// ---------------------------------------------------------------- login
// Simple sliding-window rate limit (in-memory). Production: Redis/Upstash.
const loginAttempts = new Map<string, number[]>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function authenticate(
  email: string,
  password: string,
  ip?: string
): Promise<{ ok: true; user: SessionUser } | { ok: false; error: string }> {
  const key = `${ip ?? 'unknown'}::${email.toLowerCase()}`;
  const now = Date.now();
  const attempts = (loginAttempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (attempts.length >= MAX_ATTEMPTS) {
    return { ok: false, error: 'Too many attempts. Try again in 15 minutes.' };
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.isActive) {
    attempts.push(now);
    loginAttempts.set(key, attempts);
    if (user) {
      await prisma.auditLog.create({
        data: { userName: email, action: 'login_failed', entity: 'user', entityId: user.id, ip },
      });
    }
    return { ok: false, error: 'Invalid credentials.' };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    attempts.push(now);
    loginAttempts.set(key, attempts);
    await prisma.auditLog.create({
      data: { userId: user.id, userName: user.email, action: 'login_failed', entity: 'user', entityId: user.id, ip },
    });
    return { ok: false, error: 'Invalid credentials.' };
  }

  loginAttempts.delete(key);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await prisma.auditLog.create({
    data: { userId: user.id, userName: user.email, action: 'login', entity: 'user', entityId: user.id, ip },
  });

  return { ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

// ------------------------------------------------------------- guards
export function deny(message = 'You do not have permission for this action.'): never {
  redirect(`/admin?error=${encodeURIComponent(message)}`);
}

/** Must run in admin server components / server actions. Redirects to /admin/login when signed out. */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  return user;
}

/** Guards a specific permission. */
export async function requirePerm(user: SessionUser, permission: string): Promise<SessionUser> {
  if (!hasPermission(user.role, permission)) deny(`Requires permission: ${permission}`);
  return user;
}

export function roleLabel(role: string): string {
  const { ROLE_LABELS } = require('./permissions') as typeof import('./permissions');
  return ROLE_LABELS[role] ?? role;
}

export type { RoleName };
