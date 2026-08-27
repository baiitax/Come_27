import { NextRequest } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { adminApi, audit } from '@/lib/api-guard';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(80),
  senatorialDistrict: z.string().max(80).default(''),
  priorities: z.string().default(''),
});

export const POST = adminApi('content.edit', async ({ req, user }) => {
  const d = schema.parse(await req.json());
  const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const priorities = d.priorities.split('\n').map((x) => x.trim()).filter(Boolean);
  let id: string;
  if (d.id) {
    await prisma.lga.update({ where: { id: d.id }, data: { name: d.name, slug, senatorialDistrict: d.senatorialDistrict, prioritiesJson: JSON.stringify(priorities) } });
    id = d.id;
    await audit({ user, action: 'update', entity: 'lga', entityId: id, newValues: { name: d.name } });
  } else {
    const dup = await prisma.lga.findFirst({ where: { name: d.name } });
    if (dup) return { error: 'An LGA with this name already exists.' };
    const c = await prisma.lga.create({ data: { name: d.name, slug, senatorialDistrict: d.senatorialDistrict, prioritiesJson: JSON.stringify(priorities) } });
    id = c.id;
    await audit({ user, action: 'create', entity: 'lga', entityId: id, newValues: { name: d.name } });
  }
  revalidatePath('/admin/engagement/lgas');
  return { ok: true, id };
});
