import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Table, Th, Td, Badge, EmptyState } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';

export const dynamic = 'force-dynamic';

export default async function RecordPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const records = await prisma.serviceRecord.findMany({ where: { deletedAt: null }, orderBy: { startDate: 'desc' } });

  return (
    <div>
      <PageHeader
        crumb="Content"
        title="Public-Service Record"
        sub="Each record carries an evidence status. The CMS never allows an unverified claim to display as verified."
        right={<Link href="/admin/record/new" className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">+ New Record</Link>}
      />
      <Card>
        {records.length === 0 ? (
          <EmptyState title="No records yet" sub="Add the first public-service record." />
        ) : (
          <Table head={<><Th>Position</Th><Th>Institution</Th><Th>Period</Th><Th>Location</Th><Th>Impact</Th><Th>Evidence</Th><Th className="text-right">Actions</Th></>}>
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-white/[0.02]">
                <Td><p className="font-semibold text-white">{r.position}</p><p className="mt-0.5 max-w-sm truncate text-xs text-[#5E6A63]">{r.responsibilities}</p></Td>
                <Td className="text-xs">{r.institution}</Td>
                <Td className="text-xs tabular-nums">{r.startDate} – {r.endDate}</Td>
                <Td className="text-xs">{r.location}</Td>
                <Td className="max-w-[160px] text-xs">{r.impact}</Td>
                <Td><Badge tone={statusTone(r.evidenceStatus)}>{r.evidenceStatus}</Badge></Td>
                <Td className="text-right">
                  <Link href={`/admin/record/${r.id}`} className="rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.06] hover:text-white">Edit</Link>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
