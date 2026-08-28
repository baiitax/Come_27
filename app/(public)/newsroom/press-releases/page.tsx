import Link from 'next/link';
import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Press Releases',
  description:
    'Official press releases from the Campaign Council of Comrade Aminu Abdussalam Gwarzo — NDC candidate for Governor of Kano State 2027.',
};

export default async function PressReleasesPage() {
  const releases = await safeDb(
    () =>
      prisma.article.findMany({
        where: { status: 'published', deletedAt: null, category: 'press-release', publishedAt: { lte: new Date() } },
        orderBy: { publishedAt: 'desc' },
      }),
    [],
    'press-releases'
  );

  return (
    <div className="relative pt-36 md:pt-44">
      <div className="mx-auto max-w-4xl px-6">
        {/* header */}
        <div className="mb-12 text-center" data-reveal>
          <span className="section-eyebrow">Campaign Council</span>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-[var(--white)] md:text-5xl">
            Press <span className="text-tricolor-gradient">Releases</span>
          </h1>
          <div className="gold-rule mx-auto mt-6 w-40" />
          <p className="mx-auto mt-6 max-w-2xl text-base text-[var(--muted-text)] md:text-lg">
            Official releases issued by the Campaign Council of Comrade Aminu Abdussalam Gwarzo. For media
            enquiries, contact the campaign desk.
          </p>
        </div>

        {releases.length === 0 ? (
          <div className="glass-card p-12 text-center" data-reveal>
            <p className="font-display text-lg font-bold text-[var(--white)]">The first releases are being prepared.</p>
            <p className="mt-2 text-sm text-[var(--muted-text)]">Official announcements from the Campaign Council will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {releases.map((r, i) => (
              <Link
                key={r.id}
                href={`/news/${r.slug}`}
                data-reveal
                data-delay={String((i % 4) * 70)}
                className="glass-card glass-panel-hover group grid grid-cols-1 gap-5 !p-6 sm:grid-cols-[auto_1fr] sm:items-start md:!p-8"
              >
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-[rgba(163,22,33,0.3)] bg-[rgba(163,22,33,0.06)]">
                  <span className="font-display text-3xl font-extrabold leading-none text-[var(--kwankwasiya)]">
                    {r.publishedAt?.getDate()}
                  </span>
                  <span className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                    {r.publishedAt?.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--gold-ink)]">
                    {r.authorName}{r.location && ` · ${r.location}`}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-extrabold leading-tight tracking-tight text-[var(--white)] transition-colors group-hover:text-[var(--brand)] md:text-2xl">
                    {r.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted-text)] md:text-base">
                    {r.subtitle || r.body.split('\n')[0]}
                  </p>
                  <span className="mt-4 inline-block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--primary-green)]">
                    Read the full release →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-14 text-center" data-reveal>
          <Link href="/newsroom" className="btn-secondary">
            ← Back to the Newsroom
          </Link>
        </div>
      </div>
    </div>
  );
}
