import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { trafficOverview, topContent, issuePulse, lgaEngagement, contentHealth } from '@/lib/stats';
import { PageHeader, Card, CardHead, Table, Th, Td, Badge, EmptyState } from '@/components/admin/ui';
import { TrafficChart } from '@/components/admin/traffic-chart';
import { PeriodSwitch } from './period-switch';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Analytics' };

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ d?: string; tab?: string }> }) {
  const sp = await searchParams;
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const days = (['1', '7', '30', '90'].includes(sp.d ?? '') ? parseInt(sp.d!) : 30) as 1 | 7 | 30 | 90;
  const tab = sp.tab ?? 'traffic';
  const [traffic, top, pulse, lgas, health] = await Promise.all([
    trafficOverview(days),
    topContent(days, 10),
    issuePulse(days),
    lgaEngagement(),
    contentHealth(),
  ]);

  const gradeTone = (g: string) => (g === 'excellent' ? 'green' : g === 'good' ? 'gold' : g === 'needs-attention' ? 'slate' : 'crimson') as 'green' | 'gold' | 'slate' | 'crimson';

  return (
    <div>
      <PageHeader crumb="Command Center" title="Analytics" sub={`Live data only — demo analytics is always excluded. Period: last ${days} days.`} right={<PeriodSwitch days={days} />} />

      <div className="mb-4 flex flex-wrap gap-2">
        {[['traffic', 'Traffic'], ['content', 'Content'], ['engagement', 'Engagement']].map(([k, label]) => (
          <Link key={k} href={`/admin/analytics?d=${days}&tab=${k}`} className={`rounded-full border px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-wide ${tab === k ? 'border-[#C9A24B]/50 bg-[#C9A24B]/10 text-[#DDBE72]' : 'border-white/[0.1] text-[#9AA39C] hover:bg-white/[0.05]'}`}>{label}</Link>
        ))}
      </div>

      {tab === 'traffic' && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['Page views', String(traffic.totalViews)],
              ['Unique sessions', String(traffic.uniqueSessions)],
              ['Top page', traffic.topPages[0]?.path ?? '—'],
              ['Referrers tracked', String(traffic.sources.length)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/[0.07] bg-[#12161A] p-4">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#8A968E]">{label}</p>
                <p className="mt-1 truncate font-display text-xl font-extrabold text-white">{value}</p>
              </div>
            ))}
          </div>
          <Card className="mb-6">
            <CardHead title="Traffic Performance" sub={`Page views vs unique sessions — last ${days} days`} />
            <div className="h-72 px-2 py-3">
              {traffic.byDay.every((d) => d.views === 0) ? (
                <EmptyState title="No traffic in period" sub="Trends activate as real visits arrive." />
              ) : (
                <TrafficChart data={traffic.byDay} />
              )}
            </div>
          </Card>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card>
              <CardHead title="Top Pages" />
              {traffic.topPages.length === 0 ? <EmptyState title="No data" /> : (
                <Table head={<><Th>#</Th><Th>Path</Th><Th className="text-right">Views</Th></>}>
                  {traffic.topPages.map((p, i) => (
                    <tr key={p.path}><Td className="font-bold text-[#8A968E]">{i + 1}</Td><Td className="font-semibold text-white">{p.path}</Td><Td className="text-right font-display font-bold text-[#C9A24B]">{p.views}</Td></tr>
                  ))}
                </Table>
              )}
            </Card>
            <Card>
              <CardHead title="Referring Sources" sub="Coarse domain level only — no individual tracking." />
              {traffic.sources.length === 0 ? <EmptyState title="No referrers" /> : (
                <Table head={<><Th>Source</Th><Th className="text-right">Views</Th></>}>
                  {traffic.sources.map((s) => (
                    <tr key={s.referrer}><Td className="font-semibold text-white">{s.referrer}</Td><Td className="text-right font-display font-bold text-[#C9A24B]">{s.views}</Td></tr>
                  ))}
                </Table>
              )}
            </Card>
          </div>
        </>
      )}

      {tab === 'content' && (
        <>
          <Card className="mb-6">
            <CardHead title="Top Performing Content" sub="Calculated from live page views — never hardcoded." />
            {top.length === 0 ? <EmptyState title="No views recorded yet" sub="Content performance ranks here as the public site receives visits." /> : (
              <Table head={<><Th>#</Th><Th>Content</Th><Th className="text-right">Views</Th></>}>
                {top.map((t, i) => (
                  <tr key={t.path}><Td className="font-bold text-[#8A968E]">{i + 1}</Td><Td className="font-semibold text-white">{t.path}</Td><Td className="text-right font-display font-bold text-[#C9A24B]">{t.views}</Td></tr>
                ))}
              </Table>
            )}
          </Card>
          <Card>
            <CardHead title="Content Health Scores" sub="Recency, SEO metadata, completeness, thin content. Recommendations included." />
            <Table head={<><Th>Content</Th><Th>Score</Th><Th>Grade</Th><Th>Recommendations</Th><Th>Updated</Th></>}>
              {health.slice(0, 12).map((h) => (
                <tr key={h.id} className="hover:bg-white/[0.02]">
                  <Td className="max-w-[260px]"><p className="truncate font-semibold text-white">{h.title}</p><p className="text-[0.65rem] text-[#5E6A63]">{h.path}</p></Td>
                  <Td className="font-display text-lg font-extrabold text-white">{h.score}</Td>
                  <Td><Badge tone={gradeTone(h.grade)}>{h.grade}</Badge></Td>
                  <Td className="max-w-[280px] text-xs">{h.recommendations.join(' · ') || '—'}</Td>
                  <Td className="text-xs tabular-nums">{h.updatedAt.toDateString()}</Td>
                </tr>
              ))}
            </Table>
          </Card>
        </>
      )}

      {tab === 'engagement' && (
        <>
          <Card className="mb-6">
            <CardHead title="Voluntary Engagement — Topic Trend" sub="Aggregated from voluntary community submissions only." />
            {pulse.length === 0 ? <EmptyState title="Insufficient data" sub="Trends appear once voluntary submissions accumulate. No fabricated numbers." /> : (
              <Table head={<><Th>Topic</Th><Th>Current</Th><Th>Previous</Th><Th>Change</Th><Th>Top LGAs</Th></>}>
                {pulse.map((p) => (
                  <tr key={p.topic}>
                    <Td className="font-semibold capitalize text-white">{p.topic}</Td>
                    <Td className="font-display text-lg font-bold text-white">{p.current}</Td>
                    <Td className="text-xs">{p.previous}</Td>
                    <Td>{p.change === null ? <Badge tone="slate">new</Badge> : <span className={`text-xs font-bold ${p.change >= 0 ? 'text-[#4CC39A]' : 'text-[#E06A75]'}`}>{p.change >= 0 ? '+' : ''}{p.change}%</span>}</Td>
                    <Td className="max-w-[220px] text-xs">{p.topLgas.join(', ') || '—'}</Td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
          <Card>
            <CardHead title="LGA Engagement Levels" sub="Neutral labels only: high / medium / low / insufficient data." />
            <div className="grid grid-cols-2 gap-2 px-5 py-4 md:grid-cols-4 xl:grid-cols-6">
              {lgas.map((l) => (
                <div key={l.id} className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2">
                  <p className="truncate text-[0.72rem] font-bold text-white">{l.name}</p>
                  <p className="text-[0.6rem] text-[#8A968E]">{l.level} · {l.submissions + l.events + l.volunteers} signals</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
