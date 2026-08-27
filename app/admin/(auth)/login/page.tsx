import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth-admin';
import { LoginForm } from './login-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Sign in — Gwarzo 2027 CMS', robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; reason?: string; reset?: string }> }) {
  const sp = await searchParams;
  const user = await getSessionUser();
  if (user) redirect(sp.next && sp.next.startsWith('/admin') ? sp.next : '/admin/dashboard');

  return <LoginForm reason={sp.reason} resetDone={sp.reset === 'success'} next={sp.next} />;
}
