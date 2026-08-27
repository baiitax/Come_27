import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Table, Th, Td, Badge, EmptyState } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';
import { AuditFilter } from './audit-filter';

export const dynamic = 'force-dynamic';

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ action?: string; user?: string }> }) {
  const sp = await searchParams;
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const logs = await prisma.auditLog.findMany({
    where: {
      ...(sp.action ? { action: sp.action } : {}),
      ...(sp.user ? { userName: { contains: sp.user } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <div>
      <PageHeader crumb="Operations" title="Audit Logs" sub="Every administrative action: user, action, content, old value, new value, IP, timestamp. Searchable and exportable." />
      <Card>
        <AuditFilter actions={['login', 'logout', 'login_failed', 'create', 'update', 'publish', 'unpublish', 'delete', 'restore', 'verify', 'export', 'assign', 'approve']} />
        {logs.length === 0 ? <EmptyState title="No audit entries" sub="Actions will be recorded here as administrators work." /> : (
          <Table head={<><Th>User</Th><Th>Action</Th><Th>Entity</Th><Th>Old value</Th><Th>New value</Th><Th>IP</Th><Th>When</Th></>}>
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-[rgba(16,24,40,0.04)]">
                <Td className="whitespace-nowrap text-xs font-semibold text-white">{l.userName}</Td>
                <Td><Badge tone={statusTone(l.action)}>{l.action}</Badge></Td>
                <Td className="text-xs">{l.entity}{l.entityId && <span className="text-[#98A2B3]"> / {l.entityId.slice(0, 12)}</span>}</Td>
                <Td className="max-w-[180px]"><code className="block truncate text-[0.65rem] text-[#667085]">{l.oldValues ?? '—'}</code></Td>
                <Td className="max-w-[180px]"><code className="block truncate text-[0.65rem] text-[#667085]">{l.newValues ?? '—'}</code></Td>
                <Td className="whitespace-nowrap text-[0.65rem] text-[#98A2B3]">{l.ip ?? '—'}</Td>
                <Td className="whitespace-nowrap text-[0.65rem] tabular-nums text-[#667085]">{l.createdAt.toISOString().slice(0, 16).replace('T', ' ')}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
