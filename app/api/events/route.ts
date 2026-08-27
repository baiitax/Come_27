import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const events = await prisma.campaignEvent.findMany({
    where: { status: { in: ['upcoming', 'live'] }, deletedAt: null },
    orderBy: { startsAt: 'asc' },
    include: { lga: { select: { name: true } } },
  });
  return NextResponse.json(events.map((e) => ({
    name: e.name, startsAt: e.startsAt, venue: e.venue, lga: e.lga?.name ?? null,
    address: e.address, category: e.category, registrationUrl: e.registrationUrl,
  })));
}
