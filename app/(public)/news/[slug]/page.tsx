import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ShareBar } from '@/components/public/share-bar';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await prisma.article.findFirst({ where: { slug, status: 'published', deletedAt: null } });
  if (!a) return { title: 'Story' };
  return {
    title: a.title,
    description: a.seoDescription || a.subtitle || a.body.slice(0, 160),
    openGraph: { title: a.seoTitle || a.title, description: a.seoDescription || a.subtitle || a.body.slice(0, 160) },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({ where: { slug, status: 'published', deletedAt: null } });
  if (!article) notFound();
  const related = await prisma.article.findMany({
    where: { status: 'published', deletedAt: null, id: { not: article.id }, category: article.category },
    take: 3,
  });
  const archived = article.publishedAt && article.publishedAt < new Date(Date.now() - 730 * 24 * 3600 * 1000);

  return (
    <div className="pt-32 md:pt-40">
      <article className="mx-auto max-w-3xl px-6 pb-20">
        <Link href="/media" className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--brand)] hover:underline">
          ← Media Center
        </Link>

        <div data-reveal className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--glass-border)] bg-white/70 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">
              {article.category.replace('-', ' ')}
            </span>
            {archived && (
              <span className="rounded-full border border-[rgba(102,112,133,0.3)] bg-[rgba(102,112,133,0.1)] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#475467]">
                Archived
              </span>
            )}
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-[var(--white)] md:text-[2.6rem]">
            {article.title}
          </h1>
          {article.subtitle && <p className="mt-4 max-w-[720px] text-lg leading-relaxed text-[var(--muted-text)]">{article.subtitle}</p>}
          <p className="mt-4 text-xs text-[var(--muted-2)]">
            {article.authorName}
            {article.publishedAt && <> · {article.publishedAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</>}
            {article.location && <> · {article.location}</>}
          </p>
        </div>

        <div className="gold-rule mt-8 w-40" />

        <div className="mt-8 space-y-5">
          {article.body.split('\n').filter(Boolean).map((p, i) => (
            <p key={i} className="max-w-[720px] text-base leading-[1.75] text-[var(--muted-text)] md:text-[1.0625rem]">{p}</p>
          ))}
        </div>

        <div data-reveal className="mt-10 border-t border-[var(--glass-border)] pt-8">
          <ShareBar title={article.title} url="" />
        </div>

        {related.length > 0 && (
          <section data-reveal className="mt-12">
            <h2 className="mb-5 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--white)]">More stories</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/news/${r.slug}`} className="glass-card glass-panel-hover p-4">
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-2)]">
                    {r.publishedAt?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="mt-1.5 line-clamp-3 text-sm font-bold leading-snug text-[var(--white)]">{r.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
