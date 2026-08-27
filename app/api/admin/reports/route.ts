import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';
import { hasPermission } from '@/lib/permissions';

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
  if (!hasPermission(user.role, 'reports.generate')) return NextResponse.json({ error: 'You do not have permission to generate reports.' }, { status: 403 });
  const { kind } = (await req.json().catch(() => ({}))) as { kind?: string };
  if (!['daily', 'weekly', 'monthly'].includes(kind ?? '')) return NextResponse.json({ error: 'Invalid report kind.' }, { status: 400 });
  const days = kind === 'daily' ? 1 : kind === 'weekly' ? 7 : 30;
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const [views, topPages, subs, claimsOpen, alerts] = await Promise.all([
    prisma.analyticsEvent.count({ where: { isDemo: false, type: 'page_view', createdAt: { gte: from } } }),
    prisma.analyticsEvent.groupBy({ by: ['path'], where: { isDemo: false, type: 'page_view', createdAt: { gte: from } }, _count: { _all: true }, orderBy: { _count: { path: 'desc' } }, take: 10 }),
    prisma.communitySubmission.count({ where: { isDemo: false, createdAt: { gte: from } } }),
    prisma.claim.count({ where: { status: 'under-review' } }),
    prisma.alert.count({ where: { resolvedAt: null } }),
  ]);
  const data = {
    kind, generatedAt: new Date().toISOString(), periodDays: days,
    pageViews: views, topPages: topPages.map((p) => ({ path: p.path, views: p._count._all })),
    communitySubmissions: subs, claimsAwaitingVerification: claimsOpen, openAlerts: alerts,
    disclaimer: views === 0 && subs === 0 ? 'No genuine activity in period — figures reflect live data only (demo analytics excluded).' : 'Live data (demo excluded).',
  };
  const r = await prisma.report.create({ data: { kind: kind!, dataJson: JSON.stringify(data) } });
  await audit({ user, action: 'export', entity: 'report', entityId: r.id, newValues: { kind } });
  revalidatePath('/admin/reports');
  return { ok: true, id: r.id, data };
}
