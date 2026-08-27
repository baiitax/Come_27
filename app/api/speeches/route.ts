import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const speeches = await prisma.speech.findMany({
    where: { status: 'published', deletedAt: null },
    orderBy: { eventDate: 'desc' },
    take: 50,
  });
  return NextResponse.json(speeches.map((s) => ({
    title: s.title, event: s.eventName, date: s.eventDate, venue: s.venue, location: s.location, summary: s.summary,
  })));
}
