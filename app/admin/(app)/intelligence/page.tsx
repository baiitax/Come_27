import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { intelligenceSummary, issuePulse, lgaEngagement, attentionQueue } from '@/lib/stats';
import { PageHeader, Card, CardHead, Table, Th, Td, Badge, EmptyState } from '@/components/admin/ui';
import { AlertsPanel } from './alerts-panel';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Intelligence' };

export default async function IntelligencePage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const [intel, pulse, lgas, attention] = await Promise.all([
    intelligenceSummary(30),
    issuePulse(30),
    lgaEngagement(),
    attentionQueue(),
  ]);
  const sevTone: Record<string, 'crimson' | 'gold' | 'neutral' | 'slate'> = { urgent: 'crimson', high: 'gold', medium: 'neutral', low: 'slate' };

  return (
    <div>
      <PageHeader
        crumb="Command Center"
        title="Digital Intelligence Center"
        sub="Operational intelligence from legitimate, aggregate website and public-engagement data. No individual profiling. No persuasion scoring. No fabricated insight."
      />

      <Card className="mb-6 border-[#C9A24B]/25">
        <CardHead title="Digital Intelligence Summary" sub={`Auto-generated ${intel.generatedAt.toLocaleString('en-GB')} from real data`} right={<Badge tone="gold">calculated, not invented</Badge>} />
        <ul className="space-y-2.5 px-5 py-4">
          {intel.lines.map((line, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-[#C8CFC9]">
              <span aria-hidden className="mt-0.5 text-[#C9A24B]">◆</span>
              {line}
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead title="Issue Pulse" sub="Voluntary submissions by topic — current, previous period, growth, LGAs mentioning." right={<Link href="/admin/engagement/priorities" className="text-xs font-bold text-[#C9A24B] hover:underline">Full engine →</Link>} />
          {pulse.length === 0 ? (
            <EmptyState title="Insufficient data" sub="Issue pulse requires accumulated voluntary submissions. The system reports insufficient data rather than inventing trends." />
          ) : (
            <Table head={<><Th>Issue</Th><Th>Submissions</Th><Th>Previous</Th><Th>Change</Th><Th>LGAs</Th><Th>Trend</Th></>}>
              {pulse.map((p) => (
                <tr key={p.topic} className="hover:bg-white/[0.02]">
                  <Td className="font-semibold capitalize text-white">{p.topic}</Td>
                  <Td className="font-display text-lg font-bold text-white">{p.current}</Td>
                  <Td className="text-xs">{p.previous}</Td>
                  <Td>{p.change === null ? <Badge tone="slate">new</Badge> : <span className={`text-xs font-bold ${p.change >= 0 ? 'text-[#4CC39A]' : 'text-[#E06A75]'}`}>{p.change >= 0 ? '+' : ''}{p.change}%</span>}</Td>
                  <Td className="max-w-[180px] text-xs">{p.topLgas.join(', ') || '—'}</Td>
                  <Td><Badge tone={p.direction === 'up' ? 'green' : p.direction === 'down' ? 'crimson' : 'neutral'}>{p.direction === 'up' ? '↑ rising' : p.direction === 'down' ? '↓ falling' : '→ flat'}</Badge></Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        <Card>
          <CardHead title="What Needs Attention?" sub="Operational priority queue" />
          {attention.length === 0 ? <EmptyState title="All clear" /> : (
            <ul className="divide-y divide-white/[0.05]">
              {attention.map((a) => (
                <li key={a.label}>
                  <Link href={a.href} className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-white/[0.03]">
                    <span className="flex items-center gap-2.5"><Badge tone={sevTone[a.severity] ?? 'slate'}>{a.severity}</Badge><span className="text-sm text-[#C8CFC9]">{a.label}</span></span>
                    <span className="font-display text-lg font-extrabold text-white">{a.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead title="LGA Digital Engagement Map" sub="Aggregate signals per LGA — neutral labels only (high / medium / low / insufficient). No political classification." />
          <div className="grid grid-cols-2 gap-2 px-5 py-4 md:grid-cols-4">
            {lgas.map((l) => (
              <div key={l.id} className={`rounded-lg border px-3 py-2 ${l.level === 'high' ? 'border-[#0E8A5A]/40 bg-[#0E8A5A]/[0.07]' : l.level === 'medium' ? 'border-[#C9A24B]/35 bg-[#C9A24B]/[0.06]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                <p className="truncate text-[0.72rem] font-bold text-white">{l.name}</p>
                <p className="text-[0.58rem] uppercase tracking-wide text-[#8A968E]">{l.level}</p>
              </div>
            ))}
          </div>
        </Card>
        <AlertsPanel />
      </div>
    </div>
  );
}
