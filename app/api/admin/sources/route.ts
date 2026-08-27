import { NextRequest } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { adminApi, audit } from '@/lib/api-guard';

const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(2).max(300),
  publisher: z.string().max(200).default(''),
  type: z.enum(['government', 'official-record', 'court', 'election-body', 'academic', 'media', 'campaign', 'public-statement', 'research', 'other']).default('media'),
  url: z.string().url().nullable().or(z.literal('')).default(''),
  publishedAt: z.string().nullable().default(null),
  author: z.string().max(200).default(''),
  reliability: z.enum(['official', 'high', 'medium', 'low', 'unverified']).default('unverified'),
  notes: z.string().default(''),
});

export const POST = adminApi('facts.edit', async ({ req, user }) => {
  const d = schema.parse(await req.json());
  const data = {
    title: d.title, publisher: d.publisher, type: d.type, url: d.url || null,
    publishedAt: d.publishedAt ? new Date(d.publishedAt) : null, author: d.author,
    reliability: d.reliability, notes: d.notes,
    verifiedAt: d.reliability !== 'unverified' ? new Date() : null,
  };
  let id: string;
  if (d.id) {
    await prisma.source.update({ where: { id: d.id }, data });
    id = d.id;
    await audit({ user, action: 'update', entity: 'source', entityId: id, newValues: { title: d.title, reliability: d.reliability } });
  } else {
    const c = await prisma.source.create({ data });
    id = c.id;
    await audit({ user, action: 'create', entity: 'source', entityId: id, newValues: { title: d.title } });
  }
  revalidatePath('/admin/facts/sources');
  return { ok: true, id };
});
