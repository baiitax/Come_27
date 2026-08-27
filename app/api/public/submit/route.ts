import { NextResponse } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const schema = z.object({
  lga: z.string().max(80).optional(),
  topic: z.string().max(60).optional(),
  message: z.string().min(10).max(3000),
  name: z.string().max(120).optional().or(z.literal('')),
  consent: z.boolean().default(false),
});

export async function POST(req: Request) {
  const d = schema.safeParse(await req.json().catch(() => ({})));
  if (!d.success) return NextResponse.json({ error: d.error.issues[0].message }, { status: 400 });

  const lga = d.data.lga ? await prisma.lga.findFirst({ where: { name: { equals: d.data.lga } } }) : null;
  const topic = d.data.topic ? await prisma.issueCategory.findFirst({ where: { name: { equals: d.data.topic.toLowerCase() } } }) : null;

  await prisma.communitySubmission.create({
    data: {
      lgaId: lga?.id ?? null,
      topicId: topic?.id ?? null,
      topicName: (d.data.topic ?? 'general').toLowerCase().slice(0, 60) || 'general',
      message: d.data.message,
      name: d.data.name || null,
      consent: d.data.consent,
      status: 'new',
      isDemo: false,
    },
  });

  await prisma.notification.create({
    data: { kind: 'submission', title: 'New community submission', body: 'A public submission is awaiting triage.' },
  });

  revalidatePath('/admin/engagement');
  return NextResponse.json({ ok: true });
}
