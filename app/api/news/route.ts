import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { publicRoute } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

export const GET = publicRoute(async () => {
  const articles = await prisma.article.findMany({
    where: { status: 'published', deletedAt: null, publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  });
  return NextResponse.json(articles.map((a) => ({
    slug: a.slug, title: a.title, subtitle: a.subtitle, category: a.category,
    location: a.location, author: a.authorName, publishedAt: a.publishedAt,
    seoDescription: a.seoDescription,
  })));
});
