import { NextResponse } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { publicRoute } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

export const POST = publicRoute(async (req: Request) => {
  const d = z.object({
    name: z.string().min(2).max(120),
    phone: z.string().max(40).optional().or(z.literal('')),
    email: z.string().email().max(160).optional().or(z.literal('')),
    lga: z.string().max(80).optional(),
  }).safeParse(await req.json().catch(() => ({})));
  if (!d.success) return NextResponse.json({ error: d.error.issues[0].message }, { status: 400 });
  if (!d.data.phone && !d.data.email) return NextResponse.json({ error: 'Please provide a phone number or email.' }, { status: 400 });
  const lga = d.data.lga ? await prisma.lga.findFirst({ where: { name: { equals: d.data.lga } } }) : null;
  await prisma.volunteer.create({
    data: { name: d.data.name, phone: d.data.phone || null, email: d.data.email || null, lgaId: lga?.id ?? null },
  });
  revalidatePath('/admin/engagement/volunteers');
  return NextResponse.json({ ok: true });
});
