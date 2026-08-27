import { NextRequest } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { adminApi, audit } from '@/lib/api-guard';

const schema = z.object({
  claimId: z.string().min(1),
  type: z.enum(['document', 'url', 'pdf', 'image', 'official-record', 'statement', 'archived']).default('url'),
  title: z.string().min(2).max(300),
  url: z.string().url().nullable().or(z.literal('')).default(''),
  notes: z.string().default(''),
  sourceId: z.string().nullable().default(null),
});

export const POST = adminApi('facts.edit', async ({ req, user }) => {
  const d = schema.parse(await req.json());
  const c = await prisma.evidence.create({
    data: { claimId: d.claimId, type: d.type, title: d.title, url: d.url || null, notes: d.notes, sourceId: d.sourceId },
  });
  await audit({ user, action: 'create', entity: 'evidence', entityId: c.id, newValues: { title: d.title, claimId: d.claimId } });
  revalidatePath('/admin/facts');
  return { ok: true, id: c.id };
});
