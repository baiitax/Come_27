import 'server-only';
import { PrismaClient, Prisma } from '@prisma/client';
import { MIGRATION_STATEMENTS } from '../../prisma/migration-sql';
// @ts-ignore -- CJS module shared with the CLI seed
import { seedIfEmpty } from '../../prisma/seed-core';

/**
 * Runtime database self-healer for serverless (Vercel Postgres / Neon).
 *
 * On a fresh or half-initialized database, the first failing query triggers a
 * one-time, RESUMABLE self-heal:
 *   1. reachability check (actionable error if DATABASE_URL is missing)
 *   2. schema migration — embedded SQL, statement-by-statement, idempotent
 *      ("already exists" is tolerated) so a timed-out run resumes where it stopped
 *   3. seed-if-empty — per-table createMany batches, each guarded by a count
 *      check, so a timed-out seed resumes where it stopped
 *
 * DDL and seeding prefer a DIRECT connection (DIRECT_URL / DATABASE_URL_DIRECT)
 * when available, because DDL over a pooler is fragile on Neon.
 */

const DB_DOWN_CODES = new Set([
  'P1000', 'P1001', 'P1008', 'P1009', 'P1010', 'P1012', 'P1013', 'P1014',
  'P1017', 'P2021', 'P2022', 'P2023', 'P2024', 'P2034', 'P2038', 'P2037',
]);

export function isDbDownError(e: unknown): boolean {
  const code = (e as { code?: string })?.code;
  return typeof code === 'string' && DB_DOWN_CODES.has(code);
}

export interface HealReport {
  ok: boolean;
  reachable: boolean;
  schemaPresent: boolean;
  migrated: boolean;
  seeded: boolean;
  users: number;
  detail: string;
}

function fail(reachable: boolean, schemaPresent: boolean, migrated: boolean, seeded: boolean, users: number, detail: string): HealReport {
  return { ok: false, reachable, schemaPresent, migrated, seeded, users, detail };
}

function createHealClient(): PrismaClient {
  const directUrl = process.env.DIRECT_URL || process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL;
  if (!directUrl) {
    const e = new Error('DATABASE_URL environment variable is not set.');
    (e as { code?: string }).code = 'P1012';
    throw e;
  }
  // Prefer a direct connection for DDL + seeding (Neon pooler is fragile for DDL).
  const direct = process.env.DIRECT_URL || process.env.DATABASE_URL_DIRECT;
  return new PrismaClient({
    log: ['error'],
    ...(direct ? { datasources: { db: { url: direct } } } : {}),
  });
}

let healPromise: Promise<HealReport> | null = null;

/** Cached self-heal: runs once per function instance; caches success, retries after failure. */
export function ensureDatabase(): Promise<HealReport> {
  if (!healPromise) {
    healPromise = healOnce().catch((e) => {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[db-heal] failed:', msg);
      healPromise = null; // allow a retry on the next failure
      return fail(false, false, false, false, 0, msg);
    });
  }
  return healPromise;
}

/** Fresh health check (never caches a failure). */
export async function runHealthCheck(): Promise<HealReport> {
  healPromise = null;
  return ensureDatabase();
}

async function healOnce(): Promise<HealReport> {
  let raw: PrismaClient | null = null;
  try {
    try {
      raw = createHealClient();
    } catch (e: any) {
      return fail(false, false, false, false, 0, e?.code === 'P1012' ? 'DATABASE_URL environment variable is not set.' : `Cannot connect to database: ${e?.message ?? e}`);
    }
    raw = raw!;

    // 1. reachable?
    try {
      await raw.$queryRaw`SELECT 1`;
    } catch (e: any) {
      await raw.$disconnect().catch(() => {});
      return fail(false, false, false, false, 0, `Database unreachable (${e?.code ?? 'unknown'}): ${e?.message ?? 'connection failed'}. Check that the Vercel Postgres database is attached and running.`);
    }

    // 2. schema present?
    const schemaRows = await raw.$queryRawUnsafe<Array<{ ok: boolean }>>(
      `SELECT to_regclass('public."User") IS NOT NULL AS ok`
    );
    const schemaPresent = !!schemaRows[0]?.ok;

    // 3. migrate (idempotent + resumable: tolerate "already exists")
    let migrated = false;
    if (!schemaPresent) {
      for (const stmt of MIGRATION_STATEMENTS) {
        try {
          await raw.$executeRawUnsafe(stmt);
          migrated = true;
        } catch (e: any) {
          const msg = String(e?.message ?? '');
          if (!/already exists|duplicate key|duplicate index/i.test(msg)) {
            await raw.$disconnect().catch(() => {});
            return fail(true, schemaPresent, migrated, false, 0, `Migration failed: ${msg.slice(0, 300)}`);
          }
        }
      }
    }

    // 4. seed if empty (resumable, batched)
    let users = 0;
    let seeded = false;
    try {
      const userRows = await raw.$queryRawUnsafe<Array<{ n: number }>>(`SELECT COUNT(*)::int AS n FROM "User"`);
      users = userRows[0]?.n ?? 0;
      if (users === 0) {
        const result = await seedIfEmpty(raw);
        seeded = result === 'seeded';
        if (seeded) {
          const u = await raw.$queryRawUnsafe<Array<{ n: number }>>(`SELECT COUNT(*)::int AS n FROM "User"`);
          users = u[0]?.n ?? 0;
        }
      }
    } catch (e: any) {
      const msg = e instanceof Error ? e.message : String(e);
      await raw.$disconnect().catch(() => {});
      return fail(true, true, migrated, seeded, users, `Seeding failed (will resume on next request): ${msg.slice(0, 300)}`);
    }

    await raw.$disconnect().catch(() => {});
    return {
      ok: true,
      reachable: true,
      schemaPresent: true,
      migrated,
      seeded,
      users,
      detail: seeded ? 'Database migrated and seeded.' : 'Database operational.',
    };
  } catch (e: any) {
    raw?.$disconnect().catch(() => {});
    const msg = e?.code === 'P1012'
      ? 'DATABASE_URL environment variable is not set. Add the Vercel Postgres connection string as DATABASE_URL (and DIRECT_URL) in Vercel → Project → Settings → Environment Variables, then redeploy.'
      : `Database error (${(e?.code as string) ?? 'unknown'}): ${String(e?.message ?? e).slice(0, 300)}`;
    return fail(false, false, false, false, 0, msg);
  }
}

export { Prisma };
