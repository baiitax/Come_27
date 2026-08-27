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
  if (!hasPermission(user.role, 'content.delete')) {
    return NextResponse.json({ error: 'You do not have permission to delete content.' }, { status: 403 });
  }
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
  // soft delete — public record content is archived, never erased by default
  await prisma.article.update({ where: { id }, data: { deletedAt: new Date(), status: 'archived' } });
  await audit({ user, action: 'delete', entity: 'article', entityId: id, oldValues: { title: article.title } });
  revalidatePath('/admin/content/news');
  revalidatePath('/news');
  return NextResponse.json({ ok: true });
}
