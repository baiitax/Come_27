import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Table, Th, Td, Badge, EmptyState, DemoTag } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';
import { VolunteerRow } from '../volunteer-row';

export const dynamic = 'force-dynamic';

export default async function VolunteersPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const vols = await prisma.volunteer.findMany({ orderBy: { createdAt: 'desc' }, take: 200, include: { lga: true } });

  return (
    <div>
      <PageHeader crumb="Engagement" title="Volunteers" sub="Registrations from the public volunteer form." />
      <Card>
        {vols.length === 0 ? (
          <EmptyState title="No volunteers yet" sub="Volunteer registrations appear here." />
        ) : (
          <Table head={<><Th>Name</Th><Th>Contact</Th><Th>LGA</Th><Th>Skills</Th><Th>Status</Th><Th>Joined</Th><Th className="text-right">Actions</Th></>}>
            {vols.map((v) => (
              <tr key={v.id} className="hover:bg-white/[0.02]">
                <Td className="font-semibold text-white">{v.name}{v.name.startsWith('[DEMO') && <DemoTag />}</Td>
                <Td className="max-w-[180px] truncate text-xs">{[v.phone, v.email].filter(Boolean).join(' · ') || '—'}</Td>
                <Td className="text-xs">{v.lga?.name ?? '—'}</Td>
                <Td className="max-w-[160px] truncate text-xs">{v.skills}</Td>
                <Td><Badge tone={statusTone(v.status)}>{v.status}</Badge></Td>
                <Td className="text-xs tabular-nums">{v.createdAt.toDateString()}</Td>
                <Td className="text-right"><VolunteerRow id={v.id} status={v.status} canManage={user.role !== 'read_only'} /></Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
