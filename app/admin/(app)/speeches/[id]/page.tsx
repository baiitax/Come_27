import { redirect } from 'next/navigation';
import { getSessionUser, requirePerm } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Field } from '@/components/admin/ui';
import { AdminForm, In, Ta, Sel } from '@/components/admin/form';

export const dynamic = 'force-dynamic';

export default async function SpeechFormPage({ params }: { params: Promise<{ id?: string }> }) {
  const p = await params;
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  requirePerm(user, 'content.edit');
  const speech = p.id ? await prisma.speech.findUnique({ where: { id: p.id } }) : null;
  if (p.id && !speech) redirect('/admin/speeches');

  return (
    <div>
      <PageHeader crumb="Content / Speeches" title={speech ? speech.title : 'New Speech'} sub="Transcripts are public record — keep them verbatim." />
      <AdminForm action={saveSpeech} saveLabel="Save Speech">
        {speech && <input type="hidden" name="id" value={speech.id} />}
        <Card>
          <CardHead title="Speech" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="Title" required className="md:col-span-2">
              <In name="title" value={speech?.title ?? ''} placeholder="e.g. Education reform position statement" />
            </Field>
            <Field label="Event"><In name="eventName" value={speech?.eventName ?? ''} /></Field>
            <Field label="Event date"><In name="eventDate" value={speech?.eventDate ?? ''} placeholder="05 Jul 2024" /></Field>
            <Field label="Venue"><In name="venue" value={speech?.venue ?? ''} /></Field>
            <Field label="Location"><In name="location" value={speech?.location ?? ''} /></Field>
            <Field label="Video URL" hint="YouTube / Vimeo / MP4"><In name="videoUrl" value={speech?.videoUrl ?? ''} placeholder="https://" /></Field>
            <Field label="Audio URL"><In name="audioUrl" value={speech?.audioUrl ?? ''} placeholder="https://" /></Field>
            <Field label="Summary" className="md:col-span-2"><Ta name="summary" value={speech?.summary ?? ''} /></Field>
            <Field label="Full transcript" className="md:col-span-2"><Ta name="transcript" className="min-h-[260px]" value={speech?.transcript ?? ''} /></Field>
            <Field label="Key themes" hint="comma separated"><In name="themes" value={speech ? JSON.parse(speech.themesJson || '[]').join(', ') : ''} /></Field>
            <Field label="Status">
              <Sel name="status" value={speech?.status ?? 'draft'}>
                {['draft', 'review', 'published', 'archived'].map((s) => <option key={s} value={s}>{s}</option>)}
              </Sel>
            </Field>
          </div>
        </Card>
      </AdminForm>
    </div>
  );
}
