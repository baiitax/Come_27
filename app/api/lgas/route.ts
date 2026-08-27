import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { publicRoute } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

export const GET = publicRoute(async () => {
  const lgas = await prisma.lga.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(lgas.map((l) => ({
    id: l.id, name: l.name, senatorialDistrict: l.senatorialDistrict,
    priorities: JSON.parse(l.prioritiesJson || '[]'),
  })));
});
