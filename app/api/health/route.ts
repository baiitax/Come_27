import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Minimal public health check.
 * 200 {status:'ok'}            — the app reached the database successfully.
 * 503 {status:'fail', code}    — database problem; `code` is the Prisma error
 *                               code (e.g. P1001 = auth rejected, P1000 =
 *                               unreachable, P1012 = DATABASE_URL missing).
 * Deliberately exposes no connection details or messages.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok' });
  } catch (e: any) {
    const code = typeof e?.code === 'string' ? e.code : 'unknown';
    console.error('[health] database check failed:', code, e?.message ?? e);
    return NextResponse.json({ status: 'fail', code }, { status: 503 });
  }
}
