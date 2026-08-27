import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const BASE = 'https://come-pcipyrd8f-baiita-x-degen-s-projects.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '', '/about', '/record', '/kano', '/vision', '/media', '/facts', '/transition',
    '/engage', '/join', '/contact', '/search',
  ].map((p) => ({ url: BASE + p, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8 }));

  try {
    const [articles, speeches, events, sectors, lgas] = await Promise.all([
      prisma.article.findMany({ where: { status: 'published', deletedAt: null }, select: { slug: true, updatedAt: true } }),
      prisma.speech.findMany({ where: { status: 'published', deletedAt: null }, select: { id: true, updatedAt: true } }),
      prisma.campaignEvent.findMany({ where: { deletedAt: null }, select: { id: true, updatedAt: true } }),
      prisma.policySector.findMany({ where: { published: true }, select: { name: true, updatedAt: true } }),
      prisma.lga.findMany({ select: { id: true, name: true } }),
    ]);
    return [
      ...staticRoutes,
      ...articles.map((a) => ({ url: `${BASE}/news/${a.slug}`, lastModified: a.updatedAt, changeFrequency: 'weekly' as const, priority: 0.7 })),
      ...speeches.map((s) => ({ url: `${BASE}/media/speeches/${s.id}`, lastModified: s.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
      ...events.map((e) => ({ url: `${BASE}/media/events/${e.id}`, lastModified: e.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
      ...sectors.map((s) => ({ url: `${BASE}/vision/${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, lastModified: s.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
      ...lgas.map((l) => ({ url: `${BASE}/kano/${l.id}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 })),
    ];
  } catch {
    return staticRoutes;
  }
}
