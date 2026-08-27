import { NextRequest } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { adminApi, audit } from '@/lib/api-guard';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(80),
  icon: z.string().max(40).default('target'),
  problemStatement: z.string().default(''),
  currentContext: z.string().default(''),
  approach: z.string().default(''),
  objectives: z.string().default(''),
  initiatives: z.string().default(''),
  research: z.string().default(''),
  published: z.boolean().default(true),
});

const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);

export const POST = adminApi('content.edit', async ({ req, user }) => {
  const d = schema.parse(await req.json());
  let id: string;
  if (d.id) {
    await prisma.policySector.update({
      where: { id: d.id },
      data: {
        name: d.name, icon: d.icon, problemStatement: d.problemStatement, currentContext: d.currentContext,
        approach: d.approach, objectivesJson: JSON.stringify(lines(d.objectives)),
        researchJson: JSON.stringify(lines(d.research)), published: d.published,
      },
    });
    await prisma.policyInitiative.deleteMany({ where: { sectorId: d.id } });
    const inits = lines(d.initiatives).map((title, i) => ({ sectorId: d.id, title, sort: i }));
    if (inits.length) await prisma.policyInitiative.createMany({ data: inits });
    id = d.id;
    await audit({ user, action: 'update', entity: 'policy', entityId: id, newValues: { name: d.name } });
  } else {
    const sector = await prisma.policySector.create({
      data: {
        name: d.name, icon: d.icon, problemStatement: d.problemStatement, currentContext: d.currentContext,
        approach: d.approach, objectivesJson: JSON.stringify(lines(d.objectives)),
        researchJson: JSON.stringify(lines(d.research)), published: d.published,
      },
    });
    id = sector.id;
    const inits = lines(d.initiatives).map((title, i) => ({ sectorId: id, title, sort: i }));
    if (inits.length) await prisma.policyInitiative.createMany({ data: inits });
    await audit({ user, action: 'create', entity: 'policy', entityId: id, newValues: { name: d.name } });
  }
  revalidatePath('/admin/policies');
  return { ok: true, id };
});
