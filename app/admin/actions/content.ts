'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, requirePerm } from '@/lib/auth-admin';
import { audit, snapshotVersion } from '@/lib/audit';

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').slice(0, 80) || 'item';
}

type Result = { ok: boolean; error?: string; id?: string };

// ============================================================ ARTICLES (news)
const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
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

export async function saveArticle(prev: unknown, formData: FormData): Promise<Result> {
  const user = await requirePerm(await requireAuth(), 'content.edit');
  const parsed = articleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const slug = d.slug?.trim() || slugify(d.title);
  const dup = await prisma.article.findFirst({ where: { slug, id: { not: d.id ?? '' } } });
  if (dup) return { ok: false, error: 'Slug already exists — choose another URL slug.' };

  const data = {
    title: d.title,
    slug,
    subtitle: d.subtitle,
    body: d.body,
    category: d.category,
    tagsJson: JSON.stringify(d.tags.split(',').map((t) => t.trim()).filter(Boolean)),
    location: d.location,
    authorName: d.authorName,
    featuredImageId: d.featuredImageId,
    status: d.status,
    publishAt: d.publishAt ? new Date(d.publishAt) : null,
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
  };

  let id: string;
  if (d.id) {
    const existing = await prisma.article.findUnique({ where: { id: d.id } });
    if (!existing) return { ok: false, error: 'Article not found.' };
    if (d.status === 'published' && !existing.publishedAt) data.publishedAt = new Date();
    await prisma.article.update({ where: { id: d.id }, data });
    id = d.id;
    await audit({ user, action: data.status === 'published' ? 'publish' : 'update', entity: 'article', entityId: id, oldValues: { title: existing.title, status: existing.status }, newValues: { title: data.title, status: data.status } });
    await snapshotVersion(user, 'article', id, { title: data.title, status: data.status }, 'Article updated');
  } else {
    const created = await prisma.article.create({ data });
    id = created.id;
    await audit({ user, action: 'create', entity: 'article', entityId: id, newValues: { title: data.title, status: data.status } });
    await snapshotVersion(user, 'article', id, { title: data.title, status: data.status }, 'Article created');
  }

  revalidatePath('/admin/content');
  revalidatePath('/news');
  revalidatePath('/');
  return { ok: true, id };
}

export async function setArticleStatus(id: string, status: 'draft' | 'review' | 'scheduled' | 'published' | 'archived') {
  const user = await requireAuth();
  if (status === 'published') await requirePerm(user, 'content.publish');
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return;
  await prisma.article.update({
    where: { id },
    data: { status, publishedAt: status === 'published' ? article.publishedAt ?? new Date() : article.publishedAt },
  });
  await audit({ user, action: status === 'published' ? 'publish' : status === 'archived' ? 'archive' : 'update', entity: 'article', entityId: id, oldValues: { status: article.status }, newValues: { status } });
  revalidatePath('/admin/content');
  revalidatePath('/news');
  revalidatePath('/');
}

export async function deleteArticle(id: string) {
  const user = await requirePerm(await requireAuth(), 'content.delete');
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return;
  // soft delete — public record content is archived, never erased by default
  await prisma.article.update({ where: { id }, data: { deletedAt: new Date(), status: 'archived' } });
  await audit({ user, action: 'delete', entity: 'article', entityId: id, oldValues: { title: article.title } });
  revalidatePath('/admin/content');
  revalidatePath('/news');
}

export async function restoreArticle(id: string) {
  const user = await requirePerm(await requireAuth(), 'content.delete');
  await prisma.article.update({ where: { id }, data: { deletedAt: null, status: 'draft' } });
  await audit({ user, action: 'restore', entity: 'article', entityId: id });
  revalidatePath('/admin/content');
}

// ============================================================ SPEECHES
const speechSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3).max(200),
  eventName: z.string().max(200).default(''),
  eventDate: z.string().max(60).default(''),
  venue: z.string().max(200).default(''),
  location: z.string().max(120).default(''),
  transcript: z.string().default(''),
  summary: z.string().default(''),
  videoUrl: z.string().url().nullable().or(z.literal('')).default(''),
  audioUrl: z.string().url().nullable().or(z.literal('')).default(''),
  themes: z.string().default(''),
  status: z.enum(['draft', 'review', 'published', 'archived']).default('draft'),
});

