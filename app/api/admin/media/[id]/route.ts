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
  if (!hasPermission(user.role, 'media.manage')) return NextResponse.json({ error: 'You do not have permission to manage media.' }, { status: 403 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  await prisma.mediaAsset.update({
    where: { id },
    data: {
      altText: String(b.altText ?? '').slice(0, 300),
      copyright: String(b.copyright ?? '').slice(0, 300),
      source: String(b.source ?? '').slice(0, 300),
      tagsJson: JSON.stringify(String(b.tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean)),
      albumId: (b.albumId as string) || null,
    },
  });
  await audit({ user, action: 'update', entity: 'media', entityId: id });
  revalidatePath('/admin/media');
  return NextResponse.json({ ok: true });
}
