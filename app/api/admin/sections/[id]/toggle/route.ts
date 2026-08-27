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
  if (!hasPermission(user.role, 'sections.manage')) return NextResponse.json({ error: 'You do not have permission to manage sections.' }, { status: 403 });
  const s = await prisma.pageSection.findUnique({ where: { id } });
  if (!s) return NextResponse.json({ error: 'Section not found.' }, { status: 404 });
  await prisma.pageSection.update({ where: { id }, data: { enabled: !s.enabled } });
  await audit({ user, action: 'update', entity: 'section', entityId: id, newValues: { enabled: !s.enabled } });
  revalidatePath('/');
  revalidatePath('/admin/content');
  return NextResponse.json({ ok: true });
}
