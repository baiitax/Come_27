import { redirect } from 'next/navigation';
import { getSessionUser, requirePerm } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Field } from '@/components/admin/ui';
import { AdminForm, In, Ta, Sel, Chk } from '@/components/admin/form';

export const dynamic = 'force-dynamic';

export default async function PolicyFormPage({ params }: { params: Promise<{ id?: string }> }) {
  const p = await params;
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  requirePerm(user, 'content.edit');
  const sector = p.id ? await prisma.policySector.findUnique({ where: { id: p.id }, include: { initiatives: { orderBy: { sort: 'asc' } } } }) : null;
  if (p.id && !sector) redirect('/admin/policies');

  return (
    <div>
      <PageHeader crumb="Content / Vision" title={sector ? sector.name : 'New Policy Sector'} sub="Objectives and initiatives: one per line." />
      <AdminForm action={saveSector} saveLabel="Save Sector">
        {sector && <input type="hidden" name="id" value={sector.id} />}
        <Card>
          <CardHead title="Sector" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="Name" required><In name="name" value={sector?.name ?? ''} placeholder="Education" /></Field>
            <Field label="Icon" hint="single word key"><In name="icon" value={sector?.icon ?? 'target'} /></Field>
            <Field label="Problem statement" className="md:col-span-2"><Ta name="problemStatement" value={sector?.problemStatement ?? ''} /></Field>
            <Field label="Current context" className="md:col-span-2"><Ta name="currentContext" value={sector?.currentContext ?? ''} /></Field>
            <Field label="Proposed approach" className="md:col-span-2"><Ta name="approach" value={sector?.approach ?? ''} /></Field>
            <Field label="Objectives (one per line)" className="md:col-span-2"><Ta name="objectives" value={sector ? JSON.parse(sector.objectivesJson || '[]').join('\n') : ''} /></Field>
            <Field label="Key initiatives (one per line)" className="md:col-span-2"><Ta name="initiatives" value={sector ? sector.initiatives.map((i) => i.title).join('\n') : ''} /></Field>
            <Field label="Supporting research (one per line)" className="md:col-span-2"><Ta name="research" value={sector ? JSON.parse(sector.researchJson || '[]').join('\n') : ''} /></Field>
            <div className="md:col-span-2"><Chk name="published" checked={sector ? sector.published : true} label="Published on public site" /></div>
          </div>
        </Card>
      </AdminForm>
    </div>
  );
}
