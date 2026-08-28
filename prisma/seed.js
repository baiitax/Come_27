/* Gwarzo 2027 — CLI seed entry.
 * Demo-deployment seed: realistic campaign content (isDemo: false).
 * Idempotent: skips seeding when the database already contains users.
 */
const { PrismaClient } = require('@prisma/client');
const { seedCore } = require('./seed-core');

(async () => {
  const prisma = new PrismaClient();
  const result = await seedCore(prisma);
  console.log('SEED COMPLETE —', result);
  if (result === 'seeded') {
    console.log('  LGAs: 44 | roles: 9 | users: 2 (admin@gwarzo2027.ng / Gwarzo@2027!)');
    console.log('  DEMO records are seeded as demo-deployment content (isDemo: false).');
  }
  await prisma.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