export async function saveSpeech(prev: unknown, formData: FormData): Promise<Result> {
  const user = await requirePerm(await requireAuth(), 'content.edit');
  const d = speechSchema.parse(Object.fromEntries(formData.entries()));
  const data = {
    title: d.title, eventName: d.eventName, eventDate: d.eventDate, venue: d.venue, location: d.location,
    transcript: d.transcript, summary: d.summary,
    videoUrl: d.videoUrl || null, audioUrl: d.audioUrl || null,
    themesJson: JSON.stringify(d.themes.split(',').map((t) => t.trim()).filter(Boolean)),
    status: d.status,
    publishedAt: d.status === 'published' ? new Date() : null,
  };
  let id: string;
  if (d.id) {
    await prisma.speech.update({ where: { id: d.id }, data });
    id = d.id;
    await audit({ user, action: 'update', entity: 'speech', entityId: id, newValues: { title: d.title } });
  } else {
    const c = await prisma.speech.create({ data });
    id = c.id;
    await audit({ user, action: 'create', entity: 'speech', entityId: id, newValues: { title: d.title } });
  }
  revalidatePath('/admin/speeches');
  return { ok: true, id };
}

export async function deleteSpeech(id: string) {
  const user = await requirePerm(await requireAuth(), 'content.delete');
  await prisma.speech.update({ where: { id }, data: { deletedAt: new Date(), status: 'archived' } });
  await audit({ user, action: 'delete', entity: 'speech', entityId: id });
  revalidatePath('/admin/speeches');
}

// ============================================================ EVENTS
const eventSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(200),
  description: z.string().default(''),
  startsAt: z.string().min(1, 'Start date is required'),
  endsAt: z.string().nullable().default(null),
  venue: z.string().max(200).default(''),
  lgaId: z.string().nullable().default(null),
  address: z.string().max(300).default(''),
  category: z.enum(['rally', 'townhall', 'media', 'community', 'official']).default('rally'),
  organizer: z.string().max(120).default(''),
  registrationUrl: z.string().url().nullable().or(z.literal('')).default(''),
  status: z.enum(['draft', 'upcoming', 'live', 'completed', 'cancelled', 'archived']).default('draft'),
});

export async function saveEvent(prev: unknown, formData: FormData): Promise<Result> {
  const user = await requirePerm(await requireAuth(), 'content.edit');
  const d = eventSchema.parse(Object.fromEntries(formData.entries()));
  const data = {
    name: d.name, description: d.description,
    startsAt: new Date(d.startsAt), endsAt: d.endsAt ? new Date(d.endsAt) : null,
    venue: d.venue, lgaId: d.lgaId, address: d.address, category: d.category, organizer: d.organizer,
    registrationUrl: d.registrationUrl || null, status: d.status,
  };
  let id: string;
  if (d.id) {
    await prisma.campaignEvent.update({ where: { id: d.id }, data });
    id = d.id;
    await audit({ user, action: 'update', entity: 'event', entityId: id, newValues: { name: d.name, status: d.status } });
  } else {
    const c = await prisma.campaignEvent.create({ data });
    id = c.id;
    await audit({ user, action: 'create', entity: 'event', entityId: id, newValues: { name: d.name, status: d.status } });
  }
  revalidatePath('/admin/events');
  return { ok: true, id };
}

export async function deleteEvent(id: string) {
  const user = await requirePerm(await requireAuth(), 'content.delete');
  await prisma.campaignEvent.update({ where: { id }, data: { deletedAt: new Date(), status: 'archived' } });
  await audit({ user, action: 'delete', entity: 'event', entityId: id });
  revalidatePath('/admin/events');
}

// ============================================================ TIMELINE
const timelineSchema = z.object({
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
  featured: z.literal('on').optional(),
  published: z.literal('on').optional(),
  sort: z.string().default('0'),
});

