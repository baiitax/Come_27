import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const entries = await prisma.timelineEntry.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { sort: 'asc' },
  });
  return NextResponse.json(entries);
}
