import { redirect } from 'next/navigation';
import { getSessionUser, requirePerm } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Field, Badge } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';
import { AdminForm, In, Ta, Sel, Chk } from '@/components/admin/form';

export const dynamic = 'force-dynamic';

export default async function RecordFormPage({ params }: { params: Promise<{ id?: string }> }) {
  const p = await params;
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  requirePerm(user, 'content.edit');
  const record = p.id ? await prisma.serviceRecord.findUnique({ where: { id: p.id } }) : null;
  if (p.id && !record) redirect('/admin/record');

  return (
    <div>
      <PageHeader
        crumb="Content / Record"
        title={record ? record.position : 'New Service Record'}
        right={record ? <Badge tone={statusTone(record.evidenceStatus)}>{record.evidenceStatus}</Badge> : undefined}
        sub="Evidence status is color-coded and surfaced on the public site. Never mark unverified claims as verified."
      />
      <AdminForm action={saveRecord} saveLabel="Save Record">
        {record && <input type="hidden" name="id" value={record.id} />}
        <Card>
          <CardHead title="Record" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="Position" required><In name="position" value={record?.position ?? ''} /></Field>
            <Field label="Institution" required><In name="institution" value={record?.institution ?? ''} /></Field>
            <Field label="Start" required><In name="startDate" value={record?.startDate ?? ''} placeholder="2011" /></Field>
            <Field label="End" required><In name="endDate" value={record?.endDate ?? ''} placeholder="2015 / present" /></Field>
            <Field label="Location"><In name="location" value={record?.location ?? ''} /></Field>
            <Field label="Evidence status">
              <Sel name="evidenceStatus" value={record?.evidenceStatus ?? 'under-review'}>
                {['verified', 'official-record', 'reported', 'campaign-claim', 'proposed', 'under-review', 'disputed', 'archived'].map((s) => <option key={s} value={s}>{s}</option>)}
              </Sel>
            </Field>
            <Field label="Reviewer" className="md:col-span-2"><In name="reviewer" value={record?.reviewer ?? ''} /></Field>
            <Field label="Responsibilities" className="md:col-span-2"><Ta name="responsibilities" value={record?.responsibilities ?? ''} /></Field>
            <Field label="Description" className="md:col-span-2"><Ta name="description" value={record?.description ?? ''} /></Field>
            <Field label="Impact" className="md:col-span-2"><Ta name="impact" value={record?.impact ?? ''} /></Field>
            <Field label="Achievements" className="md:col-span-2"><Ta name="achievements" value={record?.achievements ?? ''} /></Field>
            <Field label="Internal notes" className="md:col-span-2" hint="never shown publicly"><Ta name="notes" value={record?.notes ?? ''} /></Field>
            <div className="md:col-span-2"><Chk name="published" checked={record ? record.published : true} label="Published on public site" /></div>
          </div>
        </Card>
      </AdminForm>
    </div>
  );
}
