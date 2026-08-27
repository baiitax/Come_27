/**
 * Gwarzo 2027 CMS — automated authentication session suite.
 * Runs against a PRODUCTION build (`next start`) over real HTTP:
 *   Login → Validate → Authenticate → Secure session → Persist
 *   Middleware guards → Protected routes → Logout → Expired → RBAC
 *
 *   node tests/auth-tests.mjs [baseUrl]
 */

import { createRequire } from 'node:module';
import { randomBytes, createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');

const BASE = process.argv[2] || 'http://localhost:3000';
const EMAIL = 'admin@gwarzo2027.ng';
const PASSWORD = 'Gwarzo@2027!';
const COOKIE = 'gwarzo_admin_session';

const prisma = new PrismaClient();
const results = [];
let sessionCookie = null;

function record(name, pass, detail = '') {
  results.push({ name, pass });
  console.log(`${pass ? '✅ PASS' : '❌ FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
}

async function page(path, cookie) {
  return fetch(BASE + path, { redirect: 'manual', headers: cookie ? { cookie } : {} });
}

function cookieValue(res) {
  const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  const hit = sc.find((c) => c?.startsWith(COOKIE + '='));
  return hit ? hit.split(';')[0].split('=').slice(1).join('=') : null;
}

async function login(email, password, remember = false) {
  return fetch(BASE + '/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, remember, next: '/admin/dashboard' }),
    redirect: 'manual',
  });
}

function forgedToken(expMs, sub, role = 'super_admin') {
  const secret = (readFileSync('.env', 'utf8').match(/AUTH_SECRET="([^"]+)"/) || [])[1];
  const b64u = (s) => Buffer.from(s).toString('base64url');
  const header = b64u(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Date.now();
  const payload = b64u(JSON.stringify({ sub, role, name: 'Forged', iat: now, exp: expMs, sid: randomBytes(16).toString('hex') }));
  const sig = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}

try {
  const admin = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (!admin) throw new Error('admin user missing — run `node prisma/seed.js` first');

  // Test 1: valid login → session cookie → dashboard 200
  {
    const res = await login(EMAIL, PASSWORD);
    const set = cookieValue(res);
    sessionCookie = set ? `${COOKIE}=${set}` : null;
    const dash = sessionCookie ? await page('/admin/dashboard', sessionCookie) : null;
    record(
      '1. Valid login → session → dashboard',
      [303, 307].includes(res.status) && !!sessionCookie && dash?.status === 200,
      `login ${res.status}, cookie ${set ? 'set' : 'MISSING'}, dashboard ${dash?.status ?? 'n/a'}`
    );
  }

  // Test 2: invalid credentials → 401 + meaningful error
  {
    const res = await login(EMAIL, 'WrongPassword123');
    const body = await res.json().catch(() => ({}));
    record('2. Invalid credentials rejected with clear error', res.status === 401 && /Invalid email or password/.test(body.error ?? ''), `status ${res.status}, msg "${body.error}"`);
  }

  // Test 3: session survives refresh
  {
    const res = await page('/admin/dashboard', sessionCookie);
    record('3. Session persists after refresh', res.status === 200, `status ${res.status}`);
  }

  // Test 4: protected routes accessible while authenticated
  {
    const checks = await Promise.all(
      ['/admin/content', '/admin/facts/claims', '/admin/engagement', '/admin/analytics', '/admin/intelligence'].map((p) => page(p, sessionCookie))
    );
    const ok = checks.every((r) => r.status === 200);
    record('4. Protected routes open while authenticated (5 routes)', ok, checks.map((r) => r.status).join(','));
  }

  // Test 5: unauthenticated → /admin/login?next=... (no loop)
  {
    const res = await page('/admin/dashboard');
    const loc = res.headers.get('location') || '';
    const back = loc.includes('/admin/login') ? await page(loc.split('?')[0]) : null;
    record(
      '5. Unauthenticated → /admin/login (no redirect loop)',
      [302, 307].includes(res.status) && loc.includes('/admin/login') && back?.status === 200,
      `${res.status} → ${loc.split('?')[0]}`
    );
  }

  // Test 6: expired session → login?reason=expired
  {
    const expired = forgedToken(Date.now() - 60000, admin.id);
    const res = await fetch(BASE + '/admin/dashboard', { headers: { cookie: `${COOKIE}=${expired}` }, redirect: 'manual' });
    const loc = res.headers.get('location') || '';
    record(
      '6. Expired session → login with reason=expired',
      [302, 307].includes(res.status) && loc.includes('/admin/login') && loc.includes('reason=expired'),
      `${res.status} → ${loc}`
    );
  }

  // Test 7: role restriction → /admin/unauthorized (read_only blocked from settings)
  {
    const bcrypt = require('bcryptjs');
    await prisma.user.upsert({
      where: { email: 'roletest@gwarzo2027.ng' },
      update: { role: 'read_only', isActive: true },
      create: { name: 'Role Test', email: 'roletest@gwarzo2027.ng', role: 'read_only', passwordHash: await bcrypt.hash('RoleTest@2027!', 12) },
    });
    const lres = await login('roletest@gwarzo2027.ng', 'RoleTest@2027!');
    const roleCookie = cookieValue(lres);
    let unauthorizedHit = false;
    let allowedDashboard = false;
    if (roleCookie) {
      const blocked = await fetch(BASE + '/admin/settings', { headers: { cookie: `${COOKIE}=${roleCookie}` }, redirect: 'manual' });
      unauthorizedHit = [302, 307].includes(blocked.status) && (blocked.headers.get('location') || '').includes('/admin/unauthorized');
      const dash = await page('/admin/dashboard', `${COOKIE}=${roleCookie}`);
      allowedDashboard = dash.status === 200;
    }
    await prisma.user.deleteMany({ where: { email: 'roletest@gwarzo2027.ng' } });
    record('7. RBAC: read_only → dashboard ok, settings → unauthorized', unauthorizedHit && allowedDashboard);
  }

  // Test 8: logout destroys the session
  {
    const lres = await fetch(BASE + '/api/admin/logout', { method: 'POST', headers: { cookie: sessionCookie }, redirect: 'manual' });
    const cleared = (lres.headers.getSetCookie ? lres.headers.getSetCookie() : []).some(
      (c) => c?.startsWith(COOKIE + '=') && (c.split(';')[0].split('=').slice(1).join('') === '' || c.includes('Max-Age=0'))
    );
    const after = await page('/admin/dashboard', sessionCookie);
    record(
      '8. Logout destroys the session',
      [302, 303, 307].includes(lres.status) && cleared && [302, 307].includes(after.status) && (after.headers.get('location') || '').includes('/admin/login'),
      `logout ${lres.status}, cookie cleared=${cleared}, dashboard-after ${after.status}`
    );
    sessionCookie = null;
  }

  // Test 9: production build clean — no secrets or DB internals in client payloads
  {
    const res = await page('/admin/login');
    const html = await res.text();
    const secret = (readFileSync('.env', 'utf8').match(/AUTH_SECRET="([^"]+)"/) || [])[1] || '';
    const leaks = secret.length > 8 && html.includes(secret);
    const dbLeak = /DATABASE_URL|postgresql:\/\/|file:.*\.db/.test(html);
    record('9. Production HTML contains no secrets/DB strings', !leaks && !dbLeak);
  }

  // Test 10: rate limiting on repeated bad logins
  {
    let sawRate = false;
    for (let i = 0; i < 6; i++) {
      const r = await login('ratelimit-test@example.com', `BadPass${i}!`);
      if (r.status === 429) { sawRate = true; break; }
    }
    record('10. Brute-force rate limiting (5 attempts / 15 min)', sawRate, sawRate ? '429 returned' : 'no 429 (limit not hit)');
  }
} catch (e) {
  record('SUITE ERROR', false, String(e.message || e));
} finally {
  await prisma.$disconnect();
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${failed === 0 ? '🎉 ALL TESTS PASSED' : `⚠️ ${failed} TEST(S) FAILED`} — ${results.length - failed}/${results.length} passing against ${BASE}`);
  process.exit(failed === 0 ? 0 : 1);
}
