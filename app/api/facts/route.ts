import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { publicRoute } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

export const GET = publicRoute(async () => {
  const claims = await prisma.claim.findMany({
    where: { isDemo: false, status: { notIn: ['under-review'] } },
    include: { source: { select: { title: true, publisher: true } }, evidences: { select: { title: true, type: true, url: true } } },
    orderBy: { updatedAt: 'desc' },
    take: 50,
  });
  return NextResponse.json(claims.map((c) => ({
    statement: c.statement, status: c.status, category: c.category,
    source: c.source?.title ?? null, evidences: c.evidences.map((e) => e.title),
    verifiedAt: c.verifiedAt,
  })));
});
