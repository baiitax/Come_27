import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Table, Th, Td, Badge, DemoTag, EmptyState } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';

export const dynamic = 'force-dynamic';

export default async function SpeechesPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const speeches = await prisma.speech.findMany({ orderBy: { eventDate: 'desc' }, take: 100 });

  return (
    <div>
      <PageHeader
        crumb="Content"
        title="Speeches"
        sub="Transcripts, themes, video and audio. Archive, search and timeline integration are generated automatically."
        right={<Link href="/admin/speeches/new" className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">+ New Speech</Link>}
      />
      <Card>
        {speeches.length === 0 ? (
          <EmptyState title="No speeches yet" sub="Add the first speech to build the archive." />
        ) : (
          <Table
            head={
              <>
                <Th>Speech</Th><Th>Event</Th><Th>Date</Th><Th>Location</Th><Th>Status</Th><Th className="text-right">Actions</Th>
              </>
            }
          >
            {speeches.map((s) => (
              <tr key={s.id} className="hover:bg-[rgba(16,24,40,0.04)]">
                <Td>
                  <Link href={`/admin/speeches/${s.id}`} className="font-semibold text-white hover:text-[#9C7427]">{s.title}</Link>
                  <p className="mt-0.5 truncate text-xs text-[#98A2B3]">{s.summary.slice(0, 90)}</p>
                </Td>
                <Td className="text-xs">{s.eventName}</Td>
                <Td className="text-xs tabular-nums">{s.eventDate}</Td>
                <Td className="text-xs">{s.location}</Td>
                <Td><span className="flex items-center gap-2"><Badge tone={statusTone(s.status)}>{s.status}</Badge>{s.isDemo && <DemoTag />}</span></Td>
                <Td className="text-right">
                  <Link href={`/admin/speeches/${s.id}`} className="rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] hover:bg-[rgba(16,24,40,0.04)] hover:text-white">Edit</Link>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
