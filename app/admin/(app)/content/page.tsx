import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Badge, Td, Th } from '@/components/admin/ui';
import { SectionManager } from './section-manager';
import { NavManager } from './nav-manager';

export const dynamic = 'force-dynamic';

export default async function ContentIndexPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');

  const [articles, speeches, events, sectionList, navList] = await Promise.all([
    prisma.article.count({ where: { deletedAt: null } }),
    prisma.speech.count({ where: { deletedAt: null } }),
    prisma.campaignEvent.count({ where: { deletedAt: null } }),
    prisma.pageSection.findMany({ orderBy: { sort: 'asc' } }),
    prisma.navigationItem.findMany({ orderBy: { sort: 'asc' } }),
  ]);
  const sections = sectionList.length;

  const tiles = [
    { label: 'Articles', value: articles, href: '/admin/content/news', desc: 'News, press releases, statements' },
    { label: 'Speeches', value: speeches, href: '/admin/speeches', desc: 'Transcripts, videos, themes' },
    { label: 'Events', value: events, href: '/admin/events', desc: 'Rallies, town halls, media' },
    { label: 'Timeline', value: null, href: '/admin/timeline', desc: 'Journey entries' },
    { label: 'Record', value: null, href: '/admin/record', desc: 'Public-service record' },
    { label: 'Vision', value: null, href: '/admin/policies', desc: 'Policy sectors & initiatives' },
  ];

  return (
    <div>
      <PageHeader crumb="Content" title="Pages & Sections" sub="Control what appears on the public site — every section can be enabled, disabled, reordered or edited without code." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="group rounded-xl border border-white/[0.07] bg-[#12161A] p-4 transition-colors hover:border-[#C9A24B]/40">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#8A968E]">{t.label}</p>
            {t.value !== null && <p className="mt-1 font-display text-2xl font-extrabold text-white">{t.value}</p>}
            <p className="mt-1 text-[0.68rem] text-[#5E6A63]">{t.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHead title="Homepage Sections" sub={`${sections} sections — drag-free ordering with up/down controls. Changes go live immediately.`} />
          <SectionManager sections={sectionList} />
        </Card>
        <Card>
          <CardHead title="Navigation" sub="Primary navigation items shown in the public site navbar and footer." />
          <NavManager items={navList} />
        </Card>
      </div>
    </div>
  );
}
