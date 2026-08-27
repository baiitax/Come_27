import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { publicRoute } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

/** Aggregate engagement only — no individual records are ever exposed publicly. */
export const GET = publicRoute(async () => {
  const [byTopic, byLga, total] = await Promise.all([
    prisma.communitySubmission.groupBy({ by: ['topicName'], where: { isDemo: false, status: { notIn: ['archived'] } }, _count: { _all: true } }),
    prisma.communitySubmission.groupBy({ by: ['lgaId'], where: { isDemo: false, status: { notIn: ['archived'] } }, _count: { _all: true } }),
    prisma.communitySubmission.count({ where: { isDemo: false, status: { notIn: ['archived'] } } }),
  ]);
  return NextResponse.json({
    totalSubmissions: total,
    byTopic: byTopic.map((t) => ({ topic: t.topicName, count: t._count._all })),
    note: 'LGA-level priority percentages are only published once sufficient submissions are collected.',
  });
});
