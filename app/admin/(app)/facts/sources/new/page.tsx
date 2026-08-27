import { redirect } from 'next/navigation';
import { getSessionUser, requirePerm } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Field } from '@/components/admin/ui';
import { AdminForm, In, Ta, Sel } from '@/components/admin/form';

export const dynamic = 'force-dynamic';

export default async function SourceFormPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  requirePerm(user, 'facts.edit');

  return (
    <div>
      <PageHeader crumb="Verification / Sources" title="New Source" sub="Sources are reusable across multiple claims and records." />
      <AdminForm endpoint="/api/admin/sources" successUrl="/admin/facts/sources" saveLabel="Save Source">
        <Card>
          <CardHead title="Source" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="Title" required className="md:col-span-2"><In name="title" /></Field>
            <Field label="Publisher"><In name="publisher" /></Field>
            <Field label="Type">
              <Sel name="type">
                {['government', 'official-record', 'court', 'election-body', 'academic', 'media', 'campaign', 'public-statement', 'research', 'other'].map((t) => <option key={t} value={t}>{t}</option>)}
              </Sel>
            </Field>
            <Field label="URL"><In name="url" placeholder="https://" /></Field>
            <Field label="Publication date"><In name="publishedAt" type="date" /></Field>
            <Field label="Author"><In name="author" /></Field>
            <Field label="Reliability classification">
              <Sel name="reliability">
                {['official', 'high', 'medium', 'low', 'unverified'].map((r) => <option key={r} value={r}>{r}</option>)}
              </Sel>
            </Field>
            <Field label="Notes" className="md:col-span-2"><Ta name="notes" /></Field>
          </div>
        </Card>
      </AdminForm>
    </div>
  );
}
