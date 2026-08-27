import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await getSessionUser();
  if (!actor || actor.role !== 'super_admin') return NextResponse.json({ error: 'Only super administrators can manage users.' }, { status: 403 });
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  await prisma.user.update({ where: { id }, data: { isActive: !u.isActive } });
  await audit({ user: actor, action: 'update', entity: 'user', entityId: id, newValues: { isActive: !u.isActive } });
  revalidatePath('/admin/users');
  return NextResponse.json({ ok: true });
}
