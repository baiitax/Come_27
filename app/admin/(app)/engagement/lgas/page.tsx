import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Table, Th, Td, Badge, EmptyState } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function LgasPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const lgas = await prisma.lga.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { submissions: true, events: true, volunteers: true } } } });

  return (
    <div>
      <PageHeader
        crumb="Engagement"
        title="Kano LGAs (44)"
        sub="Structured LGA records with priorities. Population and demographic fields require a verified source before publication — never fabricated."
        right={<Link href="/admin/engagement/lgas/new" className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">+ Add LGA</Link>}
      />
      <Card>
        <Table head={<><Th>LGA</Th><Th>District</Th><Th>Priorities</Th><Th>Submissions</Th><Th>Events</Th><Th>Volunteers</Th></>}>
          {lgas.map((l) => (
            <tr key={l.id} className="hover:bg-[rgba(16,24,40,0.04)]">
              <Td className="font-semibold text-white">{l.name}</Td>
              <Td className="text-xs">{l.senatorialDistrict}</Td>
              <Td className="max-w-[220px] text-xs">{JSON.parse(l.prioritiesJson || '[]').join(', ') || '—'}</Td>
              <Td className="text-xs">{l._count.submissions}</Td>
              <Td className="text-xs">{l._count.events}</Td>
              <Td className="text-xs">{l._count.volunteers}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
