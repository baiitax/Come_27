import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';
import { SectionHead } from '@/components/public/section-head';
import { MediaTabs } from '@/components/public/media-tabs';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Media Center',
  description: 'News, speeches, press releases, events, video and documents from the Gwarzo 2027 campaign.',
};

export default async function MediaPage() {
  const [articles, speeches, events, media] = await safeDb(
  () => Promise.all([
    prisma.article.findMany({ where: { deletedAt: null }, orderBy: { publishedAt: 'desc' }, take: 24 }),
    prisma.speech.findMany({ where: { deletedAt: null }, orderBy: { eventDate: 'desc' }, take: 24 }),
    prisma.campaignEvent.findMany({ where: { deletedAt: null }, orderBy: { startsAt: 'desc' }, take: 24 }),
    prisma.mediaAsset.findMany({ where: { isDemo: false, kind: { in: ['image', 'video'] } }, orderBy: { createdAt: 'desc' }, take: 12 }),
  ]),
  [[], [], [], []],
  'media'
);

  const published = articles.filter((a) => a.status === 'published' && (!a.publishedAt || a.publishedAt <= new Date()));
  const featured = published[0];

  return (
    <div className="pt-32 md:pt-40">
      <section className="mx-auto max-w-7xl px-6">
        <SectionHead
          eyebrow="Media Center"
          title={<>The campaign <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">newsroom.</span></>}
          sub="News, speeches, press releases, events, video and documents — every item dated, every source named."
        />
      </section>

      {/* Featured story */}
      {featured && (
        <section className="mx-auto mt-12 max-w-7xl px-6" data-reveal>
          <Link href={`/news/${featured.slug}`} className="group block">
            <div className="glass-card glass-panel-hover grid grid-cols-1 overflow-hidden !rounded-3xl md:grid-cols-2">
              <div className="relative min-h-[260px] bg-[linear-gradient(135deg,rgba(166,27,27,0.1),rgba(198,146,50,0.12))]">
                <div aria-hidden className="absolute inset-0 pattern-kano opacity-40" />
                <span className="absolute left-5 top-5 rounded-full bg-[var(--brand)] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white">
                  Latest
                </span>
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-2)]">
                  {featured.category.replace('-', ' ')} · {featured.publishedAt?.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
                <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight text-[var(--white)] group-hover:text-[var(--brand)] md:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--muted-text)] md:text-base">
                  {featured.subtitle || featured.body.slice(0, 240)}
                </p>
                <p className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">Read the story →</p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Tabs */}
      <section className="mx-auto mt-12 max-w-7xl px-6 pb-8">
        <MediaTabs
          news={published.map((a) => ({ slug: a.slug, title: a.title, date: a.publishedAt?.toISOString() ?? '', category: a.category, summary: a.subtitle || a.body.slice(0, 140) }))}
          speeches={speeches.map((s) => ({ slug: s.id, title: s.title, date: s.eventDate, category: 'speech', summary: s.summary, venue: s.venue }))}
          events={events.map((e) => ({ slug: e.id, title: e.name, date: e.startsAt.toISOString(), category: e.category, summary: e.description, venue: e.venue }))}
          photos={media.filter((m) => m.kind === 'image').map((m) => ({ path: m.path, alt: m.altText || m.filename, id: m.id }))}
          videos={media.filter((m) => m.kind === 'video').map((m) => ({ path: m.path, alt: m.altText || m.filename, id: m.id }))}
        />
      </section>
    </div>
  );
}
