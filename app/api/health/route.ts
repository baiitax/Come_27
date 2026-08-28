import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
// Give cold starts (engine boot + first remote DB connect) the full window.
export const maxDuration = 30;

/** Strip anything that could carry credentials before exposing a message fragment. */
function sanitizeDetail(e: unknown): string {
  let msg: string = e instanceof Error ? e.message : String(e);
  msg = msg
    .replace(/postgres(ql)?:[^\s"'()]+/gi, '[redacted-url]')
    .replace(/\bghp_[A-Za-z0-9]+\b/g, '[redacted-token]')
    .replace(/\b[^\s@/]+@[^\s/]+\.(supabase\.com|vercel\.app|github\.com)\b/gi, '[redacted]');
  return msg.replace(/\s+/g, ' ').slice(0, 240);
}

/**
 * Public health check.
 * 200 {status:'ok'}              — the app reached the database successfully.
 * 503 {status:'fail', code[, detail]} — database problem; `code` is the Prisma
 *     error code (P1001 = auth rejected, P1000 = unreachable, P1012 =
 *     DATABASE_URL missing, P1002 = schema missing). `detail` is a
 *     sanitized fragment of the error message for fast diagnosis.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok' });
  } catch (e: any) {
    const code = typeof e?.code === 'string' ? e.code : 'unknown';
    const detail = sanitizeDetail(e);
    console.error('[health] database check failed:', code, detail);
    return NextResponse.json({ status: 'fail', code, detail }, { status: 503 });
  }
}
