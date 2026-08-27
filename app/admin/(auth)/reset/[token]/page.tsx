import { ResetForm } from './reset-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Choose a new password — Gwarzo 2027 CMS', robots: { index: false, follow: false } };

export default function ResetPage({ params }: { params: Promise<{ token: string }> }) {
  return <ResetForm tokenPromise={params} />;
}
