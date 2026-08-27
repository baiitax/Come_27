import { NextResponse } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';
import { hasPermission } from '@/lib/permissions';

const schema = z.object({
  id: z.string().optional(),
  label: z.string().min(1).max(40),
  href: z.string().min(1).max(200),
  sort: z.string().default('0'),
  enabled: z.boolean().default(true),
});

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
  if (!hasPermission(user.role, 'navigation.manage')) return NextResponse.json({ error: 'You do not have permission to manage navigation.' }, { status: 403 });
  const d = schema.safeParse(await req.json().catch(() => ({})));
  if (!d.success) return NextResponse.json({ error: d.error.issues[0].message }, { status: 400 });
  const data = { label: d.data.label, href: d.data.href, sort: parseInt(d.data.sort, 10) || 0, enabled: d.data.enabled };
  let id: string;
  if (d.data.id) {
    await prisma.navigationItem.update({ where: { id: d.data.id }, data });
    id = d.data.id;
  } else {
    const c = await prisma.navigationItem.create({ data });
    id = c.id;
  }
  await audit({ user, action: d.data.id ? 'update' : 'create', entity: 'navigation', entityId: id, newValues: { label: d.data.label, href: d.data.href } });
  revalidatePath('/');
  revalidatePath('/admin/content');
  return NextResponse.json({ ok: true, id });
}
