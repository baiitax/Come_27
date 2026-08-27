import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const records = await prisma.serviceRecord.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { startDate: 'desc' },
  });
  return NextResponse.json(records);
}
