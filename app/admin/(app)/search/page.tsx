import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Badge, EmptyState } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const q = (sp.q ?? '').trim();

  const [articles, speeches, events, claims, submissions, lgas, assets] = q
    ? await Promise.all([
        prisma.article.findMany({ where: { OR: [{ title: { contains: q } }, { body: { contains: q } }] }, take: 20 }),
        prisma.speech.findMany({ where: { OR: [{ title: { contains: q } }, { transcript: { contains: q } }, { summary: { contains: q } }] }, take: 20 }),
        prisma.campaignEvent.findMany({ where: { OR: [{ name: { contains: q } }, { description: { contains: q } }] }, take: 20 }),
        prisma.claim.findMany({ where: { OR: [{ statement: { contains: q } }, { context: { contains: q } }] }, take: 20 }),
        prisma.communitySubmission.findMany({ where: { message: { contains: q } }, take: 20 }),
        prisma.lga.findMany({ where: { name: { contains: q } }, take: 20 }),
        prisma.mediaAsset.findMany({ where: { OR: [{ filename: { contains: q } }, { altText: { contains: q } }] }, take: 20 }),
      ])
    : ([[], [], [], [], [], [], []] as const);

  const sections = [
    { label: 'Articles', href: (id: string, slug: string) => `/admin/content/news/${id}`, rows: articles.map((a) => ({ id: a.id, primary: a.title, secondary: `/${a.slug} · ${a.status}` })) },
    { label: 'Speeches', href: (id: string) => `/admin/speeches/${id}`, rows: speeches.map((s) => ({ id: s.id, primary: s.title, secondary: `${s.eventName} · ${s.eventDate}` })) },
    { label: 'Events', href: (id: string) => `/admin/events/${id}`, rows: events.map((e) => ({ id: e.id, primary: e.name, secondary: `${e.category} · ${e.status}` })) },
    { label: 'Claims', href: (id: string) => `/admin/facts/claims/${id}`, rows: claims.map((c) => ({ id: c.id, primary: c.statement.slice(0, 90), secondary: c.status })) },
    { label: 'Submissions', href: () => '/admin/engagement', rows: submissions.map((s) => ({ id: s.id, primary: s.message.slice(0, 90), secondary: `${s.topicName} · ${s.status}` })) },
    { label: 'LGAs', href: () => '/admin/engagement/lgas', rows: lgas.map((l) => ({ id: l.id, primary: l.name, secondary: l.senatorialDistrict })) },
    { label: 'Media', href: () => '/admin/media', rows: assets.map((a) => ({ id: a.id, primary: a.filename, secondary: a.kind })) },
  ].filter((s) => s.rows.length > 0);

  return (
    <div>
      <PageHeader crumb="Search" title={q ? `Results for “${q}”` : 'Global Search'} sub="Search across articles, speeches, events, claims, evidence, documents, media, submissions and LGAs." />
      {!q && <Card><EmptyState title="Type in the top search bar" sub="Results across the entire content graph appear here." /></Card>}
      {q && sections.length === 0 && <Card><EmptyState title="No results" sub={`Nothing matched “${q}”.`} /></Card>}
      {sections.map((s) => (
        <Card key={s.label} className="mb-4">
          <CardHead title={s.label} sub={`${s.rows.length} result(s)`} />
          <ul className="divide-y divide-[rgba(16,24,40,0.06)]">
            {s.rows.map((r) => (
              <li key={r.id}>
                <Link href={s.href(r.id)} className="block px-5 py-3 transition-colors hover:bg-[rgba(16,24,40,0.04)]">
                  <p className="truncate text-sm font-semibold text-white">{r.primary}</p>
                  <p className="text-xs text-[#98A2B3]">{r.secondary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
