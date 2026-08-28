import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';
import { hasPermission } from '@/lib/permissions';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
  if (!hasPermission(user.role, 'engagement.respond')) {
    return NextResponse.json({ error: 'You do not have permission to manage the chat inbox.' }, { status: 403 });
  }

  const d = z
    .object({
      response: z.string().trim().max(4000).optional().or(z.literal('')),
      status: z.enum(['opened', 'responded', 'resolved']).optional(),
    })
    .safeParse(await req.json().catch(() => ({})));
  if (!d.success) return NextResponse.json({ error: d.error.issues[0].message }, { status: 400 });

  const existing = await prisma.chatMessage.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Message not found.' }, { status: 404 });

  const data: { response?: string; respondedBy?: string; respondedAt?: Date; status?: string } = {};
  if (d.data.response) {
    data.response = d.data.response;
    data.respondedBy = `${user.name} (${user.email})`;
    data.respondedAt = new Date();
    data.status = 'responded';
  } else if (d.data.status) {
    data.status = d.data.status;
  }

  await prisma.chatMessage.update({ where: { id }, data });
  await audit({ user, action: 'update', entity: 'chat_message', entityId: id, newValues: data });
  revalidatePath('/admin/engagement/chat');
  return NextResponse.json({ ok: true });
}
