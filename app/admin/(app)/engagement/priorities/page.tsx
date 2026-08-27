import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth-admin';
import { issuePulse, lgaEngagement } from '@/lib/stats';
import { PageHeader, Card, CardHead, Table, Th, Td, Badge, EmptyState } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function PrioritiesPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const [pulse, lgas] = await Promise.all([issuePulse(30), lgaEngagement()]);

  return (
    <div>
      <PageHeader crumb="Engagement" title="Community Priority Engine" sub="Aggregated from voluntary submissions by topic, LGA, date, volume and trend. If data is insufficient the system says so — never fake percentages." />

      <Card className="mb-6">
        <CardHead title="Topic Pulse (30 days)" sub="Current volume vs previous period, with the LGAs mentioning each topic." />
        {pulse.length === 0 ? (
          <EmptyState title="Insufficient data" sub="Topic aggregation appears once voluntary submissions are collected. No percentages are fabricated." />
        ) : (
          <Table head={<><Th>Topic</Th><Th>Current</Th><Th>Previous</Th><Th>Change</Th><Th>Top LGAs</Th><Th>Trend</Th></>}>
            {pulse.map((p) => (
              <tr key={p.topic} className="hover:bg-[rgba(16,24,40,0.04)]">
                <Td className="font-semibold capitalize text-white">{p.topic}</Td>
                <Td className="font-display text-lg font-bold text-white">{p.current}</Td>
                <Td className="text-xs">{p.previous}</Td>
                <Td>
                  {p.change === null ? <Badge tone="slate">new</Badge> : (
                    <span className={`text-xs font-bold ${p.change >= 0 ? 'text-[#027A48]' : 'text-[#B42318]'}`}>{p.change >= 0 ? '+' : ''}{p.change}%</span>
                  )}
                </Td>
                <Td className="max-w-[200px] text-xs">{p.topLgas.join(', ') || '—'}</Td>
                <Td><Badge tone={p.direction === 'up' ? 'green' : p.direction === 'down' ? 'crimson' : 'neutral'}>{p.direction === 'up' ? 'rising' : p.direction === 'down' ? 'falling' : 'flat'}</Badge></Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Card>
        <CardHead title="LGA Digital Engagement" sub="Neutral engagement levels only — high / medium / low / insufficient. No political labels, ever." />
        <div className="grid grid-cols-2 gap-3 px-5 py-4 md:grid-cols-4 xl:grid-cols-6">
          {lgas.map((l) => (
            <div key={l.id} className={`rounded-lg border px-3 py-2.5 ${l.level === 'high' ? 'border-[#0E8A5A]/40 bg-[#0E8A5A]/[0.07]' : l.level === 'medium' ? 'border-[#C9A24B]/35 bg-[#C9A24B]/[0.06]' : l.level === 'low' ? 'border-[rgba(16,24,40,0.08)] bg-[rgba(16,24,40,0.03)]' : 'border-[rgba(16,24,40,0.08)] bg-transparent'}`}>
              <p className="truncate text-[0.78rem] font-bold text-white">{l.name}</p>
              <p className="text-[0.62rem] text-[#667085]">{l.submissions} sub · {l.events} ev · {l.volunteers} vol</p>
              <Badge tone={l.level === 'high' ? 'green' : l.level === 'medium' ? 'gold' : l.level === 'low' ? 'slate' : 'neutral'} className="mt-1.5">{l.level}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
