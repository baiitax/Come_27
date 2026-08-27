'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { requireAuth, requirePerm } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';
import { computeAlerts } from '@/lib/stats';

// ============================================================ USERS
const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  password: z.string().min(10, 'Password must be at least 10 characters').max(200).optional().or(z.literal('')),
  role: z.enum(['super_admin', 'content_admin', 'editor', 'fact_checker', 'media_manager', 'engagement_manager', 'analytics_manager', 'reviewer', 'read_only']),
  isActive: z.literal('on').optional(),
});

export async function saveUser(prev: unknown, formData: FormData) {
  const actor = await requirePerm(await requireAuth(), 'users.manage');
  const d = userSchema.parse(Object.fromEntries(formData.entries()));
  const email = d.email.toLowerCase();
  const dup = await prisma.user.findFirst({ where: { email, id: { not: d.id ?? '' } } });
  if (dup) return { ok: false, error: 'A user with this email already exists.' };

  let id: string;
  if (d.id) {
    const data: Record<string, unknown> = { name: d.name, email, role: d.role, isActive: d.isActive === undefined ? true : !!d.isActive };
    if (d.password) data.passwordHash = await bcrypt.hash(d.password, 12);
    await prisma.user.update({ where: { id: d.id }, data });
    id = d.id;
    await audit({ user: actor, action: 'update', entity: 'user', entityId: id, newValues: { name: d.name, role: d.role } });
  } else {
    if (!d.password) return { ok: false, error: 'Password is required for new users.' };
    const c = await prisma.user.create({ data: { name: d.name, email, role: d.role, passwordHash: await bcrypt.hash(d.password, 12) } });
    id = c.id;
    await audit({ user: actor, action: 'create', entity: 'user', entityId: id, newValues: { name: d.name, role: d.role } });
  }
  revalidatePath('/admin/users');
  return { ok: true, id };
}

export async function toggleUserActive(id: string) {
  const actor = await requirePerm(await requireAuth(), 'users.manage');
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) return;
  await prisma.user.update({ where: { id }, data: { isActive: !u.isActive } });
  await audit({ user: actor, action: 'update', entity: 'user', entityId: id, newValues: { isActive: !u.isActive } });
  revalidatePath('/admin/users');
  return { ok: true };
}

// ============================================================ SETTINGS
const SETTING_KEYS = [
  'brand.campaignName', 'brand.tagline', 'brand.primaryColor', 'brand.accentColor',
  'contact.email', 'contact.phone', 'contact.address', 'contact.x', 'contact.facebook', 'contact.instagram',
  'site.title', 'site.description', 'site.analyticsId',
  'footer.copyright', 'footer.disclaimer',
] as const;

export async function saveSettings(prev: unknown, formData: FormData) {
  const user = await requirePerm(await requireAuth(), 'settings.manage');
  const entries = Object.entries(Object.fromEntries(formData.entries()));
  for (const [key, value] of entries) {
    if (!SETTING_KEYS.includes(key as (typeof SETTING_KEYS)[number])) continue; // strict allowlist
    const v = String(value).slice(0, 1000);
    await prisma.siteSetting.upsert({ where: { key }, update: { value: v }, create: { key, value: v } });
  }
  await audit({ user, action: 'update', entity: 'settings', newValues: { keys: entries.map(([k]) => k) } });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');
  return { ok: true };
}

// ============================================================ ALERTS & NOTIFICATIONS
export async function resolveAlert(id: string) {
  const user = await requireAuth();
  await prisma.alert.update({ where: { id }, data: { resolvedAt: new Date() } });
  await audit({ user, action: 'update', entity: 'alert', entityId: id, newValues: { resolved: true } });
  revalidatePath('/admin/intelligence/alerts');
  revalidatePath('/admin/dashboard');
  return { ok: true };
}

export async function markNotificationsRead() {
  const user = await requireAuth();
  await prisma.notification.updateMany({ where: { userId: user.id, readAt: null }, data: { readAt: new Date() } });
  revalidatePath('/admin', 'layout');
  return { ok: true };
}

export async function refreshAlerts() {
  const user = await requireAuth();
  await computeAlerts();
  await audit({ user, action: 'update', entity: 'alerts', newValues: { recomputed: true } });
  revalidatePath('/admin/intelligence/alerts');
  revalidatePath('/admin/dashboard');
  return { ok: true };
}

// ============================================================ REPORTS
export async function generateReport(kind: 'daily' | 'weekly' | 'monthly') {
  const user = await requirePerm(await requireAuth(), 'reports.generate');
  const days = kind === 'daily' ? 1 : kind === 'weekly' ? 7 : 30;
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const [views, topPages, subs, claimsOpen, alerts] = await Promise.all([
    prisma.analyticsEvent.count({ where: { isDemo: false, type: 'page_view', createdAt: { gte: from } } }),
    prisma.analyticsEvent.groupBy({ by: ['path'], where: { isDemo: false, type: 'page_view', createdAt: { gte: from } }, _count: { _all: true }, orderBy: { _count: { path: 'desc' } }, take: 10 }),
    prisma.communitySubmission.count({ where: { isDemo: false, createdAt: { gte: from } } }),
    prisma.claim.count({ where: { status: 'under-review' } }),
    prisma.alert.count({ where: { resolvedAt: null } }),
  ]);
  const data = {
    kind,
    generatedAt: new Date().toISOString(),
    periodDays: days,
    pageViews: views,
    topPages: topPages.map((p) => ({ path: p.path, views: p._count._all })),
    communitySubmissions: subs,
    claimsAwaitingVerification: claimsOpen,
    openAlerts: alerts,
    disclaimer: views === 0 && subs === 0 ? 'No genuine activity in period — figures reflect live data only (demo analytics excluded).' : 'Live data (demo excluded).',
  };
  const r = await prisma.report.create({ data: { kind, dataJson: JSON.stringify(data) } });
  await audit({ user, action: 'export', entity: 'report', entityId: r.id, newValues: { kind } });
  revalidatePath('/admin/reports');
  return { ok: true, id: r.id, data };
}
