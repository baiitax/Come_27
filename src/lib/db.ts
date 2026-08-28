import { PrismaClient, Prisma } from '@prisma/client';
import { ensureDatabase, isConfigDbError, isDriftDbError, isTransientDbError } from './db-heal';

/**
 * Prisma client with runtime self-healing:
 * - config errors (bad credentials, missing DATABASE_URL) fail fast —
 *   they can never be fixed by migrating, and healing on them only
 *   added latency + log noise on every request;
 * - transient errors (cold-start timeouts) are retried with backoff;
 * - drift errors (missing tables) trigger the one-time self-heal
 *   (migrate + seed-if-empty), then the query is retried.
 */
function withResilience<T>(op: () => Promise<T>): Promise<T> {
  let healed = false;
  return (async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await op();
      } catch (e) {
        if (isConfigDbError(e)) throw e; // fail fast — surface the real problem
        if (isDriftDbError(e) && !healed) {
          healed = true;
          const report = await ensureDatabase();
          if (report.ok) continue; // schema fixed — retry the query
          throw e;
        }
        if (isTransientDbError(e) && attempt < 2) {
          await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
          continue; // backoff + retry
        }
        throw e;
      }
    }
    throw new Error('Unreachable');
  })();
}

function withHeal<T>(client: T): T {
  return new Proxy(client, {
    get(target: any, prop: string | symbol) {
      const value = target[prop];
      if (typeof value === 'function') {
        if (typeof prop === 'string' && prop.startsWith('$')) {
          return (...args: unknown[]) => withResilience(() => (value as (...a: unknown[]) => Promise<unknown>).apply(target, args));
        }
        return new Proxy(value, {
          get(delegate: any, dprop: string | symbol) {
            const dval = delegate[dprop];
            if (typeof dval === 'function' && typeof dprop === 'string') {
              return (...args: unknown[]) => withResilience(() => (dval as (...a: unknown[]) => Promise<unknown>).apply(delegate, args));
            }
            return dval;
          },
        });
      }
      return value;
    },
  }) as T;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const base =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = base;

export const prisma = withHeal(base);
export { Prisma };
