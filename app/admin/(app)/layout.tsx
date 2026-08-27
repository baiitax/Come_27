import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth-admin';
import { AdminShell } from '@/components/admin/admin-shell';

export const dynamic = 'force-dynamic';

export default async function AdminAppLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="admin-shell min-h-screen">
      <AdminShell user={{ name: user.name, email: user.email, role: user.role }}>{children}</AdminShell>
    </div>
  );
}
