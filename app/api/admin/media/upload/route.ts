import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';
import { hasPermission } from '@/lib/permissions';

const MAX_BYTES = 15 * 1024 * 1024;
const KIND_BY_EXT: Record<string, { kind: string; mime: string; ok: boolean }> = {
  jpg: { kind: 'image', mime: 'image/jpeg', ok: true },
  jpeg: { kind: 'image', mime: 'image/jpeg', ok: true },
  png: { kind: 'image', mime: 'image/png', ok: true },
  webp: { kind: 'image', mime: 'image/webp', ok: true },
  gif: { kind: 'image', mime: 'image/gif', ok: true },
  svg: { kind: 'image', mime: 'image/svg+xml', ok: false },
  mp4: { kind: 'video', mime: 'video/mp4', ok: true },
  webm: { kind: 'video', mime: 'video/webm', ok: true },
  mp3: { kind: 'audio', mime: 'audio/mpeg', ok: true },
  pdf: { kind: 'pdf', mime: 'application/pdf', ok: true },
  doc: { kind: 'document', mime: 'application/msword', ok: true },
  docx: { kind: 'document', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ok: true },
};

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
  if (!hasPermission(user.role, 'media.upload')) return NextResponse.json({ error: 'You do not have permission to upload media.' }, { status: 403 });

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || !(file instanceof File)) return NextResponse.json({ error: 'No file selected.' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File exceeds 15MB limit.' }, { status: 400 });

  const ext = (file.name.split('.').pop() ?? '').toLowerCase();
  const meta = KIND_BY_EXT[ext];
  if (!meta || !meta.ok) return NextResponse.json({ error: `File type ".${ext}" is not allowed.` }, { status: 400 });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const filename = `${Date.now()}-${randomBytes(4).toString('hex')}-${safeName}`;
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  if (meta.kind === 'image' && (ext === 'jpg' || ext === 'jpeg') && !(buf[0] === 0xff && buf[1] === 0xd8)) {
    return NextResponse.json({ error: 'File content does not match a JPEG image.' }, { status: 400 });
  }
  await fs.writeFile(path.join(dir, filename), buf);

  const asset = await prisma.mediaAsset.create({
    data: {
      filename: file.name, path: `/uploads/${filename}`, kind: meta.kind, size: file.size,
      mimeType: meta.mime, albumId: (String(form?.get('albumId') ?? '') || null) as string | null, isDemo: false,
    },
  });
  await audit({ user, action: 'create', entity: 'media', entityId: asset.id, newValues: { filename: file.name, kind: meta.kind, size: file.size } });
  revalidatePath('/admin/media');
  return NextResponse.json({ ok: true, id: asset.id, path: asset.path });
}
