'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authenticate, setSessionCookie, clearSessionCookie, audit, getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Email and password are required.' };

  const h = await import('next/headers').then((m) => m.headers());
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim();

  const result = await authenticate(email, password, ip);
  if (!result.ok) return { error: result.error };

  await setSessionCookie(result.user);
  revalidatePath('/admin', 'layout');
  redirect('/admin/dashboard');
}

export async function logoutAction() {
  const user = await getSessionUser();
  if (user) {
    await prisma.auditLog.create({
      data: { userId: user.id, userName: user.email, action: 'logout', entity: 'user', entityId: user.id },
    });
  }
  await clearSessionCookie();
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}
