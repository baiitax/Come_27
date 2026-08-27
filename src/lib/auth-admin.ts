import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { hasPermission, type RoleName } from './permissions';
import { audit } from './audit';
import { createSessionToken, verifySessionToken, sha256hex, getSecret } from './session';

export const SESSION_COOKIE = 'gwarzo_admin_session';
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h
export const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30d ("remember this device")

// ---------------------------------------------------------------- login
const loginAttempts = new Map<string, number[]>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export type LoginResult =
  | { ok: true; user: SessionUser }
  | { ok: false; error: string; code?: 'invalid' | 'inactive' | 'rate' };

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function authenticate(
  email: string,
  password: string,
  ip?: string
): Promise<LoginResult> {
  const key = `${ip ?? 'unknown'}::${email.toLowerCase()}`;
  const now = Date.now();
  const attempts = (loginAttempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (attempts.length >= MAX_ATTEMPTS) {
    return { ok: false, error: 'Too many sign-in attempts. Please wait 15 minutes and try again.', code: 'rate' };
  }

  // Constant-shape timing: always run a bcrypt compare even when user is absent.
  const dummyHash = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO7ZBpQvVzXWvzXWvzXWvzXWvzXWvzXW';
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  const valid = user
    ? await bcrypt.compare(password, user.passwordHash)
    : (await bcrypt.compare(password, dummyHash), false);

  if (!user || !valid) {
    attempts.push(now);
    loginAttempts.set(key, attempts);
    if (user) {
      await prisma.auditLog.create({
        data: { userId: user.id, userName: user.email, action: 'login_failed', entity: 'user', entityId: user.id, ip },
      });
    }
    return { ok: false, error: 'Invalid email or password.', code: 'invalid' };
  }
  if (!user.isActive) {
    return { ok: false, error: 'Your account is inactive. Contact a super administrator.', code: 'inactive' };
  }

  loginAttempts.delete(key);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await prisma.auditLog.create({
    data: { userId: user.id, userName: user.email, action: 'login', entity: 'user', entityId: user.id, ip },
  });

  return { ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

export async function setSessionCookie(user: { id: string; name: string; role: string }, remember = false): Promise<void> {
  const ttl = remember ? REMEMBER_TTL_MS : SESSION_TTL_MS;
  const token = await createSessionToken(user, ttl);
  // server-side session record (revocable: logout truly destroys the session)
  const sid = (JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()) as { sid: string }).sid;
  await prisma.session.create({
    data: { id: sid, userId: user.id, expiresAt: new Date(Date.now() + ttl) },
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ttl / 1000,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      const sid = (JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()) as { sid: string }).sid;
      await prisma.session.deleteMany({ where: { id: sid } });
    } catch { /* malformed token — nothing to revoke */ }
  }
  store.delete(SESSION_COOKIE);
}

/** Read the current admin session (null when signed out / invalid / expired / revoked / deactivated). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const res = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!res.ok) return null;
  // lazy cleanup of expired sessions
  await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }).catch(() => {});
  const session = await prisma.session.findUnique({ where: { id: res.payload.sid } });
  if (!session) return null; // revoked (logout) or unknown
  const user = await prisma.user.findUnique({
    where: { id: res.payload.sub },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  if (!user || !user.isActive) return null;
  return user;
}

// ------------------------------------------------------------- guards
export function deny(message = 'You do not have permission for this area.'): never {
  redirect(`/admin/unauthorized?for=${encodeURIComponent(message)}`);
}

/** Guard for server components / actions. Redirects to /admin/login when signed out. */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  return user;
}

/** Guard for a specific permission. */
export async function requirePerm(user: SessionUser, permission: string): Promise<SessionUser> {
  if (!hasPermission(user.role, permission)) deny(`Requires permission: ${permission}`);
  return user;
}

export type { RoleName };

// ---------------------------------------------------------------- password reset
export async function requestPasswordReset(email: string, ip?: string): Promise<{ devLink?: string }> {
  const clean = email.toLowerCase().trim();
  let devLink: string | undefined;

  const user = await prisma.user.findUnique({ where: { email: clean } });
  if (user && user.isActive) {
    const raw = crypto.getRandomValues(new Uint8Array(32)).reduce((a, b) => a + b.toString(16).padStart(2, '0'), '');
    const hash = await sha256hex(raw);
    await prisma.user.update({
      where: { id: user.id },
      data: { resetTokenHash: hash, resetTokenExpires: new Date(Date.now() + 30 * 60 * 1000) },
    });
    await prisma.auditLog.create({
      data: { userId: user.id, userName: user.email, action: 'password_reset_requested', entity: 'user', entityId: user.id, ip },
    });
    const link = `/admin/reset/${raw}`;
    // Production: deliver via a transactional email provider.
    // Dev: capture in the local outbox (never in production builds).
    if (process.env.NODE_ENV !== 'production') {
      await prisma.devOutbox.create({
        data: {
          to: user.email,
          subject: 'Gwarzo 2027 CMS — password reset',
          body: `Password reset (valid 30 minutes): ${link}\n\nIf you did not request this, you can ignore this message.`,
        },
      });
      devLink = link;
    }
  }
  return { devLink };
}

export async function consumePasswordReset(token: string): Promise<{ ok: boolean; userId?: string }> {
  const hash = await sha256hex(token);
  const user = await prisma.user.findFirst({
    where: { resetTokenHash: hash, resetTokenExpires: { gt: new Date() } },
  });
  if (!user) return { ok: false };
  await prisma.user.update({
    where: { id: user.id },
    data: { resetTokenHash: null, resetTokenExpires: null },
  });
  return { ok: true, userId: user.id };
}

export async function setPassword(userId: string, password: string, ip?: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(password, 12), resetTokenHash: null, resetTokenExpires: null },
  });
  await prisma.auditLog.create({
    data: { userId, userName: 'self-service', action: 'password_reset', entity: 'user', entityId: userId, ip },
  });
}

export { getSecret };
