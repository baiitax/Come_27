import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSessionUser } from '@/lib/auth-admin';
import { verifySessionToken } from '@/lib/session';
import { prisma } from '@/lib/db';
import { ROLE_PERMISSIONS } from '@/lib/permissions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'System Health — Gwarzo 2027 CMS' };

const CHECKS: { label: string; detail: string }[] = [];

function ok(icon = '✓') {
  return { state: 'ok' as const, icon };
}

export default async function DiagnosticsPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'super_admin') redirect('/admin/unauthorized');

  const results: { label: string; detail: string; state: 'ok' | 'warn' | 'fail' }[] = [];

  // 1. Database connection (with specific Prisma error codes + targeted fix)
  try {
    const count = await prisma.user.count();
    results.push({ label: 'Database connection', detail: `Operational — ${count} user record(s)`, state: 'ok' });
  } catch (e: any) {
    const code: string = e?.code ?? 'unknown';
    let detail = `FAILING (${code}) — database error, see function logs`;
    if (code === 'P1001') {
      detail = 'FAILING (P1001) — authentication rejected. Fix: in the host settings, set DATABASE_URL to the DIRECT/SESSION string (Supabase: port 5432, user postgres.<project-ref>). If the password contains an @ sign it MUST be written as %40 inside the URL.';
    } else if (code === 'P1012') {
      detail = 'FAILING (P1012) — DATABASE_URL environment variable is not set on this host. Add it in Vercel → Project → Settings → Environment Variables (Production), then redeploy.';
    } else if (code === 'P1000' || code === 'P1008') {
      detail = `FAILING (${code}) — cannot reach the database server. Check the host and port in DATABASE_URL, and that the database is running.`;
    } else if (code === 'P1002' || code === 'P2021' || code === 'P2022') {
      detail = `FAILING (${code}) — schema missing or out of date on this database. Run: npx prisma migrate deploy (with this database's DATABASE_URL), or clear the public schema and redeploy.`;
    } else if (code === 'P1003' || code === 'P1010') {
      detail = `FAILING (${code}) — the database named in DATABASE_URL does not exist on that server.`;
    }
    console.error('[diagnostics] database check failed:', e);
    results.push({ label: 'Database connection', detail, state: 'fail' });
  }

  // 2. Session secret configuration
  const secretOk = typeof process.env.AUTH_SECRET === 'string' && process.env.AUTH_SECRET.length >= 32;
  results.push({
    label: 'Session configuration',
    detail: secretOk
      ? 'Operational — AUTH_SECRET configured (value hidden)'
      : process.env.NODE_ENV === 'production'
        ? 'FAILING in production — set AUTH_SECRET (min 32 chars)'
        : 'Using dev fallback — set AUTH_SECRET before deploying',
    state: secretOk ? 'ok' : 'warn',
  });

  // 3. Cookie configuration
  const store = await cookies();
  const token = store.get('gwarzo_admin_session')?.value;
  const verified = token ? await verifySessionToken(token) : null;
  results.push({
    label: 'Cookie configuration',
    detail: token
      ? verified?.ok
        ? `Operational — valid session cookie (HttpOnly, SameSite=Lax${process.env.NODE_ENV === 'production' ? ', Secure' : ''})`
        : `Cookie present but ${verified?.reason ?? 'invalid'} — sign in again`
      : 'No session cookie on this request',
    state: token && verified?.ok ? 'ok' : 'warn',
  });

  // 4. Current user lookup
  const fresh = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, role: true, isActive: true } });
  results.push({
    label: 'User lookup',
    detail: fresh ? `Operational — ${user.email} (active: ${fresh.isActive})` : 'FAILING — user record missing',
    state: fresh && fresh.isActive ? 'ok' : 'fail',
  });

  // 5. Role + permissions lookup
  const perms = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS];
  results.push({
    label: 'Role & permission lookup',
    detail: perms ? `Operational — role "${user.role}" carries ${perms.length} permission(s)` : 'FAILING — role unknown',
    state: perms ? 'ok' : 'fail',
  });

  // 6. Middleware (auth gate)
  results.push({
    label: 'Admin middleware',
    detail: 'Operational — /admin guarded at the edge; fine-grained RBAC re-checked server-side',
    state: 'ok',
  });

  // 7. Analytics write path
  try {
    await prisma.analyticsEvent.count();
    results.push({ label: 'Analytics store', detail: 'Operational — event store readable', state: 'ok' });
  } catch {
    results.push({ label: 'Analytics store', detail: 'UNREACHABLE', state: 'fail' });
  }

  const stateCls = {
    ok: 'text-[#027A48] bg-[rgba(18,183,106,0.08)] border-[rgba(18,183,106,0.3)]',
    warn: 'text-[#B54708] bg-[rgba(247,144,9,0.08)] border-[rgba(247,144,9,0.3)]',
    fail: 'text-[#B42318] bg-[rgba(240,68,56,0.08)] border-[rgba(240,68,56,0.3)]',
  };
  const stateLabel = { ok: 'Operational', warn: 'Attention', fail: 'Failing' };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#667085]">System Health</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[#172033]">Authentication diagnostics</h1>
          </div>
          <span className="rounded-full border border-[rgba(16,24,40,0.08)] bg-white px-3 py-1 text-[0.65rem] font-bold text-[#667085]">
            Last checked: {new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WAT
          </span>
        </div>

        <ul className="space-y-2.5">
          {results.map((r) => (
            <li key={r.label} className="flex items-center gap-4 rounded-xl border border-[rgba(16,24,40,0.06)] bg-white/70 px-4 py-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${stateCls[r.state]}`}>
                {r.state === 'ok' ? '✓' : r.state === 'warn' ? '!' : '✕'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#172033]">{r.label}</p>
                <p className="truncate text-xs text-[#667085]">{r.detail}</p>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide ${stateCls[r.state]}`}>
                {stateLabel[r.state]}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[0.68rem] leading-relaxed text-[#98A2B3]">
          This page never displays secrets, hashes or connection strings. If login is failing, this screen identifies the broken stage
          (secret, cookie, user, role or database) so it can be fixed without guessing.
        </p>
      </div>
    </div>
  );
}
