import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';

const ROLES = ['super_admin', 'content_admin', 'editor', 'fact_checker', 'media_manager', 'engagement_manager', 'analytics_manager', 'reviewer', 'read_only'];

export async function POST(req: Request) {
  const actor = await getSessionUser();
  if (!actor || actor.role !== 'super_admin') return NextResponse.json({ error: 'Only super administrators can manage users.' }, { status: 403 });
  const b = z.object({
    id: z.string().optional(),
    name: z.string().min(2).max(120),
    email: z.string().email().max(160),
    password: z.string().min(10).max(200).optional().or(z.literal('')),
    role: z.enum(ROLES as [string, ...string[]]),
    isActive: z.boolean().default(true),
  }).safeParse(await req.json().catch(() => ({})));
  if (!b.success) return NextResponse.json({ error: b.error.issues[0].message }, { status: 400 });
  const d = b.data;
  const email = d.email.toLowerCase();
  const dup = await prisma.user.findFirst({ where: { email, id: { not: d.id ?? '' } } });
  if (dup) return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 400 });
  let id: string;
  if (d.id) {
    const data: Record<string, unknown> = { name: d.name, email, role: d.role, isActive: d.isActive };
    if (d.password) data.passwordHash = await bcrypt.hash(d.password, 12);
    await prisma.user.update({ where: { id: d.id }, data });
    id = d.id;
    await audit({ user: actor, action: 'update', entity: 'user', entityId: id, newValues: { name: d.name, role: d.role } });
  } else {
    if (!d.password) return NextResponse.json({ error: 'Password is required for new users.' }, { status: 400 });
    const c = await prisma.user.create({ data: { name: d.name, email, role: d.role, passwordHash: await bcrypt.hash(d.password, 12) } });
    id = c.id;
    await audit({ user: actor, action: 'create', entity: 'user', entityId: id, newValues: { name: d.name, role: d.role } });
  }
  revalidatePath('/admin/users');
  return { ok: true, id };
}
