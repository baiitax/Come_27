import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth-admin';
import { ROLES } from '@/lib/permissions';
import { PageHeader, Card, CardHead, Field } from '@/components/admin/ui';
import { AdminForm, In, Sel } from '@/components/admin/form';
import { saveUser } from '@admin/actions/system';

export const dynamic = 'force-dynamic';

export default async function UserFormPage() {
  const me = await getSessionUser();
  if (!me) redirect('/admin/login');
  if (me.role !== 'super_admin') redirect('/admin/users');

  return (
    <div>
      <PageHeader crumb="System / Users" title="New User" sub="Minimum 10-character password. Least privilege: assign the narrowest role that fits." />
      <AdminForm action={saveUser} saveLabel="Create User">
        <Card>
          <CardHead title="User" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="Full name" required><In name="name" /></Field>
            <Field label="Email" required><In name="email" type="email" /></Field>
            <Field label="Password" required hint="min 10 characters"><In name="password" type="password" /></Field>
            <Field label="Role">
              <Sel name="role">
                {ROLES.map((r) => <option key={r.name} value={r.name}>{r.label}</option>)}
              </Sel>
            </Field>
          </div>
        </Card>
      </AdminForm>
    </div>
  );
}
