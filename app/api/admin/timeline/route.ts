import { NextRequest } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { adminApi, audit } from '@/lib/api-guard';

const schema = z.object({
  id: z.string().optional(),
  year: z.string().min(1).max(20),
  date: z.string().max(40).default(''),
  title: z.string().min(2).max(200),
  category: z.enum(['education', 'grassroots', 'public-service', 'federal', 'state-government', 'candidacy']).default('public-service'),
  institution: z.string().max(200).default(''),
  location: z.string().max(120).default(''),
  description: z.string().default(''),
  impact: z.string().default(''),
  evidenceLevel: z.enum(['verified', 'official-record', 'reported', 'campaign-claim']).default('official-record'),
  source: z.string().max(200).default(''),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sort: z.number().int().default(0),
});

export const POST = adminApi('content.edit', async ({ req, user }) => {
  const d = schema.parse(await req.json());
  const data = {
    year: d.year, date: d.date || null, title: d.title, category: d.category, institution: d.institution,
    location: d.location, description: d.description, impact: d.impact,
    evidenceLevel: d.evidenceLevel, source: d.source || null,
    featured: d.featured, published: d.published, sort: d.sort,
  };
  let id: string;
  if (d.id) {
    await prisma.timelineEntry.update({ where: { id: d.id }, data });
    id = d.id;
    await audit({ user, action: 'update', entity: 'timeline', entityId: id, newValues: { title: d.title } });
  } else {
    const c = await prisma.timelineEntry.create({ data });
    id = c.id;
    await audit({ user, action: 'create', entity: 'timeline', entityId: id, newValues: { title: d.title } });
  }
  revalidatePath('/admin/timeline');
  revalidatePath('/');
  revalidatePath('/about');
  return { ok: true, id };
});
