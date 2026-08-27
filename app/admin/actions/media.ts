'use server';

import { revalidatePath } from 'next/cache';
import { randomBytes } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/db';
import { requireAuth, requirePerm } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';

const MAX_BYTES = 15 * 1024 * 1024; // 15MB

const KIND_BY_EXT: Record<string, { kind: string; mime: string; ok: boolean }> = {
  jpg: { kind: 'image', mime: 'image/jpeg', ok: true },
  jpeg: { kind: 'image', mime: 'image/jpeg', ok: true },
  png: { kind: 'image', mime: 'image/png', ok: true },
  webp: { kind: 'image', mime: 'image/webp', ok: true },
  gif: { kind: 'image', mime: 'image/gif', ok: true },
  svg: { kind: 'image', mime: 'image/svg+xml', ok: false }, // rejected: scriptable
  mp4: { kind: 'video', mime: 'video/mp4', ok: true },
  webm: { kind: 'video', mime: 'video/webm', ok: true },
  mp3: { kind: 'audio', mime: 'audio/mpeg', ok: true },
  pdf: { kind: 'pdf', mime: 'application/pdf', ok: true },
  doc: { kind: 'document', mime: 'application/msword', ok: true },
  docx: { kind: 'document', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ok: true },
};

export async function uploadMedia(prev: unknown, formData: FormData) {
  const user = await requirePerm(await requireAuth(), 'media.upload');
  const file = formData.get('file') as File | null;
  if (!file) return { ok: false, error: 'No file selected.' };
  if (file.size > MAX_BYTES) return { ok: false, error: 'File exceeds 15MB limit.' };

  const ext = (file.name.split('.').pop() ?? '').toLowerCase();
  const meta = KIND_BY_EXT[ext];
  if (!meta || !meta.ok) return { ok: false, error: `File type ".${ext}" is not allowed.` };

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const filename = `${Date.now()}-${randomBytes(4).toString('hex')}-${safeName}`;
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  // basic content sniff for images
  if (meta.kind === 'image' && (ext === 'jpg' || ext === 'jpeg')) {
    if (!(buf[0] === 0xff && buf[1] === 0xd8)) return { ok: false, error: 'File content does not match a JPEG image.' };
  }
  await fs.writeFile(path.join(dir, filename), buf);

  const asset = await prisma.mediaAsset.create({
    data: {
      filename: file.name,
      path: `/uploads/${filename}`,
      kind: meta.kind,
      size: file.size,
      mimeType: meta.mime,
      albumId: (formData.get('albumId') as string) || null,
      isDemo: false,
    },
  });
  await audit({ user, action: 'create', entity: 'media', entityId: asset.id, newValues: { filename: file.name, kind: meta.kind, size: file.size } });
  revalidatePath('/admin/media');
  return { ok: true, id: asset.id, path: asset.path };
}

const assetMetaSchema = {
  altText: (v: unknown) => String(v ?? '').slice(0, 300),
  copyright: (v: unknown) => String(v ?? '').slice(0, 300),
  source: (v: unknown) => String(v ?? '').slice(0, 300),
  tags: (v: unknown) => JSON.stringify(String(v ?? '').split(',').map((t) => t.trim()).filter(Boolean)),
};

export async function updateAssetMeta(prev: unknown, formData: FormData) {
  const user = await requirePerm(await requireAuth(), 'media.manage');
  const id = String(formData.get('id') ?? '');
  await prisma.mediaAsset.update({
    where: { id },
    data: {
      altText: assetMetaSchema.altText(formData.get('altText')),
      copyright: assetMetaSchema.copyright(formData.get('copyright')),
      source: assetMetaSchema.source(formData.get('source')),
      tagsJson: assetMetaSchema.tags(formData.get('tags')),
      albumId: (formData.get('albumId') as string) || null,
    },
  });
  await audit({ user, action: 'update', entity: 'media', entityId: id });
  revalidatePath('/admin/media');
  return { ok: true };
}

export async function deleteAsset(id: string) {
  const user = await requirePerm(await requireAuth(), 'media.manage');
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return { ok: false };
  try {
    await fs.unlink(path.join(process.cwd(), 'public', asset.path.replace(/^\/uploads\//, 'uploads/')));
  } catch {
    /* file may already be gone */
  }
  await prisma.mediaAsset.delete({ where: { id } });
  await audit({ user, action: 'delete', entity: 'media', entityId: id, oldValues: { filename: asset.filename } });
  revalidatePath('/admin/media');
  return { ok: true };
}

export async function saveAlbum(prev: unknown, formData: FormData) {
  const user = await requirePerm(await requireAuth(), 'media.manage');
  const name = String(formData.get('name') ?? '').trim().slice(0, 120);
  const description = String(formData.get('description') ?? '').trim().slice(0, 500);
  if (name.length < 2) return { ok: false, error: 'Album name is too short.' };
  const c = await prisma.mediaAlbum.create({ data: { name, description } });
  await audit({ user, action: 'create', entity: 'album', entityId: c.id, newValues: { name } });
  revalidatePath('/admin/media');
  return { ok: true, id: c.id };
}
