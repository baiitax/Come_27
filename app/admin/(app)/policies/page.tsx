import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Table, Th, Td, Badge, EmptyState } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function PoliciesPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const sectors = await prisma.policySector.findMany({ include: { initiatives: true }, orderBy: { name: 'asc' } });

  return (
    <div>
      <PageHeader
        crumb="Content"
        title="Vision & Policy Sectors"
        sub="Kano development priorities by sector — problem statement, approach, objectives, initiatives and metrics."
        right={<Link href="/admin/policies/new" className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">+ New Sector</Link>}
      />
      <Card>
        {sectors.length === 0 ? (
          <EmptyState title="No policy sectors" sub="Add the first development sector." />
        ) : (
          <Table head={<><Th>Sector</Th><Th>Problem Statement</Th><Th>Objectives</Th><Th>Initiatives</Th><Th>Published</Th><Th className="text-right">Actions</Th></>}>
            {sectors.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02]">
                <Td><p className="font-semibold text-white">{s.name}</p><p className="mt-0.5 text-[0.62rem] uppercase tracking-wide text-[#5E6A63]">{s.icon}</p></Td>
                <Td className="max-w-sm text-xs">{s.problemStatement.slice(0, 110)}</Td>
                <Td className="text-xs">{JSON.parse(s.objectivesJson || '[]').length}</Td>
                <Td className="text-xs">{s.initiatives.length}</Td>
                <Td><Badge tone={s.published ? 'green' : 'slate'}>{s.published ? 'live' : 'hidden'}</Badge></Td>
                <Td className="text-right">
                  <Link href={`/admin/policies/${s.id}`} className="rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.06] hover:text-white">Edit</Link>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
