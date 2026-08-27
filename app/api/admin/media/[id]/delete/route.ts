import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';
import { hasPermission } from '@/lib/permissions';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
  if (!hasPermission(user.role, 'media.manage')) return NextResponse.json({ error: 'You do not have permission to delete media.' }, { status: 403 });
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ error: 'Asset not found.' }, { status: 404 });
  try {
    await fs.unlink(path.join(process.cwd(), 'public', asset.path.replace(/^\/uploads\//, 'uploads/')));
  } catch { /* file may already be gone */ }
  await prisma.mediaAsset.delete({ where: { id } });
  await audit({ user, action: 'delete', entity: 'media', entityId: id, oldValues: { filename: asset.filename } });
  revalidatePath('/admin/media');
  return NextResponse.json({ ok: true });
}
