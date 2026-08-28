import Link from 'next/link';
import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Newsroom',
  description:
    'The Gwarzo 2027 Newsroom — news, official press releases and updates from the Campaign Council of Comarade Aminu Abdussalam Gwarzo.',
};

export default async function NewsroomPage() {
  const [pressReleases, newsItems] = await safeDb(
    () =>
      Promise.all([
        prisma.article.findMany({
          where: { status: 'published', deletedAt: null, category: 'press-release', publishedAt: { lte: new Date() } },
          orderBy: { publishedAt: 'desc' },
          take: 6,
        }),
        prisma.article.findMany({
          where: { status: 'published', deletedAt: null, category: { not: 'press-release' }, publishedAt: { lte: new Date() } },
          orderBy: { publishedAt: 'desc' },
          take: 6,
        }),
      ]),
    [null, null],
    'newsroom'
  ) as [any[], any[]];
  const featured = pressReleases?.[0] ?? null;

  return (
    <div className="relative pt-36 md:pt-44">
      <div className="mx-auto max-w-7xl px-6">
        {/* header */}
        <div className="mb-14 text-center" data-reveal>
          <span className="section-eyebrow">Campaign Council</span>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-[var(--white)] md:text-5xl">
            The <span className="text-tricolor-gradient">Newsroom</span>
          </h1>
          <div className="gold-rule mx-auto mt-6 w-40" />
          <p className="mx-auto mt-6 max-w-2xl text-base text-[var(--muted-text)] md:text-lg">
            News, official press releases and updates from the Campaign Council of Comarade Aminu Abdussalam
            Gwarzo — NDC candidate for Governor of Kano State 2027.
          </p>
        </div>

        {/* featured release */}
        {featured && (
          <Link
            href={`/news/${featured.slug}`}
            data-reveal
            className="glass-card group relative mb-14 block overflow-hidden !p-0"
          >
            <div aria-hidden className="pattern-kano absolute inset-0 opacity-60" />
            <div className="relative grid grid-cols-1 gap-6 p-8 md:grid-cols-[auto_1fr_auto] md:items-center md:p-10">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-[rgba(163,22,33,0.3)] bg-[rgba(163,22,33,0.07)]">
                  <span className="font-display text-2xl font-extrabold leading-none text-[var(--kwankwasiya)]">
                    {featured.publishedAt?.getDate()}
                  </span>
                  <span className="mt-0.5 text-[0.55rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                    {featured.publishedAt?.toLocaleDateString('en-GB', { month: 'short' })} {featured.publishedAt?.getFullYear()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(163,22,33,0.35)] bg-[rgba(163,22,33,0.08)] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--kwankwasiya)]">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--kwankwasiya)]" />
                    Latest Press Release
                  </span>
                  <p className="mt-2 text-xs text-[var(--muted-2)]">{featured.authorName}</p>
                </div>
              </div>
              <div>
                <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-[var(--white)] transition-colors group-hover:text-[var(--brand)] md:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-[var(--muted-text)] md:text-base">
                  {featured.subtitle || featured.body.split('\n')[0]}
                </p>
              </div>
              <span className="hidden text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--primary-green)] md:block">
                Read the release →
              </span>
            </div>
          </Link>
        )}

        {/* two columns: releases | news */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* press releases */}
          <div data-reveal="left">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--white)]">
                Press Releases
              </h2>
              <Link href="/newsroom/press-releases" className="text-[0.68rem] font-bold text-[var(--brand)] hover:underline">
                All releases →
              </Link>
            </div>
            <div className="space-y-3">
              {(featured ? pressReleases.slice(1) : pressReleases).map((r, i) => (
                <Link key={r.id} href={`/news/${r.slug}`} data-reveal="left" data-delay={String(i * 80)} className="glass-card glass-panel-hover group flex items-start gap-4 !p-5">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-[var(--glass-border)] bg-white/70">
                    <span className="font-display text-lg font-extrabold leading-none text-[var(--kwankwasiya)]">{r.publishedAt?.getDate()}</span>
                    <span className="text-[0.5rem] font-bold uppercase tracking-[0.12em] text-[var(--muted-2)]">
                      {r.publishedAt?.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold leading-snug text-[var(--white)] transition-colors group-hover:text-[var(--brand)]">
                      {r.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--muted-text)]">{r.subtitle || r.body.split('\n')[0]}</p>
                  </div>
                </Link>
              ))}
              {pressReleases?.length === 0 && (
                <div className="glass-card p-8 text-center">
                  <p className="font-display text-base font-bold text-[var(--white)]">The first releases are being prepared.</p>
                  <p className="mt-1 text-xs text-[var(--muted-text)]">Official announcements from the Campaign Council will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* campaign news */}
          <div data-reveal="right" data-delay="120">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--white)]">
                Campaign News
              </h2>
              <Link href="/news" className="text-[0.68rem] font-bold text-[var(--brand)] hover:underline">
                Media center →
              </Link>
            </div>
            <div className="space-y-3">
              {(newsItems || []).map((a, i) => (
                <Link key={a.id} href={`/news/${a.slug}`} data-reveal="right" data-delay={String(i * 80)} className="glass-card glass-panel-hover group flex items-start gap-4 !p-5">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-[var(--glass-border)] bg-white/70">
                    <span className="font-display text-lg font-extrabold leading-none text-[var(--primary-green)]">{a.publishedAt?.getDate()}</span>
                    <span className="text-[0.5rem] font-bold uppercase tracking-[0.12em] text-[var(--muted-2)]">
                      {a.publishedAt?.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-[var(--gold-ink)]">{a.category.replace('-', ' ')}{a.location && ` · ${a.location}`}</p>
                    <h3 className="mt-0.5 font-display text-base font-bold leading-snug text-[var(--white)] transition-colors group-hover:text-[var(--brand)]">
                      {a.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--muted-text)]">{a.subtitle || a.body.split('\n')[0]}</p>
                  </div>
                </Link>
              ))}
              {(newsItems || []).length === 0 && (
                <div className="glass-card p-8 text-center">
                  <p className="font-display text-base font-bold text-[var(--white)]">The newsroom is being set up.</p>
                  <p className="mt-1 text-xs text-[var(--muted-text)]">Published stories will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* footer strip */}
        <div data-reveal className="mt-16 text-center">
          <Link href="/newsroom/press-releases" className="btn-crimson">
            Read All Press Releases
          </Link>
        </div>
      </div>
    </div>
  );
}
