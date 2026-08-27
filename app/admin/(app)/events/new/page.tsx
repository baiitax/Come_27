import { redirect } from 'next/navigation';
import { getSessionUser, requirePerm } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Field } from '@/components/admin/ui';
import { AdminForm, In, Ta, Sel } from '@/components/admin/form';

export const dynamic = 'force-dynamic';

function toLocalInput(d: Date | null) {
  if (!d) return '';
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default async function EventFormPage({ params }: { params: Promise<{ id?: string }> }) {
  const p = await params;
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  requirePerm(user, 'content.edit');
  const [event, lgas] = await Promise.all([
    p.id ? prisma.campaignEvent.findUnique({ where: { id: p.id } }) : null,
    prisma.lga.findMany({ orderBy: { name: 'asc' } }),
  ]);
  if (p.id && !event) redirect('/admin/events');

  return (
    <div>
      <PageHeader crumb="Content / Events" title={event ? event.name : 'New Event'} sub="Events feed the public calendar, LGA engagement metrics and intelligence alerts." />
      <AdminForm action={saveEvent} saveLabel="Save Event">
        {event && <input type="hidden" name="id" value={event.id} />}
        <Card>
          <CardHead title="Event" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="Name" required className="md:col-span-2"><In name="name" value={event?.name ?? ''} /></Field>
            <Field label="Description" className="md:col-span-2"><Ta name="description" value={event?.description ?? ''} /></Field>
            <Field label="Starts at" required><In name="startsAt" type="datetime-local" value={toLocalInput(event?.startsAt ?? null)} /></Field>
            <Field label="Ends at"><In name="endsAt" type="datetime-local" value={toLocalInput(event?.endsAt ?? null)} /></Field>
            <Field label="Venue"><In name="venue" value={event?.venue ?? ''} /></Field>
            <Field label="Address"><In name="address" value={event?.address ?? ''} /></Field>
            <Field label="LGA">
              <Sel name="lgaId" value={event?.lgaId ?? ''}>
                <option value="">— select —</option>
                {lgas.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </Sel>
            </Field>
            <Field label="Category">
              <Sel name="category" value={event?.category ?? 'rally'}>
                {['rally', 'townhall', 'media', 'community', 'official'].map((c) => <option key={c} value={c}>{c}</option>)}
              </Sel>
            </Field>
            <Field label="Organizer"><In name="organizer" value={event?.organizer ?? ''} /></Field>
            <Field label="Registration URL"><In name="registrationUrl" value={event?.registrationUrl ?? ''} placeholder="https://" /></Field>
            <Field label="Status">
              <Sel name="status" value={event?.status ?? 'draft'}>
                {['draft', 'upcoming', 'live', 'completed', 'cancelled', 'archived'].map((s) => <option key={s} value={s}>{s}</option>)}
              </Sel>
            </Field>
          </div>
        </Card>
      </AdminForm>
    </div>
  );
}
