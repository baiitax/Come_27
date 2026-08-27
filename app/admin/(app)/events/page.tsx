import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Table, Th, Td, Badge, DemoTag, EmptyState } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const events = await prisma.campaignEvent.findMany({ orderBy: { startsAt: 'desc' }, take: 100, include: { lga: { select: { name: true } } } });

  return (
    <div>
      <PageHeader
        crumb="Content"
        title="Events"
        sub="Rallies, town halls and media events. Statuses: draft, upcoming, live, completed, cancelled, archived."
        right={<Link href="/admin/events/new" className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">+ New Event</Link>}
      />
      <Card>
        {events.length === 0 ? (
          <EmptyState title="No events yet" sub="Create the first event." />
        ) : (
          <Table
            head={
              <>
                <Th>Event</Th><Th>Category</Th><Th>Date</Th><Th>LGA / Venue</Th><Th>Status</Th><Th className="text-right">Actions</Th>
              </>
            }
          >
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-[rgba(16,24,40,0.04)]">
                <Td>
                  <Link href={`/admin/events/${e.id}`} className="font-semibold text-white hover:text-[#9C7427]">{e.name}</Link>
                  <p className="mt-0.5 truncate text-xs text-[#98A2B3]">{e.description.slice(0, 90)}</p>
                </Td>
                <Td className="text-xs">{e.category}</Td>
                <Td className="text-xs tabular-nums">{e.startsAt.toDateString()}</Td>
                <Td className="text-xs">{e.lga?.name ?? e.venue}</Td>
                <Td><span className="flex items-center gap-2"><Badge tone={statusTone(e.status)}>{e.status}</Badge>{e.isDemo && <DemoTag />}</span></Td>
                <Td className="text-right">
                  <Link href={`/admin/events/${e.id}`} className="rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] hover:bg-[rgba(16,24,40,0.04)] hover:text-white">Edit</Link>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
