import { NextRequest } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { adminApi, audit } from '@/lib/api-guard';

const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(3).max(200),
  slug: z.string().max(120).optional(),
  subtitle: z.string().max(300).default(''),
  body: z.string().default(''),
  category: z.enum(['news', 'speech', 'press-release', 'event', 'statement', 'community', 'policy', 'media', 'announcement']).default('news'),
  tags: z.string().default(''),
  location: z.string().max(120).default(''),
  authorName: z.string().max(120).default('Gwarzo 2027 Desk'),
  featuredImageId: z.string().nullable().default(null),
  status: z.enum(['draft', 'review', 'scheduled', 'published', 'archived']).default('draft'),
  publishAt: z.string().nullable().default(null),
  seoTitle: z.string().max(200).nullable().default(null),
  seoDescription: z.string().max(300).nullable().default(null),
});

export const POST = adminApi('content.edit', async ({ req, user }) => {
  const d = schema.parse(await req.json());
  const slug = d.slug?.trim() || d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').slice(0, 80) || 'item';
  const dup = await prisma.article.findFirst({ where: { slug, id: { not: d.id ?? '' } } });
  if (dup) return { error: 'Slug already exists — choose another URL slug.' };

  const data = {
    title: d.title, slug, subtitle: d.subtitle, body: d.body, category: d.category,
    tagsJson: JSON.stringify(d.tags.split(',').map((t) => t.trim()).filter(Boolean)),
    location: d.location, authorName: d.authorName, featuredImageId: d.featuredImageId,
    status: d.status,
    publishAt: d.publishAt ? new Date(d.publishAt) : null,
    publishedAt: d.status === 'published' ? new Date() : null,
    seoTitle: d.seoTitle, seoDescription: d.seoDescription,
  };

  let id: string;
  if (d.id) {
    const existing = await prisma.article.findUnique({ where: { id: d.id } });
    if (!existing) return { error: 'Article not found.' };
    if (d.status === 'published' && !existing.publishedAt) data.publishedAt = new Date();
    await prisma.article.update({ where: { id: d.id }, data });
    id = d.id;
    await audit({ user, action: d.status === 'published' ? 'publish' : 'update', entity: 'article', entityId: id, oldValues: { status: existing.status }, newValues: { title: data.title, status: data.status } });
    await import('@/lib/audit').then(async (m) => {
      await m.snapshotVersion(user, 'article', id, { title: data.title, status: data.status }, 'Article updated');
    });
  } else {
    const c = await prisma.article.create({ data });
    id = c.id;
    await audit({ user, action: 'create', entity: 'article', entityId: id, newValues: { title: data.title, status: data.status } });
    await import('@/lib/audit').then(async (m) => {
      await m.snapshotVersion(user, 'article', id, { title: data.title, status: data.status }, 'Article created');
    });
  }
  revalidatePath('/admin/content/news');
  revalidatePath('/news');
  revalidatePath('/');
  return { ok: true, id };
});
