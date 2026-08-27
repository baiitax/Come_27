import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth-admin';
import { LoginForm } from './login-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin Login', robots: { index: false, follow: false } };

export default async function LoginPage({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (user) redirect('/admin/dashboard');
  return <LoginForm />;
}
