import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { roleLabel } from '@/lib/auth-admin-client';
import { PageHeader, Card, Table, Th, Td, Badge, EmptyState } from '@/components/admin/ui';
import { UserRow } from './user-row';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const me = await getSessionUser();
  if (!me) redirect('/admin/login');
  if (!['super_admin'].includes(me.role) && me.role !== 'content_admin') {
    return <div><PageHeader crumb="System" title="Users" sub="Insufficient permissions." /></div>;
  }
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <div>
      <PageHeader
        crumb="System"
        title="Users"
        sub="Campaign personnel with role-based access. Passwords are bcrypt-hashed (cost 12); MFA-ready architecture."
        right={<Link href="/admin/users/new" className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">+ New User</Link>}
      />
      <Card>
        {users.length === 0 ? <EmptyState title="No users" /> : (
          <Table head={<><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Status</Th><Th>Last login</Th><Th className="text-right">Actions</Th></>}>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[rgba(16,24,40,0.04)]">
                <Td className="font-semibold text-white">{u.name}</Td>
                <Td className="text-xs">{u.email}</Td>
                <Td><Badge tone={u.role === 'super_admin' ? 'crimson' : 'green'}>{roleLabel(u.role)}</Badge></Td>
                <Td><Badge tone={u.isActive ? 'green' : 'slate'}>{u.isActive ? 'active' : 'disabled'}</Badge></Td>
                <Td className="text-xs tabular-nums">{u.lastLoginAt ? u.lastLoginAt.toISOString().slice(0, 16).replace('T', ' ') : 'never'}</Td>
                <Td className="text-right"><UserRow id={u.id} active={u.isActive} self={u.id === me.id} /></Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
