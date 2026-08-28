// Generates prisma/migration-sql.ts from all committed migrations (in order),
// used by the runtime self-healer (src/lib/db-heal.ts) on fresh databases.
// Usage: node scripts/gen-migration-sql.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), 'prisma', 'migrations');
const folders = readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const statements = [];
for (const folder of folders) {
  const sql = readFileSync(join(dir, folder, 'migration.sql'), 'utf8');
  for (const chunk of sql.split(/\n\s*\n/)) {
    const s = chunk.trim().replace(/;+\s*$/, '');
    if (s) statements.push(s);
  }
}

const out = `/**
 * GENERATED FILE — do not edit by hand.
 * Source: prisma/migrations/* (all migrations, in order)
 * Used by the runtime database self-healer (src/lib/db-heal.ts) to apply the
 * full schema on a fresh database, without a CLI.
 * Regenerate after any new migration:
 *   node scripts/gen-migration-sql.mjs
 */
export const MIGRATION_STATEMENTS: string[] = ${JSON.stringify(statements, null, 2)};
`;

writeFileSync(join(process.cwd(), 'prisma', 'migration-sql.ts'), out);
console.log(`Wrote prisma/migration-sql.ts with ${statements.length} statements from ${folders.length} migration(s).`);
