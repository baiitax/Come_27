import { redirect } from 'next/navigation';
import { getSessionUser, requirePerm } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Field } from '@/components/admin/ui';
import { AdminForm, In, Ta, Sel } from '@/components/admin/form';
import { saveLga } from '@admin/actions/engagement';

export const dynamic = 'force-dynamic';

export default async function LgaFormPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  requirePerm(user, 'content.edit');

  return (
    <div>
      <PageHeader crumb="Engagement / LGAs" title="Add LGA" sub="All 44 Kano LGAs are pre-seeded. Use this to correct names or set development priorities." />
      <AdminForm action={saveLga} saveLabel="Save LGA">
        <Card>
          <CardHead title="LGA" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="Name" required><In name="name" placeholder="e.g. Fagge" /></Field>
            <Field label="Senatorial district"><Sel name="senatorialDistrict"><option value="">—</option>{['Metropolitan', 'Central', 'East', 'West'].map((d) => <option key={d} value={d}>{d}</option>)}</Sel></Field>
            <Field label="Development priorities (one per line)" className="md:col-span-2"><Ta name="priorities" /></Field>
          </div>
        </Card>
      </AdminForm>
    </div>
  );
}
