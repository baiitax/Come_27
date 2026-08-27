import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Public aggregate community priorities.
 * Only real, voluntarily-submitted data is returned. Below the sample
 * threshold the API reports "insufficient" and the UI says so — never fake values.
 */
const MIN_SAMPLE = 10;

export async function GET() {
  const rows = await prisma.communitySubmission.groupBy({
    by: ['topicName'],
    where: { isDemo: false, status: { notIn: ['archived'] } },
    _count: { _all: true },
  });
  const total = rows.reduce((a, r) => a + r._count._all, 0);
  if (total < MIN_SAMPLE) {
    return NextResponse.json({ insufficient: true, total });
  }
  const topics = rows
    .map((r) => ({
      topic: r.topicName,
      count: r._count._all,
      pct: Math.round((r._count._all / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
  return NextResponse.json({ insufficient: false, total, topics });
}
