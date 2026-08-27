import { redirect } from 'next/navigation';
import { getSessionUser, requirePerm } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Field } from '@/components/admin/ui';
import { AdminForm, In, Ta, Sel, Chk } from '@/components/admin/form';
import { saveTimelineEntry } from '@admin/actions/content';

export const dynamic = 'force-dynamic';

export default async function TimelineFormPage({ params }: { params: Promise<{ id?: string }> }) {
  const p = await params;
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  requirePerm(user, 'content.edit');
  const entry = p.id ? await prisma.timelineEntry.findUnique({ where: { id: p.id } }) : null;
  if (p.id && !entry) redirect('/admin/timeline');

  return (
    <div>
      <PageHeader crumb="Content / Timeline" title={entry ? entry.title : 'New Timeline Entry'} sub="Milestones of the public journey. Evidence level must never be overstated." />
      <AdminForm action={saveTimelineEntry} saveLabel="Save Entry">
        {entry && <input type="hidden" name="id" value={entry.id} />}
        <Card>
          <CardHead title="Entry" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="Year" required><In name="year" value={entry?.year ?? ''} placeholder="2011–2015" /></Field>
            <Field label="Date (optional)"><In name="date" value={entry?.date ?? ''} /></Field>
            <Field label="Title" required className="md:col-span-2"><In name="title" value={entry?.title ?? ''} /></Field>
            <Field label="Category">
              <Sel name="category" value={entry?.category ?? 'public-service'}>
                {['education', 'grassroots', 'public-service', 'federal', 'state-government', 'candidacy'].map((c) => <option key={c} value={c}>{c}</option>)}
              </Sel>
            </Field>
            <Field label="Institution"><In name="institution" value={entry?.institution ?? ''} /></Field>
            <Field label="Location"><In name="location" value={entry?.location ?? ''} /></Field>
            <Field label="Evidence level">
              <Sel name="evidenceLevel" value={entry?.evidenceLevel ?? 'official-record'}>
                {['verified', 'official-record', 'reported', 'campaign-claim'].map((c) => <option key={c} value={c}>{c}</option>)}
              </Sel>
            </Field>
            <Field label="Source (if any)"><In name="source" value={entry?.source ?? ''} /></Field>
            <Field label="Sort order"><In name="sort" value={String(entry?.sort ?? 0)} /></Field>
            <Field label="Description" className="md:col-span-2"><Ta name="description" value={entry?.description ?? ''} /></Field>
            <Field label="Impact" className="md:col-span-2"><Ta name="impact" value={entry?.impact ?? ''} /></Field>
            <div className="flex gap-6 md:col-span-2">
              <Chk name="published" checked={entry ? entry.published : true} label="Published on public site" />
              <Chk name="featured" checked={entry?.featured ?? false} label="Featured" />
            </div>
          </div>
        </Card>
      </AdminForm>
    </div>
  );
}
