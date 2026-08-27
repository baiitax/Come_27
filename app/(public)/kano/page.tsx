import Link from 'next/link';
import { prisma } from '@/lib/db';
import { SectionHead } from '@/components/public/section-head';
import { LgaExplorer } from '@/components/public/lga-explorer';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Kano',
  description: 'Kano — a state of possibilities. Explore the 44 Local Government Areas, their priorities, events, media and aggregate community submissions.',
};

export default async function KanoPage() {
  const [lgaCount, events, articles] = await Promise.all([
    prisma.lga.count(),
    prisma.campaignEvent.findMany({ where: { status: 'upcoming', deletedAt: null }, orderBy: { startsAt: 'asc' }, take: 4 }),
    prisma.article.findMany({ where: { status: 'published', deletedAt: null }, orderBy: { publishedAt: 'desc' }, take: 3 }),
  ]);

  return (
    <div className="pt-32 md:pt-40">
      <section className="mx-auto max-w-6xl px-6">
        <SectionHead
          eyebrow="Kano"
          title={<>Kano. A state of <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">possibilities.</span></>}
          sub="Forty-four Local Government Areas, one shared conversation — people, opportunity, accountability."
        />
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-6">
        <LgaExplorer />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div data-reveal>
            <h2 className="mb-4 font-display text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--white)]">Upcoming Events</h2>
            <div className="space-y-3">
              {events.map((e) => (
                <div key={e.id} className="glass-card glass-panel-hover flex items-center gap-4 p-5">
                  <div className="glass-card !w-16 shrink-0 !rounded-xl !p-3 text-center">
                    <p className="font-display text-xl font-extrabold leading-none text-[var(--brand)]">{e.startsAt.getDate()}</p>
                    <p className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                      {e.startsAt.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-[var(--white)]">{e.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--muted-text)]">{e.venue}{e.lga && ` · ${e.lga.name}`}</p>
                  </div>
                </div>
              ))}
              {events.length === 0 && <p className="text-sm text-[var(--muted-text)]">No upcoming events scheduled yet.</p>}
            </div>
          </div>
          <div data-reveal data-delay="120">
            <h2 className="mb-4 font-display text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--white)]">Latest on Kano</h2>
            <div className="space-y-3">
              {articles.map((a) => (
                <Link key={a.id} href={`/news/${a.slug}`} className="glass-card glass-panel-hover block p-5">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--muted-2)]">
                    {a.publishedAt?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="mt-1.5 font-display text-sm font-bold leading-snug text-[var(--white)]">{a.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
