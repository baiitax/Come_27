import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Table, Th, Td, Badge, EmptyState } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function EvidenceIndexPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const evidences = await prisma.evidence.findMany({ include: { claim: true, source: true }, orderBy: { createdAt: 'desc' }, take: 200 });

  return (
    <div>
      <PageHeader crumb="Verification" title="Evidence Repository" sub="All evidence items across claims — documents, URLs, official records, statements, archived references." />
      <Card>
        {evidences.length === 0 ? (
          <EmptyState title="No evidence items" sub="Evidence added to claims appears here." />
        ) : (
          <Table head={<><Th>Evidence</Th><Th>Type</Th><Th>Claim</Th><Th>Source</Th><Th>Added</Th></>}>
            {evidences.map((e) => (
              <tr key={e.id} className="hover:bg-[rgba(16,24,40,0.04)]">
                <Td><p className="font-semibold text-white">{e.title}</p>{e.notes && <p className="text-xs text-[#98A2B3]">{e.notes.slice(0, 90)}</p>}</Td>
                <Td><Badge tone={e.type === 'official-record' ? 'green' : e.type === 'url' ? 'blue' : 'gold'}>{e.type}</Badge></Td>
                <Td className="max-w-[220px] text-xs"><Link href={`/admin/facts/claims/${e.claimId}`} className="hover:text-[#9C7427]">{e.claim.statement.slice(0, 70)}</Link></Td>
                <Td className="text-xs">{e.source?.title ?? '—'}</Td>
                <Td className="text-xs tabular-nums">{e.createdAt.toDateString()}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
