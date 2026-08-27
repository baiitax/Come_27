import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { publicRoute } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

export const GET = publicRoute(async () => {
  const records = await prisma.serviceRecord.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { startDate: 'desc' },
  });
  return NextResponse.json(records);
});
