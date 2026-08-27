import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';
import { audit } from '@/lib/audit';
import { hasPermission } from '@/lib/permissions';

const SETTING_KEYS = [
  'brand.campaignName', 'brand.tagline', 'brand.primaryColor', 'brand.accentColor',
  'contact.email', 'contact.phone', 'contact.address', 'contact.x', 'contact.facebook', 'contact.instagram',
  'site.title', 'site.description', 'site.analyticsId',
  'footer.copyright', 'footer.disclaimer',
];

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
  if (!hasPermission(user.role, 'settings.manage')) return NextResponse.json({ error: 'You do not have permission to manage settings.' }, { status: 403 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const keys: string[] = [];
  for (const [key, value] of Object.entries(body)) {
    if (!SETTING_KEYS.includes(key)) continue; // strict allowlist
    const v = String(value).slice(0, 1000);
    await prisma.siteSetting.upsert({ where: { key }, update: { value: v }, create: { key, value: v } });
    keys.push(key);
  }
  await audit({ user, action: 'update', entity: 'settings', newValues: { keys } });
  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');
  return { ok: true, keys };
}
