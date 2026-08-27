import { NextRequest } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { adminApi, audit } from '@/lib/api-guard';

const schema = z.object({
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

export const POST = adminApi('content.edit', async ({ req, user }) => {
  const d = schema.parse(await req.json());
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
    await audit({ user, action: 'update', entity: 'speech', entityId: id, newValues: { title: d.title, status: d.status } });
  } else {
    const c = await prisma.speech.create({ data });
    id = c.id;
    await audit({ user, action: 'create', entity: 'speech', entityId: id, newValues: { title: d.title } });
  }
  revalidatePath('/admin/speeches');
  return { ok: true, id };
});
