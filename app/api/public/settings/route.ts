import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { publicRoute } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

export const GET = publicRoute(async () => {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: ['contact.email', 'contact.phone', 'contact.address'] } },
  });
  const out: Record<string, string> = {};
  for (const r of rows) out[r.key] = r.value;
  return NextResponse.json(out);
});
