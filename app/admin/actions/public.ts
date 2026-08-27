'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const submissionSchema = z.object({
  lga: z.string().max(80).optional(),
  topic: z.string().max(60).optional(),
  message: z.string().min(10, 'Please share a bit more detail (at least 10 characters).').max(3000),
  name: z.string().max(120).optional().or(z.literal('')),
  consent: z.literal('on').optional(),
});

/** Public community submission (the "Talk to Gwarzo" form on the site). */
export async function publicSubmit(prev: unknown, formData: FormData) {
  const d = submissionSchema.safeParse({
    lga: formData.get('lga'),
    topic: formData.get('topic'),
    message: formData.get('message'),
    name: formData.get('name'),
    consent: formData.get('consent'),
  });
  if (!d.success) return { ok: false, error: d.error.issues[0].message };

  const lga = d.data.lga ? await prisma.lga.findFirst({ where: { name: { equals: d.data.lga } } }) : null;

  await prisma.communitySubmission.create({
    data: {
      lgaId: lga?.id ?? null,
      topicName: (d.data.topic ?? 'general').toLowerCase().slice(0, 60) || 'general',
      message: d.data.message,
      name: d.data.name || null,
      consent: !!d.data.consent,
      status: 'new',
      isDemo: false,
    },
  });

  // notify admins (aggregated, no PII beyond what was submitted)
  const count = await prisma.communitySubmission.count({ where: { status: 'new' } });
  await prisma.notification.create({
    data: { kind: 'submission', title: 'New community submission', body: `${count} submission(s) awaiting assignment.` },
  });

  revalidatePath('/admin/engagement');
  revalidatePath('/');
  return { ok: true };
}