export async function saveTimelineEntry(prev: unknown, formData: FormData): Promise<Result> {
  const user = await requirePerm(await requireAuth(), 'content.edit');
  const d = timelineSchema.parse(Object.fromEntries(formData.entries()));
  const data = {
    year: d.year, date: d.date || null, title: d.title, category: d.category, institution: d.institution,
    location: d.location, description: d.description, impact: d.impact,
    evidenceLevel: d.evidenceLevel, source: d.source || null,
    featured: !!d.featured, published: d.published === undefined ? true : !!d.published,
    sort: parseInt(d.sort, 10) || 0,
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
}

export async function deleteTimelineEntry(id: string) {
  const user = await requirePerm(await requireAuth(), 'content.delete');
  await prisma.timelineEntry.update({ where: { id }, data: { deletedAt: new Date() } });
  await audit({ user, action: 'delete', entity: 'timeline', entityId: id });
  revalidatePath('/admin/timeline');
  revalidatePath('/');
}

// ============================================================ SERVICE RECORDS
const recordSchema = z.object({
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
  published: z.literal('on').optional(),
});

export async function saveRecord(prev: unknown, formData: FormData): Promise<Result> {
  const user = await requirePerm(await requireAuth(), 'content.edit');
  const d = recordSchema.parse(Object.fromEntries(formData.entries()));
  const data = {
    position: d.position, institution: d.institution, startDate: d.startDate, endDate: d.endDate,
    location: d.location, responsibilities: d.responsibilities, description: d.description,
    impact: d.impact, achievements: d.achievements, evidenceStatus: d.evidenceStatus,
    verificationDate: d.evidenceStatus === 'verified' ? new Date() : null,
    reviewer: d.reviewer || null, notes: d.notes, published: d.published === undefined ? true : !!d.published,
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
}

export async function deleteRecord(id: string) {
  const user = await requirePerm(await requireAuth(), 'content.delete');
  await prisma.serviceRecord.update({ where: { id }, data: { deletedAt: new Date(), published: false } });
  await audit({ user, action: 'delete', entity: 'record', entityId: id });
  revalidatePath('/admin/record');
}

// ============================================================ POLICY SECTORS
const sectorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(80),
  icon: z.string().max(40).default('target'),
  problemStatement: z.string().default(''),
  currentContext: z.string().default(''),
  approach: z.string().default(''),
  objectives: z.string().default(''), // one per line
  initiatives: z.string().default(''), // one per line
  research: z.string().default(''),
  published: z.literal('on').optional(),
});

export async function saveSector(prev: unknown, formData: FormData): Promise<Result> {
  const user = await requirePerm(await requireAuth(), 'content.edit');
  const d = sectorSchema.parse(Object.fromEntries(formData.entries()));
  const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);
  let id: string;
  if (d.id) {
    await prisma.policySector.update({
      where: { id: d.id },
      data: {
        name: d.name, icon: d.icon, problemStatement: d.problemStatement, currentContext: d.currentContext,
        approach: d.approach, objectivesJson: JSON.stringify(lines(d.objectives)),
        metricsJson: JSON.stringify([]), researchJson: JSON.stringify(lines(d.research)),
        published: d.published === undefined ? true : !!d.published,
      },
    });
    // replace initiatives
    await prisma.policyInitiative.deleteMany({ where: { sectorId: d.id } });
    const inits = lines(d.initiatives).map((title, i) => ({ sectorId: d.id, title, sort: i }));
    if (inits.length) await prisma.policyInitiative.createMany({ data: inits });
    id = d.id;
    await audit({ user, action: 'update', entity: 'policy', entityId: id, newValues: { name: d.name } });
  } else {
    const sector = await prisma.policySector.create({
      data: {
        name: d.name, icon: d.icon, problemStatement: d.problemStatement, currentContext: d.currentContext,
        approach: d.approach, objectivesJson: JSON.stringify(lines(d.objectives)),
        researchJson: JSON.stringify(lines(d.research)),
        published: d.published === undefined ? true : !!d.published,
      },
    });
    id = sector.id;
    const inits = lines(d.initiatives).map((title, i) => ({ sectorId: id, title, sort: i }));
    if (inits.length) await prisma.policyInitiative.createMany({ data: inits });
    await audit({ user, action: 'create', entity: 'policy', entityId: id, newValues: { name: d.name } });
  }
  revalidatePath('/admin/policies');
  return { ok: true, id };
}

export async function deleteSector(id: string) {
  const user = await requirePerm(await requireAuth(), 'content.delete');
  await prisma.policySector.delete({ where: { id } });
  await audit({ user, action: 'delete', entity: 'policy', entityId: id });
  revalidatePath('/admin/policies');
}
