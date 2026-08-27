import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Table, Th, Td, Badge, DemoTag, EmptyState } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';
import { SubmissionRow } from './submission-row';

export const dynamic = 'force-dynamic';

export default async function EngagementPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const [submissions, lgas, counts] = await Promise.all([
    prisma.communitySubmission.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { lga: true } }),
    prisma.lga.findMany({ orderBy: { name: 'asc' } }),
    prisma.communitySubmission.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);
  const statusMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));

  return (
    <div>
      <PageHeader crumb="Engagement" title="Community Submissions" sub="Questions, community priorities and development ideas submitted through the public form. Workflow: New → Acknowledged → Under review → Assigned → Responded → Resolved." />
      <div className="mb-4 flex flex-wrap gap-2">
        {['new', 'acknowledged', 'under-review', 'assigned', 'responded', 'resolved', 'archived'].map((s) => (
          <Badge key={s} tone={statusTone(s)}>{s} · {statusMap[s] ?? 0}</Badge>
        ))}
      </div>
      <Card>
        {submissions.length === 0 ? (
          <EmptyState title="No submissions yet" sub="When the public form receives submissions they appear here for triage." />
        ) : (
          <Table head={<><Th>Date</Th><Th>Message</Th><Th>LGA</Th><Th>Topic</Th><Th>From</Th><Th>Status</Th><Th>Priority</Th><Th className="text-right">Actions</Th></>}>
            {submissions.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02]">
                <Td className="whitespace-nowrap text-xs tabular-nums">{s.createdAt.toISOString().slice(0, 10)}</Td>
                <Td className="max-w-md">
                  <p className="truncate text-sm">{s.message.slice(0, 120)}</p>
                  {s.response && <p className="mt-0.5 truncate text-[0.65rem] text-[#4CC39A]">↳ responded</p>}
                </Td>
                <Td className="text-xs">{s.lga?.name ?? '—'}</Td>
                <Td className="text-xs capitalize">{s.topicName}</Td>
                <Td className="text-xs">{s.name ?? 'Anonymous'}</Td>
                <Td><span className="flex items-center gap-2"><Badge tone={statusTone(s.status)}>{s.status}</Badge>{s.isDemo && <DemoTag />}</span></Td>
                <Td><Badge tone={s.priority === 'high' ? 'crimson' : s.priority === 'low' ? 'slate' : 'neutral'}>{s.priority}</Badge></Td>
                <Td className="text-right">
                  <SubmissionRow id={s.id} status={s.status} priority={s.priority} assignedTo={s.assignedTo ?? ''} response={s.response} internalNotes={s.internalNotes} canRespond={user.role !== 'read_only' && user.role !== 'reviewer'} canDelete={user.role === 'super_admin'} />
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
