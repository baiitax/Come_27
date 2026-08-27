import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
  await prisma.alert.update({ where: { id }, data: { resolvedAt: new Date() } });
  await audit({ user, action: 'update', entity: 'alert', entityId: id, newValues: { resolved: true } });
  revalidatePath('/admin/intelligence');
  revalidatePath('/admin/dashboard');
  return NextResponse.json({ ok: true });
}
