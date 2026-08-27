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
  if (!hasPermission(user.role, 'content.delete')) return NextResponse.json({ error: 'You do not have permission to delete.' }, { status: 403 });
  await prisma.timelineEntry.update({ where: { id }, data: { deletedAt: new Date() } });
  await audit({ user, action: 'delete', entity: 'timeline', entityId: id });
  revalidatePath('/admin/timeline');
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
