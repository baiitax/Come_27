import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth-admin';
import { ROLES } from '@/lib/permissions';
import { ROLE_PERMISSIONS } from '@/lib/permissions';
import { PageHeader, Card, CardHead, Badge } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function RolesPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');

  return (
    <div>
      <PageHeader crumb="System" title="Roles & Permissions" sub="Granular permission matrix. Permissions are enforced server-side on every action — the UI never replaces the guard." />
      <div className="space-y-4">
        {ROLES.map((r) => (
          <Card key={r.name}>
            <CardHead title={r.label} sub={r.description} right={<Badge tone={r.name === 'super_admin' ? 'crimson' : 'green'}>{r.name}</Badge>} />
            <div className="flex flex-wrap gap-1.5 px-5 py-4">
              {(ROLE_PERMISSIONS[r.name] ?? []).map((p) => (
                <code key={p} className="rounded bg-white/[0.04] px-2 py-1 text-[0.68rem] text-[#C8CFC9]">{p}</code>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
