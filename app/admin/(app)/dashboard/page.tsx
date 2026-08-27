import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth-admin';
import { dashboardKpis, trafficOverview, topContent, attentionQueue, recentActivity, issuePulse, intelligenceSummary } from '@/lib/stats';
import { Card, CardHead, KpiCard, PageHeader, Badge, Table, Th, Td, EmptyState } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';
import { TrafficChart } from '@/components/admin/traffic-chart';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');

  const [kpis, traffic, top, attention, activity, pulse, intel] = await Promise.all([
    dashboardKpis(),
    trafficOverview(30),
    topContent(30, 6),
    attentionQueue(),
    recentActivity(10),
    issuePulse(30),
    intelligenceSummary(30),
  ]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const sevTone: Record<string, 'crimson' | 'gold' | 'neutral' | 'slate'> = { urgent: 'crimson', high: 'gold', medium: 'neutral', low: 'slate' };

  return (
    <div>
      <PageHeader
        crumb="Command Center"
        title={`${greeting}, ${user.name.split(' ')[0]}`}
        sub="Digital operations overview — content, verification, engagement and traffic at a glance."
      />

      {/* KPI groups */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.website.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.content.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.engagement.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.operations.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* Intelligence summary */}
      <Card className="mt-6 border-[#C9A24B]/25">
        <CardHead title="Digital Intelligence Summary" sub={`Auto-generated ${intel.generatedAt.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} from live data`} right={<Badge tone="gold">live calculations</Badge>} />
        <ul className="space-y-2.5 px-5 py-4">
          {intel.lines.map((line, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-[#C8CFC9]">
              <span aria-hidden className="mt-0.5 text-[#C9A24B]">◆</span>
              {line}
            </li>
          ))}
          {intel.insufficient && (
            <li className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-xs text-[#8A968E]">
              Intelligence activates as genuine traffic and voluntary community data accumulate. No figures are fabricated.
            </li>
          )}
        </ul>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Traffic chart */}
        <Card className="xl:col-span-2">
          <CardHead title="Traffic Performance" sub="Page views and unique sessions — last 30 days (live data, demo excluded)" right={traffic.demo ? <Badge tone="gold">demo excluded</Badge> : undefined} />
          <div className="h-64 px-2 py-3">
            {traffic.byDay.every((d) => d.views === 0) ? (
              <EmptyState title="No traffic recorded yet" sub="Once visitors reach the public site, trends appear here in real time." />
            ) : (
              <TrafficChart data={traffic.byDay} />
            )}
          </div>
        </Card>

        {/* Attention queue */}
        <Card>
          <CardHead title="What Needs Attention?" sub="Operational priority queue" />
          <div className="divide-y divide-white/[0.05]">
            {attention.length === 0 && <EmptyState title="All clear" sub="Nothing is currently waiting on an administrator." />}
            {attention.map((a) => (
              <a key={a.label} href={a.href} className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <Badge tone={sevTone[a.severity] ?? 'slate'}>{a.severity}</Badge>
                  <span className="text-sm text-[#C8CFC9]">{a.label}</span>
                </div>
                <span className="font-display text-lg font-extrabold text-white">{a.count}</span>
              </a>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Top content */}
        <Card className="xl:col-span-2">
          <CardHead title="Content Performance" sub="Most-viewed public pages — last 30 days" right={<a href="/admin/analytics" className="text-xs font-bold text-[#C9A24B] hover:underline">Full analytics →</a>} />
          {top.length === 0 ? (
            <EmptyState title="No page views recorded yet" sub="Top content will rank here once the public site receives visits." />
          ) : (
            <Table
              head={
                <>
                  <Th>#</Th><Th>Page</Th><Th className="text-right">Views</Th>
                </>
              }
            >
              {top.map((t, i) => (
                <tr key={t.path} className="hover:bg-white/[0.02]">
                  <Td className="font-display font-bold text-[#8A968E]">{i + 1}</Td>
                  <Td className="font-semibold text-white">{t.path}</Td>
                  <Td className="text-right font-display font-extrabold text-[#C9A24B]">{t.views}</Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        {/* Digital pulse */}
        <Card>
          <CardHead title="Digital Pulse" sub="Issue trend from voluntary submissions (30d)" right={<a href="/admin/intelligence" className="text-xs font-bold text-[#C9A24B] hover:underline">Intelligence →</a>} />
          {pulse.length === 0 ? (
            <EmptyState title="Insufficient data" sub="Issue pulse appears once community submissions are collected. No figures are fabricated." />
          ) : (
            <div className="space-y-3 px-5 py-4">
              {pulse.slice(0, 5).map((p) => (
                <div key={p.topic} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold capitalize text-[#C8CFC9]">{p.topic}</span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-[#8A968E]">{p.current} sub.</span>
                    <Badge tone={p.direction === 'up' ? 'green' : p.direction === 'down' ? 'crimson' : 'neutral'}>
                      {p.direction === 'up' ? '↑' : p.direction === 'down' ? '↓' : '→'} {p.change === null ? 'new' : `${Math.abs(p.change)}%`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Activity feed */}
      <Card className="mt-6">
        <CardHead title="Live Activity" sub="Every administrative action is captured in the audit trail" right={<a href="/admin/audit" className="text-xs font-bold text-[#C9A24B] hover:underline">Audit log →</a>} />
        {activity.length === 0 ? (
          <EmptyState title="No activity yet" sub="Admin actions (publish, verify, respond…) will stream here." />
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {activity.map((a) => (
              <li key={a.id} className="flex items-center gap-4 px-5 py-3">
                <span className={`h-2 w-2 shrink-0 rounded-full ${a.action === 'create' ? 'bg-[#4CC39A]' : a.action === 'publish' ? 'bg-[#C9A24B]' : a.action === 'delete' ? 'bg-[#E06A75]' : 'bg-[#5E7168]'}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-[#C8CFC9]">
                    <strong className="text-white">{a.actor}</strong> — {a.action} <span className="text-[#8A968E]">{a.entity}</span>
                  </p>
                </div>
                <Badge tone={statusTone(a.action)}>{a.action}</Badge>
                <span className="shrink-0 text-xs tabular-nums text-[#5E6A63]">{a.at.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
