import type { ReactNode } from 'react';
import Link from 'next/link';
import { ForgotForm } from './forgot-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Reset password — Gwarzo 2027 CMS', robots: { index: false, follow: false } };

export default function ForgotPage() {
  return <ForgotForm />;
}
