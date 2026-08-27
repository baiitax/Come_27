'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, requirePerm } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';

const STATUSES = ['new', 'acknowledged', 'under-review', 'assigned', 'responded', 'resolved', 'archived'] as const;

// --------------------------------------------------------- public site
/** Public volunteer registration (no auth). */
export async function publicVolunteerRegister(prev: unknown, formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const lgaId = String(formData.get('lga') ?? '') || null;
  if (name.length < 2) return { ok: false, error: 'Please enter your name.' };
  if (!phone && !email) return { ok: false, error: 'Please provide a phone number or email.' };
  await prisma.volunteer.create({
    data: { name: name.slice(0, 120), phone: phone.slice(0, 40) || null, email: email.slice(0, 160) || null, lgaId },
  });
  revalidatePath('/admin/engagement/volunteers');
  return { ok: true };
}

// --------------------------------------------------------- workflow
export async function setSubmissionStatus(id: string, status: (typeof STATUSES)[number]) {
  const user = await requirePerm(await requireAuth(), 'engagement.view');
  if (!STATUSES.includes(status)) return { ok: false, error: 'Invalid status' };
  const s = await prisma.communitySubmission.findUnique({ where: { id } });
  if (!s) return { ok: false, error: 'Not found' };
  const data: Record<string, unknown> = { status };
  if (status === 'resolved') data.resolvedAt = new Date();
  if (status === 'responded') data.resolvedAt = null;
  await prisma.communitySubmission.update({ where: { id }, data });
  await audit({ user, action: status === 'assigned' ? 'assign' : 'update', entity: 'submission', entityId: id, oldValues: { status: s.status }, newValues: { status } });
  revalidatePath('/admin/engagement');
  return { ok: true };
}

const respondSchema = z.object({
  response: z.string().max(5000).default(''),
  assignedTo: z.string().max(120).default(''),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  internalNotes: z.string().max(5000).default(''),
});

export async function respondToSubmission(prev: unknown, formData: FormData) {
  const user = await requirePerm(await requireAuth(), 'engagement.respond');
  const id = String(formData.get('id') ?? '');
  const d = respondSchema.parse(Object.fromEntries(formData.entries()));
  const s = await prisma.communitySubmission.findUnique({ where: { id } });
  if (!s) return { ok: false, error: 'Not found' };
  const status = d.response && s.status !== 'responded' ? 'responded' : s.status === 'new' ? 'acknowledged' : s.status;
  await prisma.communitySubmission.update({
    where: { id },
    data: { response: d.response, assignedTo: d.assignedTo || null, priority: d.priority, internalNotes: d.internalNotes, status },
  });
  await audit({ user, action: d.response ? 'update' : 'assign', entity: 'submission', entityId: id, newValues: { status, priority: d.priority } });
  revalidatePath('/admin/engagement');
  return { ok: true };
}

export async function deleteSubmission(id: string) {
  const user = await requirePerm(await requireAuth(), 'engagement.assign');
  const s = await prisma.communitySubmission.findUnique({ where: { id } });
  await prisma.communitySubmission.update({ where: { id }, data: { status: 'archived', message: '[WITHDRAWN BY ADMIN]' } });
  await audit({ user, action: 'delete', entity: 'submission', entityId: id, oldValues: s ? { status: s.status } : {} });
  revalidatePath('/admin/engagement');
  return { ok: true };
}

// --------------------------------------------------------- volunteers
export async function setVolunteerStatus(id: string, status: 'pending' | 'active' | 'on-leave' | 'declined') {
  const user = await requirePerm(await requireAuth(), 'volunteers.manage');
  await prisma.volunteer.update({ where: { id }, data: { status } });
  await audit({ user, action: 'update', entity: 'volunteer', entityId: id, newValues: { status } });
  revalidatePath('/admin/engagement/volunteers');
  return { ok: true };
}

// --------------------------------------------------------- LGAs
const lgaSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(80),
  senatorialDistrict: z.string().max(80).default(''),
  priorities: z.string().default(''), // one per line
});

export async function saveLga(prev: unknown, formData: FormData) {
  const user = await requirePerm(await requireAuth(), 'content.edit');
  const d = lgaSchema.parse(Object.fromEntries(formData.entries()));
  const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const dup = await prisma.lga.findFirst({ where: { name: d.name }, include: { id: true } });
  const priorities = d.priorities.split('\n').map((x) => x.trim()).filter(Boolean);
  let id: string;
  if (d.id) {
    await prisma.lga.update({ where: { id: d.id }, data: { name: d.name, slug, senatorialDistrict: d.senatorialDistrict, prioritiesJson: JSON.stringify(priorities) } });
    id = d.id;
    await audit({ user, action: 'update', entity: 'lga', entityId: id, newValues: { name: d.name } });
  } else {
    if (dup) return { ok: false, error: 'An LGA with this name already exists.' };
    const c = await prisma.lga.create({ data: { name: d.name, slug, senatorialDistrict: d.senatorialDistrict, prioritiesJson: JSON.stringify(priorities) } });
    id = c.id;
    await audit({ user, action: 'create', entity: 'lga', entityId: id, newValues: { name: d.name } });
  }
  revalidatePath('/admin/engagement/lgas');
  return { ok: true, id };
}
