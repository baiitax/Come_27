import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { publicRoute } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

export const GET = publicRoute(async () => {
  const sectors = await prisma.policySector.findMany({
    where: { published: true },
    include: { initiatives: { orderBy: { sort: 'asc' } } },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(sectors.map((s) => ({
    name: s.name, approach: s.approach,
    objectives: JSON.parse(s.objectivesJson || '[]'),
    initiatives: s.initiatives.map((i) => i.title),
  })));
});
