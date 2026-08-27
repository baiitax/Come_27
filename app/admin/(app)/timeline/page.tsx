import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Table, Th, Td, Badge, EmptyState } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';
import { TimelineRow } from './row-actions';

export const dynamic = 'force-dynamic';

export default async function TimelinePage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const entries = await prisma.timelineEntry.findMany({ where: { deletedAt: null }, orderBy: { sort: 'asc' } });

  return (
    <div>
      <PageHeader
        crumb="Content"
        title="Political Journey Timeline"
        sub="The candidate's journey from teaching to the 2027 candidacy. Chronological sorting with manual ordering."
        right={<Link href="/admin/timeline/new" className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">+ New Entry</Link>}
      />
      <Card>
        {entries.length === 0 ? (
          <EmptyState title="No timeline entries" sub="Add the first chapter of the journey." />
        ) : (
          <Table head={<><Th>Year</Th><Th>Milestone</Th><Th>Institution</Th><Th>Location</Th><Th>Evidence</Th><Th>Published</Th><Th className="text-right">Actions</Th></>}>
            {entries.map((e, i) => (
              <tr key={e.id} className="hover:bg-white/[0.02]">
                <Td className="font-display font-bold text-[#C9A24B]">{e.year}</Td>
                <Td><p className="font-semibold text-white">{e.title}</p><p className="mt-0.5 max-w-md truncate text-xs text-[#5E6A63]">{e.description}</p></Td>
                <Td className="text-xs">{e.institution}</Td>
                <Td className="text-xs">{e.location}</Td>
                <Td><Badge tone={statusTone(e.evidenceLevel)}>{e.evidenceLevel}</Badge></Td>
                <Td><Badge tone={e.published ? 'green' : 'slate'}>{e.published ? 'live' : 'hidden'}</Badge></Td>
                <Td className="text-right"><TimelineRow id={e.id} canUp={i > 0} canDown={i < entries.length - 1} sort={e.sort} /></Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
