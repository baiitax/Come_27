import { PrismaClient, Prisma } from '@prisma/client';
import { ensureDatabase, isDbDownError } from './db-heal';

/**
 * Prisma client with runtime self-healing:
 * on a database-down error (unreachable / missing tables / drift), run the
 * one-time self-heal (migrate + seed-if-empty) once, then retry the query.
 */
function retryOnDbDown<T>(op: () => Promise<T>): Promise<T> {
  let healed = false;
  return op().catch(async (e) => {
    if (isDbDownError(e) && !healed) {
      healed = true;
      const report = await ensureDatabase();
      if (report.ok) return op();
    }
    throw e;
  });
}

function withHeal<T>(client: T): T {
  return new Proxy(client, {
    get(target: any, prop: string | symbol) {
      const value = target[prop];
      if (typeof value === 'function') {
        if (typeof prop === 'string' && prop.startsWith('$')) {
          return (...args: unknown[]) => retryOnDbDown(() => (value as (...a: unknown[]) => Promise<unknown>).apply(target, args));
        }
        return new Proxy(value, {
          get(delegate: any, dprop: string | symbol) {
            const dval = delegate[dprop];
            if (typeof dval === 'function' && typeof dprop === 'string') {
              return (...args: unknown[]) => retryOnDbDown(() => (dval as (...a: unknown[]) => Promise<unknown>).apply(delegate, args));
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
