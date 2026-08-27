'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, requirePerm } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';

// ============================================================ homepage sections
export async function toggleSection(id: string) {
  const user = await requirePerm(await requireAuth(), 'sections.manage');
  const s = await prisma.pageSection.findUnique({ where: { id } });
  if (!s) return;
  await prisma.pageSection.update({ where: { id }, data: { enabled: !s.enabled } });
  await audit({ user, action: 'update', entity: 'section', entityId: id, newValues: { enabled: !s.enabled } });
  revalidatePath('/');
  revalidatePath('/admin/content');
  return { ok: true };
}

export async function moveSection(id: string, dir: 'up' | 'down') {
  const user = await requirePerm(await requireAuth(), 'sections.manage');
  const sections = await prisma.pageSection.findMany({ orderBy: { sort: 'asc' } });
  const i = sections.findIndex((s) => s.id === id);
  const j = dir === 'up' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= sections.length) return { ok: false };
  const a = sections[i];
  const b = sections[j];
  await prisma.$transaction([
    prisma.pageSection.update({ where: { id: a.id }, data: { sort: b.sort } }),
    prisma.pageSection.update({ where: { id: b.id }, data: { sort: a.sort } }),
  ]);
  await audit({ user, action: 'update', entity: 'section', entityId: id, newValues: { moved: dir } });
  revalidatePath('/');
  revalidatePath('/admin/content');
  return { ok: true };
}

// ============================================================ navigation
const navSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1).max(40),
  href: z.string().min(1).max(200),
  sort: z.string().default('0'),
  enabled: z.literal('on').optional(),
});

export async function saveNavItem(prev: unknown, formData: FormData) {
  const user = await requirePerm(await requireAuth(), 'navigation.manage');
  const d = navSchema.parse(Object.fromEntries(formData.entries()));
  const data = { label: d.label, href: d.href, sort: parseInt(d.sort, 10) || 0, enabled: d.enabled === undefined ? true : !!d.enabled };
  let id: string;
  if (d.id) {
    await prisma.navigationItem.update({ where: { id: d.id }, data });
    id = d.id;
  } else {
    const c = await prisma.navigationItem.create({ data });
    id = c.id;
  }
  await audit({ user, action: d.id ? 'update' : 'create', entity: 'navigation', entityId: id, newValues: { label: d.label, href: d.href } });
  revalidatePath('/');
  revalidatePath('/admin/content');
  return { ok: true, id };
}

export async function deleteNavItem(id: string) {
  const user = await requirePerm(await requireAuth(), 'navigation.manage');
  await prisma.navigationItem.delete({ where: { id } });
  await audit({ user, action: 'delete', entity: 'navigation', entityId: id });
  revalidatePath('/');
  revalidatePath('/admin/content');
  return { ok: true };
}
