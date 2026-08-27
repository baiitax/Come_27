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
  if (!hasPermission(user.role, 'navigation.manage')) return NextResponse.json({ error: 'You do not have permission to manage navigation.' }, { status: 403 });
  await prisma.navigationItem.delete({ where: { id } });
  await audit({ user, action: 'delete', entity: 'navigation', entityId: id });
  revalidatePath('/');
  revalidatePath('/admin/content');
  return NextResponse.json({ ok: true });
}
