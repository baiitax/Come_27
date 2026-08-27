import { NextRequest } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { adminApi, audit } from '@/lib/api-guard';

const STATUSES = ['new', 'acknowledged', 'under-review', 'assigned', 'responded', 'resolved', 'archived'] as const;

const respondSchema = z.object({
  response: z.string().max(5000).default(''),
  assignedTo: z.string().max(120).default(''),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  internalNotes: z.string().max(5000).default(''),
  status: z.enum(STATUSES).optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await (await import('@/lib/auth-admin')).getSessionUser();
  if (!user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
  const d = respondSchema.parse(await req.json());
  const s = await prisma.communitySubmission.findUnique({ where: { id } });
  if (!s) return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
  const status = d.status ?? (d.response && s.status !== 'responded' ? 'responded' : s.status === 'new' ? 'acknowledged' : s.status);
  const data: Record<string, unknown> = { status };
  if (status === 'resolved') data.resolvedAt = new Date();
  await prisma.communitySubmission.update({
    where: { id },
    data: { ...data, response: d.response, assignedTo: d.assignedTo || null, priority: d.priority, internalNotes: d.internalNotes },
  });
  await audit({ user, action: d.response ? 'update' : 'assign', entity: 'submission', entityId: id, newValues: { status, priority: d.priority } });
  revalidatePath('/admin/engagement');
  return NextResponse.json({ ok: true });
}
