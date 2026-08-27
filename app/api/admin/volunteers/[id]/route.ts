import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';
import { hasPermission } from '@/lib/permissions';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
  if (!hasPermission(user.role, 'volunteers.manage')) return NextResponse.json({ error: 'You do not have permission to manage volunteers.' }, { status: 403 });
  const { status } = (await req.json().catch(() => ({}))) as { status?: string };
  if (!['pending', 'active', 'on-leave', 'declined'].includes(status ?? '')) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  await prisma.volunteer.update({ where: { id }, data: { status: status! } });
  await audit({ user, action: 'update', entity: 'volunteer', entityId: id, newValues: { status } });
  revalidatePath('/admin/engagement/volunteers');
  return NextResponse.json({ ok: true });
}
