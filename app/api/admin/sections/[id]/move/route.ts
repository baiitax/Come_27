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
  const { dir } = (await req.json().catch(() => ({}))) as { dir?: string };
  const sections = await prisma.pageSection.findMany({ orderBy: { sort: 'asc' } });
  const i = sections.findIndex((s) => s.id === id);
  const j = dir === 'up' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= sections.length) return NextResponse.json({ error: 'Cannot move.' }, { status: 400 });
  const a = sections[i], b = sections[j];
  await prisma.$transaction([
    prisma.pageSection.update({ where: { id: a.id }, data: { sort: b.sort } }),
    prisma.pageSection.update({ where: { id: b.id }, data: { sort: a.sort } }),
  ]);
  await audit({ user, action: 'update', entity: 'section', entityId: id, newValues: { moved: dir } });
  revalidatePath('/');
  revalidatePath('/admin/content');
  return NextResponse.json({ ok: true });
}
