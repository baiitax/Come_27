import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
  await prisma.notification.updateMany({ where: { userId: user.id, readAt: null }, data: { readAt: new Date() } });
  revalidatePath('/admin', 'layout');
  return NextResponse.json({ ok: true });
}
