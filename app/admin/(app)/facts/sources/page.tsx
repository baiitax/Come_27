import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Table, Th, Td, Badge, EmptyState } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';

export const dynamic = 'force-dynamic';

export default async function SourcesPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const sources = await prisma.source.findMany({ orderBy: { title: 'asc' }, include: { _count: { select: { claims: true } } } });

  return (
    <div>
      <PageHeader
        crumb="Verification"
        title="Source Registry"
        sub="Centralized, reusable sources across claims and records — with reliability classification."
        right={<Link href="/admin/facts/sources/new" className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">+ New Source</Link>}
      />
      <Card>
        {sources.length === 0 ? (
          <EmptyState title="No sources yet" sub="Register the first source." />
        ) : (
          <Table head={<><Th>Source</Th><Th>Publisher</Th><Th>Type</Th><Th>Reliability</Th><Th>Claims</Th><Th>Verified</Th><Th className="text-right">Actions</Th></>}>
            {sources.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02]">
                <Td><Link href="/admin/facts/sources/new" className="font-semibold text-white hover:text-[#C9A24B]">{s.title}</Link>{s.url && <p className="truncate text-[0.65rem] text-[#5E6A63]">{s.url}</p>}</Td>
                <Td className="text-xs">{s.publisher}</Td>
                <Td className="text-xs">{s.type}</Td>
                <Td><Badge tone={s.reliability === 'official' || s.reliability === 'high' ? 'green' : s.reliability === 'low' || s.reliability === 'unverified' ? 'gold' : 'neutral'}>{s.reliability}</Badge></Td>
                <Td className="text-xs">{s._count.claims}</Td>
                <Td className="text-xs tabular-nums">{s.verifiedAt ? s.verifiedAt.toDateString() : '—'}</Td>
                <Td className="text-right">
                  <Link href="/admin/facts/sources/new" className="rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.06] hover:text-white">New</Link>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
