import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '').trim();
  if (q.length < 2) return NextResponse.json({});
  const like = { contains: q }; // SQLite contains is ASCII case-insensitive; Postgres can add mode later

  const [articles, speeches, events, sectors, claims, records, media] = await Promise.all([
    prisma.article.findMany({ where: { status: 'published', deletedAt: null, OR: [{ title: like }, { body: like }] }, take: 6 }),
    prisma.speech.findMany({ where: { status: 'published', deletedAt: null, OR: [{ title: like }, { transcript: like }] }, take: 6 }),
    prisma.campaignEvent.findMany({ where: { deletedAt: null, OR: [{ name: like }, { description: like }] }, take: 6 }),
    prisma.policySector.findMany({ where: { published: true, OR: [{ name: like }, { approach: like }] }, take: 6 }),
    prisma.claim.findMany({ where: { isDemo: false, OR: [{ statement: like }, { context: like }] }, take: 6 }),
    prisma.serviceRecord.findMany({ where: { published: true, deletedAt: null, OR: [{ position: like }, { institution: like }, { description: like }] }, take: 6 }),
    prisma.mediaAsset.findMany({ where: { isDemo: false, OR: [{ filename: like }, { altText: like }] }, take: 6 }),
  ]);

  return NextResponse.json({
    news: articles.map((a) => ({ href: `/news/${a.slug}`, title: a.title, meta: a.publishedAt?.toLocaleDateString('en-GB') })),
    speeches: speeches.map((s) => ({ href: `/media/speeches/${s.id}`, title: s.title, meta: s.eventDate })),
    events: events.map((e) => ({ href: `/media/events/${e.id}`, title: e.name, meta: e.venue })),
    policies: sectors.map((s) => ({ href: `/vision/${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, title: s.name })),
    facts: claims.map((c) => ({ href: '/facts', title: c.statement.slice(0, 90), meta: c.status.replace('-', ' ') })),
    records: records.map((r) => ({ href: `/record/${r.id}`, title: r.position, meta: `${r.institution} · ${r.startDate}–${r.endDate}` })),
    media: media.map((m) => ({ href: '/media', title: m.altText || m.filename, meta: m.kind })),
  });
}
