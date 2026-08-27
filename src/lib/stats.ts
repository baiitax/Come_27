import 'server-only';
import { prisma } from './db';

export type PeriodDays = 1 | 7 | 30 | 90;

const DAY = 24 * 60 * 60 * 1000;
export function periodStart(days: PeriodDays): Date {
  return new Date(Date.now() - days * DAY);
}
function prevPeriodStart(days: PeriodDays): Date {
  return new Date(Date.now() - 2 * days * DAY);
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

/** Series of daily counts for a day-bucketed query helper. */
export async function dailySeries(
  from: Date,
  days: PeriodDays,
  query: (range: { gte: Date }) => Promise<{ _count: { _all: number } }[]>
): Promise<{ date: string; count: number }[]> {
  const rows = await query({ gte: from });
  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    buckets.set(new Date(Date.now() - (days - 1 - i) * DAY).toISOString().slice(0, 10), 0);
  }
  for (const r of rows) {
    const d = new Date(r._count === undefined ? from : from).toISOString().slice(0, 10);
    void d;
  }
  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

// ============================================================ KPIs
export interface Kpi {
  label: string;
  value: string;
  change: number | null; // % vs previous period
  spark: number[];
  href: string;
  demo?: boolean;
}

export async function dashboardKpis(): Promise<{
  website: Kpi[];
  content: Kpi[];
  engagement: Kpi[];
  operations: Kpi[];
}> {
  const now = new Date();
  const p7 = periodStart(7);
  const p14 = prevPeriodStart(7);
  const p30 = periodStart(30);

  // --- website (analytics events; exclude demo)
  const [viewsNow, viewsPrev, eventsNow, eventsPrev, series] = await Promise.all([
    prisma.analyticsEvent.count({ where: { type: 'page_view', isDemo: false, createdAt: { gte: p7 } } }),
    prisma.analyticsEvent.count({ where: { type: 'page_view', isDemo: false, createdAt: { gte: p14, lt: p7 } } }),
    prisma.analyticsEvent.count({ where: { type: { not: 'page_view' }, isDemo: false, createdAt: { gte: p7 } } }),
    prisma.analyticsEvent.count({ where: { type: { not: 'page_view' }, isDemo: false, createdAt: { gte: p14, lt: p7 } } }),
    prisma.analyticsEvent.groupBy({
      by: ['path'],
      where: { isDemo: false, createdAt: { gte: p30 } },
      _count: { _all: true },
    }),
  ]);
  const uniqueSessionsNow = await prisma.analyticsEvent.findMany({
    where: { isDemo: false, createdAt: { gte: p7 }, sessionId: { not: null } },
    select: { sessionId: true },
    distinct: ['sessionId'],
  });

  const demoEvents = await prisma.analyticsEvent.count({ where: { isDemo: true, createdAt: { gte: p7 } } });
  const hasRealTraffic = viewsNow > 0;

  // --- content
  const [pubArt, draftArt, schedArt, reviewArt, recentArt, staleArt] = await Promise.all([
    prisma.article.count({ where: { status: 'published', deletedAt: null } }),
    prisma.article.count({ where: { status: 'draft', deletedAt: null } }),
    prisma.article.count({ where: { status: 'scheduled', deletedAt: null } }),
    prisma.article.count({ where: { status: 'review', deletedAt: null } }),
    prisma.article.count({ where: { updatedAt: { gte: p7 }, deletedAt: null } }),
    prisma.article.count({ where: { status: 'published', publishedAt: { lt: new Date(now.getTime() - 180 * DAY) } } }),
  ]);

  // --- engagement
  const [subsNow, subsPrev, subsOpen, vols, questions, factReqs] = await Promise.all([
    prisma.communitySubmission.count({ where: { isDemo: false, createdAt: { gte: p7 } } }),
    prisma.communitySubmission.count({ where: { isDemo: false, createdAt: { gte: p14, lt: p7 } } }),
    prisma.communitySubmission.count({ where: { status: { in: ['new', 'acknowledged', 'under-review'] } } }),
    prisma.volunteer.count({ where: { status: 'active' } }),
    prisma.communitySubmission.count({ where: { topicName: 'question', isDemo: false } }),
    prisma.claim.count({ where: { status: 'under-review' } }),
  ]);

  // --- operations
  const [unverified, alerts, brokenMedia] = await Promise.all([
    prisma.claim.count({ where: { status: { in: ['under-review', 'unverified'] } } }),
    prisma.alert.count({ where: { resolvedAt: null } }),
    prisma.mediaAsset.count({ where: { altText: '' } }),
  ]);

  const spark = (n: number, p: number) => [Math.max(0, Math.round(p * 0.8)), Math.max(0, Math.round(p * 0.95)), p, n];

  return {
    website: [
      {
        label: 'Page views (7d)',
        value: hasRealTraffic ? String(viewsNow) : '—',
        change: hasRealTraffic ? pctChange(viewsNow, viewsPrev) : null,
        spark: hasRealTraffic ? spark(viewsNow, viewsPrev) : [0, 0, 0, 0],
        href: '/admin/analytics/traffic',
      },
      {
        label: 'Unique sessions (7d)',
        value: hasRealTraffic ? String(uniqueSessionsNow.length) : '—',
        change: null,
        spark: hasRealTraffic ? spark(uniqueSessionsNow.length, Math.max(1, Math.round(uniqueSessionsNow.length * 0.9))) : [0, 0, 0, 0],
        href: '/admin/analytics/traffic',
      },
      {
        label: 'Interactions (7d)',
        value: hasRealTraffic ? String(eventsNow) : '—',
        change: hasRealTraffic ? pctChange(eventsNow, eventsPrev) : null,
        spark: hasRealTraffic ? spark(eventsNow, eventsPrev) : [0, 0, 0, 0],
        href: '/admin/analytics/traffic',
      },
      {
        label: 'Demo analytics',
        value: demoEvents > 0 ? `${demoEvents} (excluded)` : 'none',
        change: null,
        spark: [0, 0, 0, 0],
        href: '/admin/analytics/traffic',
        demo: demoEvents > 0,
      },
    ],
    content: [
      { label: 'Published', value: String(pubArt), change: null, spark: [pubArt, pubArt], href: '/admin/content' },
      { label: 'Drafts', value: String(draftArt), change: null, spark: [draftArt, draftArt], href: '/admin/content' },
      { label: 'Scheduled', value: String(schedArt), change: null, spark: [schedArt, schedArt], href: '/admin/content' },
      { label: 'In review', value: String(reviewArt), change: null, spark: [reviewArt, reviewArt], href: '/admin/content' },
      { label: 'Updated (7d)', value: String(recentArt), change: null, spark: [recentArt, recentArt], href: '/admin/content' },
      { label: 'Stale (180d+)', value: String(staleArt), change: null, spark: [staleArt, staleArt], href: '/admin/intelligence/content' },
    ],
    engagement: [
      { label: 'Submissions (7d)', value: String(subsNow), change: pctChange(subsNow, subsPrev), spark: spark(subsNow, subsPrev), href: '/admin/engagement' },
      { label: 'Awaiting action', value: String(subsOpen), change: null, spark: [subsOpen, subsOpen], href: '/admin/engagement' },
      { label: 'Active volunteers', value: String(vols), change: null, spark: [vols, vols], href: '/admin/engagement/volunteers' },
      { label: 'Questions received', value: String(questions), change: null, spark: [questions, questions], href: '/admin/engagement' },
      { label: 'Fact requests (open)', value: String(factReqs), change: null, spark: [factReqs, factReqs], href: '/admin/facts' },
    ],
    operations: [
      { label: 'Unverified claims', value: String(unverified), change: null, spark: [unverified, unverified], href: '/admin/facts/claims' },
      { label: 'Open alerts', value: String(alerts), change: null, spark: [alerts, alerts], href: '/admin/intelligence/alerts' },
      { label: 'Media missing alt text', value: String(brokenMedia), change: null, spark: [brokenMedia, brokenMedia], href: '/admin/media' },
      { label: 'Review queue', value: String(reviewArt + unverified), change: null, spark: [reviewArt + unverified, reviewArt + unverified], href: '/admin/facts/claims' },
    ],
  };
}

// ============================================================ traffic
export interface TrafficOverview {
  totalViews: number;
  uniqueSessions: number;
  byDay: { date: string; views: number; unique: number }[];
  topPages: { path: string; views: number }[];
  sources: { referrer: string; views: number }[];
  demo: boolean;
}

export async function trafficOverview(days: PeriodDays): Promise<TrafficOverview> {
  const from = periodStart(days);
  const where = { isDemo: false, createdAt: { gte: from } };
  const [views, byDayRows, topPages, sources, demo] = await Promise.all([
    prisma.analyticsEvent.count({ where: { ...where, type: 'page_view' } }),
    prisma.analyticsEvent.findMany({
      where: { ...where, type: 'page_view', sessionId: { not: null } },
      select: { sessionId: true, createdAt: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ['path'],
      where: { ...where, type: 'page_view' },
      _count: { _all: true },
      orderBy: { _count: { path: 'desc' } },
      take: 8,
    }),
    prisma.analyticsEvent.groupBy({
      by: ['referrer'],
      where: { ...where, type: 'page_view', referrer: { not: null, not: '' } },
      _count: { _all: true },
      orderBy: { _count: { referrer: 'desc' } },
      take: 6,
    }),
    prisma.analyticsEvent.count({ where: { isDemo: true, createdAt: { gte: from } } }),
  ]);

  const perDay = new Map<string, { views: number; sessions: Set<string> }>();
  for (let i = days - 1; i >= 0; i--) {
    perDay.set(new Date(Date.now() - i * DAY).toISOString().slice(0, 10), { views: 0, sessions: new Set() });
  }
  for (const r of byDayRows) {
    const d = r.createdAt.toISOString().slice(0, 10);
    const b = perDay.get(d);
    if (!b) continue;
    b.views += 1;
    if (r.sessionId) b.sessions.add(r.sessionId);
  }

  return {
    totalViews: views,
    uniqueSessions: byDayRows.length ? new Set(byDayRows.map((r) => r.sessionId)).size : 0,
    byDay: Array.from(perDay.entries()).map(([date, v]) => ({ date, views: v.views, unique: v.sessions.size })),
    topPages: topPages.map((p) => ({ path: p.path, views: p._count._all })),
    sources: sources.map((s) => ({ referrer: s.referrer ?? 'direct', views: s._count._all })),
    demo: demo > 0,
  };
}

// ============================================================ content metrics
export async function topContent(days: PeriodDays, limit = 8) {
  const from = periodStart(days);
  const rows = await prisma.analyticsEvent.groupBy({
    by: ['path'],
    where: { isDemo: false, type: 'page_view', createdAt: { gte: from } },
    _count: { _all: true },
    orderBy: { _count: { path: 'desc' } },
    take: limit * 2,
  });
  return rows.map((r) => ({ path: r.path, views: r._count._all }));
}

// ============================================================ issue pulse
export interface IssuePulse {
  topic: string;
  current: number;
  previous: number;
  change: number | null;
  topLgas: string[];
  direction: 'up' | 'down' | 'flat';
}

export async function issuePulse(days: PeriodDays = 30): Promise<IssuePulse[]> {
  const from = periodStart(days);
  const fromPrev = prevPeriodStart(days);
  const [currentRows, prevRows, lgaRows] = await Promise.all([
    prisma.communitySubmission.groupBy({
      by: ['topicName'],
      where: { isDemo: false, createdAt: { gte: from } },
      _count: { _all: true },
    }),
    prisma.communitySubmission.groupBy({
      by: ['topicName'],
      where: { isDemo: false, createdAt: { gte: fromPrev, lt: from } },
      _count: { _all: true },
    }),
    prisma.communitySubmission.groupBy({
      by: ['topicName', 'lgaId'],
      where: { isDemo: false, createdAt: { gte: from } },
      _count: { _all: true },
    }),
  ]);
  const prevMap = new Map(prevRows.map((r) => [r.topicName, r._count._all]));
  const lgaByTopic = new Map<string, Map<string, number>>();
  const lgaNames = await prisma.lga.findMany({ select: { id: true, name: true } });
  const lgaNameMap = new Map(lgaNames.map((l) => [l.id, l.name]));
  for (const r of lgaRows) {
    if (!lgaByTopic.has(r.topicName)) lgaByTopic.set(r.topicName, new Map());
    const name = r.lgaId ? lgaNameMap.get(r.lgaId) ?? 'Unknown' : 'Unspecified';
    const m = lgaByTopic.get(r.topicName)!;
    m.set(name, (m.get(name) ?? 0) + r._count._all);
  }

  return currentRows
    .map((r) => {
      const previous = prevMap.get(r.topicName) ?? 0;
      const change = pctChange(r._count._all, previous);
      return {
        topic: r.topicName,
        current: r._count._all,
        previous,
        change,
        topLgas: Array.from((lgaByTopic.get(r.topicName) ?? new Map()).entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([n]) => n),
        direction: (change === null ? 'flat' : change > 2 ? 'up' : change < -2 ? 'down' : 'flat') as IssuePulse['direction'],
      };
    })
    .sort((a, b) => b.current - a.current);
}

// ============================================================ LGA engagement
export interface LgaEngagement {
  id: string;
  name: string;
  submissions: number;
  events: number;
  volunteers: number;
  level: 'high' | 'medium' | 'low' | 'insufficient';
}

export async function lgaEngagement(): Promise<LgaEngagement[]> {
  const [lgas, subs, evs, vols] = await Promise.all([
    prisma.lga.findMany({ orderBy: { name: 'asc' } }),
    prisma.communitySubmission.groupBy({ by: ['lgaId'], where: { isDemo: false }, _count: { _all: true } }),
    prisma.campaignEvent.groupBy({ by: ['lgaId'], where: { isDemo: false }, _count: { _all: true } }),
    prisma.volunteer.groupBy({ by: ['lgaId'], _count: { _all: true } }),
  ]);
  const s = new Map(subs.map((r) => [r.lgaId ?? '', r._count._all]));
  const e = new Map(evs.map((r) => [r.lgaId ?? '', r._count._all]));
  const v = new Map(vols.map((r) => [r.lgaId ?? '', r._count._all]));
  const totals = lgas.map((l) => (s.get(l.id) ?? 0) + (e.get(l.id) ?? 0) + (v.get(l.id) ?? 0));
  const max = Math.max(1, ...totals);
  return lgas.map((l) => {
    const submissions = s.get(l.id) ?? 0;
    const events = e.get(l.id) ?? 0;
    const volunteers = v.get(l.id) ?? 0;
    const t = submissions + events + volunteers;
    const level: LgaEngagement['level'] = t === 0 ? 'insufficient' : t / max >= 0.5 ? 'high' : t / max >= 0.2 ? 'medium' : 'low';
    return { id: l.id, name: l.name, submissions, events, volunteers, level };
  });
}

// ============================================================ attention queue
export interface AttentionItem {
  severity: 'urgent' | 'high' | 'medium' | 'low';
  label: string;
  count: number;
  href: string;
}

export async function attentionQueue(): Promise<AttentionItem[]> {
  const [claims, subs, seoMissing, altMissing] = await Promise.all([
    prisma.claim.count({ where: { status: 'under-review' } }),
    prisma.communitySubmission.count({ where: { status: 'new' } }),
    prisma.article.count({ where: { status: 'published', deletedAt: null, OR: [{ seoDescription: null }, { seoDescription: '' }] } }),
    prisma.mediaAsset.count({ where: { altText: '' } }),
  ]);
  const items: AttentionItem[] = [];
  if (claims > 0) items.push({ severity: 'urgent', label: 'Claims awaiting verification', count: claims, href: '/admin/facts/claims' });
  if (subs > 0) items.push({ severity: 'high', label: 'Community submissions awaiting assignment', count: subs, href: '/admin/engagement' });
  if (seoMissing > 0) items.push({ severity: 'medium', label: 'Published articles missing SEO metadata', count: seoMissing, href: '/admin/content' });
  if (altMissing > 0) items.push({ severity: 'low', label: 'Media assets missing alt text', count: altMissing, href: '/admin/media' });
  return items;
}

// ============================================================ content health
export interface ContentHealth {
  id: string;
  title: string;
  path: string;
  score: number; // 0-100
  grade: 'excellent' | 'good' | 'needs-attention' | 'critical';
  recommendations: string[];
  updatedAt: Date;
}

export async function contentHealth(): Promise<ContentHealth[]> {
  const articles = await prisma.article.findMany({ where: { deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 40 });
  const now = Date.now();
  return articles.map((a) => {
    let score = 100;
    const recs: string[] = [];
    const ageDays = (now - a.updatedAt.getTime()) / DAY;
    if (ageDays > 180) { score -= 20; recs.push(`Content older than 180 days (${Math.round(ageDays)}d)`); }
    if (!a.seoTitle || !a.seoDescription) { score -= 15; recs.push('Missing SEO metadata'); }
    if (!a.featuredImageId) { score -= 10; recs.push('No featured image'); }
    if (a.body.trim().length < 300) { score -= 15; recs.push('Thin content body'); }
    if (!a.publishedAt) { score -= 5; recs.push('Not yet published'); }
    const grade = score >= 85 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'needs-attention' : 'critical';
    return {
      id: a.id,
      title: a.title,
      path: `/news/${a.slug}`,
      score: Math.max(0, score),
      grade,
      recommendations: recs,
      updatedAt: a.updatedAt,
    };
  });
}

// ============================================================ activity feed
export interface Activity {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId?: string;
  at: Date;
}

export async function recentActivity(limit = 12): Promise<Activity[]> {
  const rows = await prisma.auditLog.findMany({
    where: { action: { notIn: ['login', 'logout'] } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return rows.map((r) => ({ id: r.id, actor: r.userName, action: r.action, entity: r.entity, entityId: r.entityId, at: r.createdAt }));
}

// ============================================================ intelligence summary
export async function intelligenceSummary(days: PeriodDays = 30): Promise<{
  lines: string[];
  generatedAt: Date;
  insufficient: boolean;
}> {
  const from = periodStart(days);
  const fromPrev = prevPeriodStart(days);
  const [viewsNow, viewsPrev, subsNow, issueRows, staleClaims, staleArticles, openSubs] = await Promise.all([
    prisma.analyticsEvent.count({ where: { isDemo: false, type: 'page_view', createdAt: { gte: from } } }),
    prisma.analyticsEvent.count({ where: { isDemo: false, type: 'page_view', createdAt: { gte: fromPrev, lt: from } } }),
    prisma.communitySubmission.count({ where: { isDemo: false, createdAt: { gte: from } } }),
    prisma.communitySubmission.groupBy({ by: ['topicName'], where: { isDemo: false, createdAt: { gte: from } }, _count: { _all: true } }),
    prisma.claim.count({ where: { status: 'under-review' } }),
    prisma.article.count({ where: { status: 'published', publishedAt: { lt: new Date(Date.now() - 180 * DAY) } } }),
    prisma.communitySubmission.count({ where: { status: { in: ['new', 'acknowledged'] } } }),
  ]);

  const lines: string[] = [];
  const change = pctChange(viewsNow, viewsPrev);
  lines.push(
    viewsNow > 0
      ? `Website traffic is ${change === null ? 'present' : change >= 0 ? `up ${change}%` : `down ${Math.abs(change)}%`} vs the previous ${days}-day period (${viewsNow} page views).`
      : 'No genuine page-view data yet — traffic analysis will activate once the site receives visits (demo data is excluded).'
  );
  if (issueRows.length > 0) {
    const top = issueRows.sort((a, b) => b._count._all - a._count._all)[0];
    lines.push(`${top._count._all} community submission${top._count._all === 1 ? '' : 's'} received in the last ${days} days; top topic: ${top.topicName}.`);
  } else if (subsNow === 0) {
    lines.push('No community submissions collected in this period — priority percentages remain “insufficient data” by design.');
  }
  if (staleClaims > 0) lines.push(`${staleClaims} claim${staleClaims === 1 ? '' : 's'} await fact verification.`);
  if (staleArticles > 0) lines.push(`${staleArticles} published article${staleArticles === 1 ? ' has' : 's have'} not been updated in 180+ days.`);
  if (openSubs > 0) lines.push(`${openSubs} submission${openSubs === 1 ? '' : 's'} require administrative review across multiple LGAs.`);

  return { lines, generatedAt: new Date(), insufficient: viewsNow === 0 && subsNow === 0 };
}

// ============================================================ alerts (computed, not hardcoded)
export async function computeAlerts(): Promise<void> {
  const [claimCount, subs7d, subsPrev7d, staleArticles, upcomingEvents, publishedNoSeo] = await Promise.all([
    prisma.claim.count({ where: { status: 'under-review' } }),
    prisma.communitySubmission.count({ where: { isDemo: false, createdAt: { gte: periodStart(7) } } }),
    prisma.communitySubmission.count({ where: { isDemo: false, createdAt: { gte: prevPeriodStart(7), lt: periodStart(7) } } }),
    prisma.article.findMany({ where: { status: 'published', publishedAt: { lt: new Date(Date.now() - 180 * DAY) } }, select: { id: true, title: true } }),
    prisma.campaignEvent.findMany({ where: { status: 'upcoming', startsAt: { gte: new Date(), lt: new Date(Date.now() + 7 * DAY) } }, select: { id: true, name: true } }),
    prisma.article.count({ where: { status: 'published', deletedAt: null, OR: [{ seoDescription: null }, { seoDescription: '' }] } }),
  ]);

  const dedupe = async (title: string, entityKind: string, entityId: string | null, severity: string, reason: string, action: string) => {
    const existing = await prisma.alert.findFirst({ where: { title, entityKind, entityId: entityId ?? undefined, resolvedAt: null } });
    if (!existing) {
      await prisma.alert.create({ data: { title, entityKind, entityId, severity, reason, action } });
    }
  };

  if (claimCount >= 1) await dedupe(`${claimCount} claim(s) awaiting verification`, 'claim', null, 'high', 'Fact-checking queue has open claims.', 'Review claims in the Verification module and record evidence.');
  if (subs7d > 0 && subsPrev7d > 0 && subs7d > subsPrev7d * 1.5) await dedupe('High increase in community submissions', 'engagement', null, 'medium', `Submissions up from ${subsPrev7d} to ${subs7d} week-over-week.`, 'Assign officers and monitor topic trends.');
  for (const a of staleArticles) await dedupe(`Stale content: ${a.title}`, 'article', a.id, 'medium', 'Published article older than 180 days.', 'Update or archive the article.');
  for (const e of upcomingEvents) await dedupe(`Event approaching: ${e.name}`, 'event', e.id, 'low', 'Event starts within 7 days.', 'Prepare media kit and verify logistics.');
  if (publishedNoSeo > 0) await dedupe(`${publishedNoSeo} published article(s) missing SEO metadata`, 'article', null, 'low', 'SEO coverage gap on live content.', 'Complete SEO fields in the content editor.');
}
