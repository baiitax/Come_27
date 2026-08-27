import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Table, Th, Td, Badge, DemoTag, EmptyState } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';

export const dynamic = 'force-dynamic';

export default async function ClaimsPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const claims = await prisma.claim.findMany({ orderBy: { updatedAt: 'desc' }, take: 100, include: { source: true, evidences: true } });

  return (
    <div>
      <PageHeader
        crumb="Verification"
        title="Claims"
        sub="Every public claim with its context, source and evidence trail. Verdicts are permission-gated."
        right={<Link href="/admin/facts/claims/new" className="rounded-lg bg-[linear-gradient(135deg,#C0323E,#8E1420)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">+ New Claim</Link>}
      />
      <Card>
        {claims.length === 0 ? (
          <EmptyState title="No claims yet" sub="Register the first claim for verification." />
        ) : (
          <Table head={<><Th>Claim</Th><Th>Category</Th><Th>Verdict</Th><Th>Evidence</Th><Th>Updated</Th><Th className="text-right">Actions</Th></>}>
            {claims.map((c) => (
              <tr key={c.id} className="hover:bg-[rgba(16,24,40,0.04)]">
                <Td>
                  <Link href={`/admin/facts/claims/${c.id}`} className="font-semibold text-white hover:text-[#9C7427]">{c.statement}</Link>
                  <p className="mt-0.5 max-w-lg truncate text-xs text-[#98A2B3]">{c.context}</p>
                </Td>
                <Td className="text-xs">{c.category}</Td>
                <Td>
                  <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                  {c.verifiedBy && <p className="mt-1 text-[0.62rem] text-[#98A2B3]">by {c.verifiedBy}</p>}
                </Td>
                <Td className="text-xs">{c.evidences.length} item(s)</Td>
                <Td className="text-xs tabular-nums">{c.updatedAt.toDateString()}</Td>
                <Td className="text-right">
                  <Link href={`/admin/facts/claims/${c.id}`} className="rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] hover:bg-[rgba(16,24,40,0.04)] hover:text-white">Open</Link>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
