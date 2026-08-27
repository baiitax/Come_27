import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({ where: { status: 'published', deletedAt: null }, select: { slug: true } });
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({ where: { slug, status: 'published', deletedAt: null } });
  if (!article) notFound();
  const related = await prisma.article.findMany({ where: { status: 'published', deletedAt: null, id: { not: article.id }, category: article.category }, take: 3 });

  return (
    <div className="relative pt-36 md:pt-44">
      <article className="mx-auto max-w-3xl px-6">
        <Link href="/news" className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold-ink)] hover:underline">
          ← All news
        </Link>
        <div className="mt-6" data-reveal>
          <span className="rounded-full border border-[rgba(0,121,91,0.35)] bg-[rgba(0,121,91,0.08)] px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--primary-green)]">
            {article.category}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-[var(--white)] md:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-[var(--muted-text)]">
            {article.authorName} · {article.publishedAt?.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            {article.location && ` · ${article.location}`}
          </p>
          <div className="gold-rule mt-6 w-full max-w-md" />
          {article.subtitle && <p className="mt-6 text-lg leading-relaxed text-[var(--muted-text)]">{article.subtitle}</p>}
          <div className="mt-6 space-y-4">
            {article.body.split(/\r?\n/).filter(Boolean).map((para, i) => (
              <p key={i} className="text-[0.95rem] leading-relaxed text-[var(--white)]/85">{para}</p>
            ))}
          </div>
          {JSON.parse(article.tagsJson || '[]').length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {JSON.parse(article.tagsJson || '[]').map((t: string) => (
                <span key={t} className="rounded-full border border-[var(--glass-border)] bg-white/60 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-wide text-[var(--muted-text)]">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-16" data-reveal>
            <h2 className="mb-5 font-display text-lg font-bold text-[var(--white)]">Related</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/news/${r.slug}`} className="glass-card p-5 transition-colors hover:border-[var(--primary-green)]/40">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--gold-ink)]">{r.publishedAt?.toLocaleDateString('en-GB')}</p>
                  <p className="mt-1.5 font-display text-sm font-bold leading-snug text-[var(--white)]">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
