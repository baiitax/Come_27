'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, requirePerm } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';

// ============================================================ SOURCES
const sourceSchema = z.object({
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

export async function saveSource(prev: unknown, formData: FormData) {
  const user = await requirePerm(await requireAuth(), 'facts.edit');
  const d = sourceSchema.parse(Object.fromEntries(formData.entries()));
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
}

export async function deleteSource(id: string) {
  const user = await requirePerm(await requireAuth(), 'facts.edit');
  await prisma.source.update({ where: { id }, data: { publisher: '[RETIRED]', reliability: 'unverified' } });
  await audit({ user, action: 'delete', entity: 'source', entityId: id });
  revalidatePath('/admin/facts/sources');
}

// ============================================================ CLAIMS
const claimSchema = z.object({
  id: z.string().optional(),
  statement: z.string().min(5, 'Claim must be at least 5 characters').max(2000),
  context: z.string().default(''),
  category: z.string().max(80).default('general'),
  submittedBy: z.string().max(120).default(''),
  status: z.enum(['under-review', 'verified', 'mostly-verified', 'unverified', 'misleading', 'false', 'insufficient']).default('under-review'),
  sourceId: z.string().nullable().default(null),
  verdictNotes: z.string().default(''),
});

export async function saveClaim(prev: unknown, formData: FormData) {
  const user = await requireAuth();
  const d = claimSchema.parse(Object.fromEntries(formData.entries()));
  const canVerify = has(user, 'facts.verify');
  const data = {
    statement: d.statement, context: d.context, category: d.category, submittedBy: d.submittedBy,
    sourceId: d.sourceId, verdictNotes: d.verdictNotes,
    status: canVerify ? d.status : 'under-review', // only fact checkers / reviewers may set verdicts
    verifiedBy: canVerify && d.status !== 'under-review' ? user.email : null,
    verifiedAt: canVerify && d.status !== 'under-review' ? new Date() : null,
  };
  let id: string;
  if (d.id) {
    await prisma.claim.update({ where: { id: d.id }, data });
    id = d.id;
    await audit({ user, action: data.status !== 'under-review' ? 'verify' : 'update', entity: 'claim', entityId: id, newValues: { status: data.status, statement: d.statement } });
  } else {
    const c = await prisma.claim.create({ data });
    id = c.id;
    await audit({ user, action: 'create', entity: 'claim', entityId: id, newValues: { statement: d.statement } });
  }
  revalidatePath('/admin/facts');
  revalidatePath('/facts');
  return { ok: true, id };
}

export async function deleteClaim(id: string) {
  const user = await requirePerm(await requireAuth(), 'facts.edit');
  await prisma.claim.delete({ where: { id } });
  await audit({ user, action: 'delete', entity: 'claim', entityId: id });
  revalidatePath('/admin/facts');
}

function has(user: { role: string }, permission: string): boolean {
  const { hasPermission } = require('@/lib/permissions') as typeof import('@/lib/permissions');
  return hasPermission(user.role, permission);
}

// ============================================================ EVIDENCE
const evidenceSchema = z.object({
  claimId: z.string().min(1),
  type: z.enum(['document', 'url', 'pdf', 'image', 'official-record', 'statement', 'archived']).default('url'),
  title: z.string().min(2).max(300),
  url: z.string().url().nullable().or(z.literal('')).default(''),
  notes: z.string().default(''),
  sourceId: z.string().nullable().default(null),
});

export async function addEvidence(prev: unknown, formData: FormData) {
  const user = await requirePerm(await requireAuth(), 'facts.edit');
  const d = evidenceSchema.parse(Object.fromEntries(formData.entries()));
  const c = await prisma.evidence.create({
    data: { claimId: d.claimId, type: d.type, title: d.title, url: d.url || null, notes: d.notes, sourceId: d.sourceId },
  });
  await audit({ user, action: 'create', entity: 'evidence', entityId: c.id, newValues: { title: d.title, claimId: d.claimId } });
  revalidatePath('/admin/facts');
  return { ok: true, id: c.id };
}

export async function removeEvidence(id: string) {
  const user = await requirePerm(await requireAuth(), 'facts.edit');
  const ev = await prisma.evidence.findUnique({ where: { id } });
  await prisma.evidence.delete({ where: { id } });
  await audit({ user, action: 'delete', entity: 'evidence', entityId: id, oldValues: ev ? { title: ev.title } : {} });
  revalidatePath('/admin/facts');
  return { ok: true };
}
