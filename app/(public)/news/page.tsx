import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'News & Media' };

export default async function NewsPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'published', deletedAt: null, publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: 'desc' },
    take: 30,
  });

  return (
    <div className="relative pt-36 md:pt-44">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center" data-reveal>
          <span className="section-eyebrow">Media Center</span>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-[var(--white)] md:text-5xl">
            NEWS & <span className="text-gold-gradient">MEDIA</span>
          </h1>
          <div className="gold-rule mx-auto mt-6 w-40" />
          <p className="mx-auto mt-6 max-w-2xl text-base text-[var(--muted-text)] md:text-lg">
            Press releases, statements, speeches and campaign coverage — published from the campaign newsroom.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="font-display text-lg font-bold text-[var(--white)]">The newsroom is being set up.</p>
            <p className="mt-2 text-sm text-[var(--muted-text)]">Published articles will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <Link
                key={a.id}
                href={`/news/${a.slug}`}
                data-reveal="zoom"
                data-delay={String((i % 3) * 90)}
                className="glass-card group flex h-full flex-col overflow-hidden !p-0"
              >
                <div className="relative h-44 overflow-hidden bg-[linear-gradient(135deg,rgba(0,121,91,0.25),rgba(163,22,33,0.18))]">
                  <div className="pattern-kano absolute inset-0 opacity-40" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                    {a.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--gold-ink)]">
                    {a.publishedAt?.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    {a.location && ` · ${a.location}`}
                  </p>
                  <h2 className="mt-2 font-display text-lg font-bold leading-snug text-[var(--white)] transition-colors group-hover:text-[var(--primary-green)]">
                    {a.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--muted-text)]">{a.subtitle || a.body.slice(0, 180)}</p>
                  <span className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--primary-green)]">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
