import { prisma } from '@/lib/db';
import { Card, CardHead, Badge, EmptyState } from '@/components/admin/ui';
import { AlertRow } from './alert-row';

export async function AlertsPanel() {
  const alerts = await prisma.alert.findMany({ orderBy: { createdAt: 'desc' }, take: 30 });
  const sevTone: Record<string, 'crimson' | 'gold' | 'neutral' | 'slate'> = { urgent: 'crimson', high: 'gold', medium: 'neutral', low: 'slate' };
  return (
    <Card>
      <CardHead title="Alerts" sub="Automated from live data: volume spikes, stale content, approaching events, verification backlog." />
      {alerts.length === 0 ? <EmptyState title="No alerts" sub="The alert engine will surface operational signals here." /> : (
        <ul className="divide-y divide-white/[0.05]">
          {alerts.map((a) => (
            <li key={a.id} className="px-5 py-3">
              <div className="flex items-center gap-2.5">
                <Badge tone={sevTone[a.severity] ?? 'slate'}>{a.severity}</Badge>
                <p className="flex-1 truncate text-sm font-semibold text-white">{a.title}</p>
                <span className="text-[0.62rem] tabular-nums text-[#5E6A63]">{a.createdAt.toISOString().slice(5, 10)}</span>
              </div>
              <p className="mt-1 text-xs text-[#8A968E]">{a.reason}</p>
              {a.action && <p className="mt-0.5 text-xs text-[#DDBE72]">→ {a.action}</p>}
              <AlertRow id={a.id} resolved={!!a.resolvedAt} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
