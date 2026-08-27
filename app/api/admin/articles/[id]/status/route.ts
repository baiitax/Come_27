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
  const { status } = (await req.json().catch(() => ({}))) as { status?: string };
  if (!['draft', 'review', 'scheduled', 'published', 'archived'].includes(status ?? '')) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  }
  if (status === 'published' && !hasPermission(user.role, 'content.publish')) {
    return NextResponse.json({ error: 'You do not have permission to publish.' }, { status: 403 });
  }
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
  await prisma.article.update({
    where: { id },
    data: { status, publishedAt: status === 'published' ? article.publishedAt ?? new Date() : article.publishedAt },
  });
  await audit({ user, action: status === 'published' ? 'publish' : status === 'archived' ? 'archive' : 'update', entity: 'article', entityId: id, oldValues: { status: article.status }, newValues: { status } });
  revalidatePath('/admin/content/news');
  revalidatePath('/news');
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
