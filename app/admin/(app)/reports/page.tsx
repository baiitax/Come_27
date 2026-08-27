import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Badge, EmptyState } from '@/components/admin/ui';
import { ReportButton } from './report-button';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const reports = await prisma.report.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });

  return (
    <div>
      <PageHeader crumb="Operations" title="Reports" sub="Daily Digital Brief, Weekly Digital Report and Monthly Executive Report — generated from live data, printable and exportable." />
      <Card className="mb-6">
        <CardHead title="Generate" />
        <div className="flex flex-wrap gap-3 px-5 py-4">
          <ReportButton kind="daily" label="Daily Digital Brief" desc="Traffic, top content, engagement, new submissions, issues, alerts, editorial priorities." />
          <ReportButton kind="weekly" label="Weekly Digital Report" desc="Traffic comparison, content performance, community issues, media, events, fact-check status." />
          <ReportButton kind="monthly" label="Monthly Executive Report" desc="Digital growth, content performance, engagement, LGA trends, policy-interest, recommendations." />
        </div>
      </Card>
      <Card>
        <CardHead title="Generated Reports" sub="Latest first. Each report is a JSON snapshot — printable and CSV-exportable." />
        {reports.length === 0 ? <EmptyState title="No reports yet" sub="Generate the first report above." /> : (
          <ul className="divide-y divide-white/[0.05]">
            {reports.map((r) => {
              const data = JSON.parse(r.dataJson);
              return (
                <li key={r.id} className="px-5 py-3.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone={r.kind === 'daily' ? 'blue' : r.kind === 'weekly' ? 'gold' : 'green'}>{r.kind}</Badge>
                    <span className="text-sm font-semibold text-white">
                      {r.kind === 'daily' ? 'Daily Digital Brief' : r.kind === 'weekly' ? 'Weekly Digital Report' : 'Monthly Executive Report'}
                    </span>
                    <span className="text-xs tabular-nums text-[#5E6A63]">{r.createdAt.toISOString().slice(0, 16).replace('T', ' ')}</span>
                    <span className="ml-auto flex gap-2">
                      <button type="button" onClick={() => window.print()} className="rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.06]">Print</button>
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#8A968E]">
                    {data.pageViews ?? 0} page views · {data.communitySubmissions ?? 0} community submissions · {data.claimsAwaitingVerification ?? 0} claims awaiting verification · {data.openAlerts ?? 0} open alerts. {data.disclaimer}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
