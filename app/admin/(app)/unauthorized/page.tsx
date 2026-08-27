import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';

export const dynamic = 'force-dynamic';

export default async function UnauthorizedPage() {
  const user = await getSessionUser();
  return (
    <div className="admin-shell flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[rgba(16,24,40,0.08)] bg-white/80 p-8 text-center shadow-[0_8px_32px_rgba(16,24,40,0.08)] backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(180,35,24,0.08)] text-xl">⛨</div>
        <h1 className="font-display text-xl font-bold text-[#172033]">You don&apos;t have access to this area</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#667085]">
          {user
            ? `Your current role (${user.role.replace(/_/g, ' ')}) is not permitted here. If you believe this is a mistake, ask a super administrator to adjust your role.`
            : 'Your session does not grant access to this area.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/admin/dashboard" className="rounded-lg bg-[#0E8A5A] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
            Back to dashboard
          </Link>
          <Link href="/admin" className="rounded-lg border border-[rgba(16,24,40,0.12)] px-4 py-2.5 text-sm font-semibold text-[#364152] transition hover:bg-[rgba(16,24,40,0.03)]">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
