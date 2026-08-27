import 'server-only';

/**
 * Crash-resilient data access for the PUBLIC site.
 *
 * The public website must never crash if the CMS database is unavailable
 * or not yet migrated — it renders fallback/empty states instead
 * (spec: "If CMS content is unavailable: do not crash the website").
 *
 * Admin pages deliberately do NOT use this: the admin must fail loudly
 * when its database is down.
 */
export async function safeDb<T>(
  fn: () => Promise<T>,
  fallback: T,
  context = 'query'
): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error(`[safeDb:${context}]`, e instanceof Error ? e.message : e);
    return fallback;
  }
}

/** True when a DB query just failed (e.g. tables not migrated). */
export async function dbUp(): Promise<boolean> {
  const { prisma } = await import('./db');
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Wraps a public API route handler: any failure (DB down, missing tables,
 * transient) becomes a clean 503 JSON response instead of a 500 crash page.
 */
export function publicRoute<T extends (...args: any[]) => Promise<any>>(handler: T): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (e) {
      console.error('[public-api]', e instanceof Error ? e.message : e);
      const { NextResponse } = await import('next/server');
      return NextResponse.json({ error: 'Content service temporarily unavailable.' }, { status: 503 });
    }
  }) as T;
}
