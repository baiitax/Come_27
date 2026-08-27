import { NextResponse } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';
import { hasPermission } from '@/lib/permissions';

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
  if (!hasPermission(user.role, 'media.manage')) return NextResponse.json({ error: 'You do not have permission to manage albums.' }, { status: 403 });
  const b = z.object({ name: z.string().min(2).max(120), description: z.string().max(500).default('') }).safeParse(await req.json().catch(() => ({})));
  if (!b.success) return NextResponse.json({ error: 'Album name is too short.' }, { status: 400 });
  const c = await prisma.mediaAlbum.create({ data: { name: b.data.name, description: b.data.description } });
  await audit({ user, action: 'create', entity: 'album', entityId: c.id, newValues: { name: c.name } });
  revalidatePath('/admin/media');
  return NextResponse.json({ ok: true, id: c.id });
}
