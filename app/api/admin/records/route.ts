import { NextRequest } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { adminApi, audit } from '@/lib/api-guard';

const schema = z.object({
  id: z.string().optional(),
  position: z.string().min(2).max(200),
  institution: z.string().min(2).max(200),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  location: z.string().max(120).default(''),
  responsibilities: z.string().default(''),
  description: z.string().default(''),
  impact: z.string().default(''),
  achievements: z.string().default(''),
  evidenceStatus: z.enum(['verified', 'official-record', 'reported', 'campaign-claim', 'proposed', 'under-review', 'disputed', 'archived']).default('under-review'),
  reviewer: z.string().max(120).default(''),
  notes: z.string().default(''),
  published: z.boolean().default(true),
});

export const POST = adminApi('content.edit', async ({ req, user }) => {
  const d = schema.parse(await req.json());
  const data = {
    position: d.position, institution: d.institution, startDate: d.startDate, endDate: d.endDate,
    location: d.location, responsibilities: d.responsibilities, description: d.description,
    impact: d.impact, achievements: d.achievements, evidenceStatus: d.evidenceStatus,
    verificationDate: d.evidenceStatus === 'verified' ? new Date() : null,
    reviewer: d.reviewer || null, notes: d.notes, published: d.published,
  };
  let id: string;
  if (d.id) {
    await prisma.serviceRecord.update({ where: { id: d.id }, data });
    id = d.id;
    await audit({ user, action: 'update', entity: 'record', entityId: id, newValues: { position: d.position, evidenceStatus: d.evidenceStatus } });
  } else {
    const c = await prisma.serviceRecord.create({ data });
    id = c.id;
    await audit({ user, action: 'create', entity: 'record', entityId: id, newValues: { position: d.position, evidenceStatus: d.evidenceStatus } });
  }
  revalidatePath('/admin/record');
  revalidatePath('/');
  return { ok: true, id };
});
