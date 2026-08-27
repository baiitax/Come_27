import { NextRequest } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { adminApi, audit } from '@/lib/api-guard';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(200),
  description: z.string().default(''),
  startsAt: z.string().min(1),
  endsAt: z.string().nullable().default(null),
  venue: z.string().max(200).default(''),
  lgaId: z.string().nullable().default(null),
  address: z.string().max(300).default(''),
  category: z.enum(['rally', 'townhall', 'media', 'community', 'official']).default('rally'),
  organizer: z.string().max(120).default(''),
  registrationUrl: z.string().url().nullable().or(z.literal('')).default(''),
  status: z.enum(['draft', 'upcoming', 'live', 'completed', 'cancelled', 'archived']).default('draft'),
});

export const POST = adminApi('content.edit', async ({ req, user }) => {
  const d = schema.parse(await req.json());
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
});
