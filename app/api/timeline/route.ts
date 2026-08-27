import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { publicRoute } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

export const GET = publicRoute(async () => {
  const entries = await prisma.timelineEntry.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { sort: 'asc' },
  });
  return NextResponse.json(entries);
});
