import { redirect } from 'next/navigation';
import { getSessionUser, requirePerm } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Field, Badge } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';
import { AdminForm, In, Ta, Sel } from '@/components/admin/form';
import { EvidenceTray } from '../../evidence-tray';

export const dynamic = 'force-dynamic';

export default async function ClaimFormPage({ params }: { params: Promise<{ id?: string }> }) {
  const p = await params;
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  requirePerm(user, 'facts.view');
  const [claim, sources] = await Promise.all([
    p.id ? prisma.claim.findUnique({ where: { id: p.id }, include: { evidences: true, source: true } }) : null,
    prisma.source.findMany({ orderBy: { title: 'asc' } }),
  ]);
  if (p.id && !claim) redirect('/admin/facts/claims');

  return (
    <div>
      <PageHeader
        crumb="Verification / Claims"
        title={claim ? claim.statement.slice(0, 80) : 'New Claim'}
        right={claim ? <Badge tone={statusTone(claim.status)}>{claim.status}</Badge> : undefined}
        sub="The evidence trail is public-facing: what is linked here is what the public sees behind a claim."
      />
      <AdminForm endpoint="/api/admin/claims" successUrl="/admin/facts/claims" saveLabel="Save Claim">
        {claim && <input type="hidden" name="id" value={claim.id} />}
        <Card>
          <CardHead title="Claim" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="Claim statement" required className="md:col-span-2"><Ta name="statement" value={claim?.statement ?? ''} /></Field>
            <Field label="Context" className="md:col-span-2"><Ta name="context" value={claim?.context ?? ''} /></Field>
            <Field label="Category"><In name="category" value={claim?.category ?? 'general'} /></Field>
            <Field label="Submitted by"><In name="submittedBy" value={claim?.submittedBy ?? ''} /></Field>
            <Field label="Linked source">
              <Sel name="sourceId" value={claim?.sourceId ?? ''}>
                <option value="">— none —</option>
                {sources.map((s) => <option key={s.id} value={s.id}>{s.title} ({s.reliability})</option>)}
              </Sel>
            </Field>
            <Field label="Verdict" hint="only Fact Checkers / Reviewers can change">
              <Sel name="status" value={claim?.status ?? 'under-review'}>
                {['under-review', 'verified', 'mostly-verified', 'unverified', 'misleading', 'false', 'insufficient'].map((s) => <option key={s} value={s}>{s}</option>)}
              </Sel>
            </Field>
            <Field label="Verdict notes" className="md:col-span-2"><Ta name="verdictNotes" value={claim?.verdictNotes ?? ''} /></Field>
          </div>
        </Card>

        {claim && (
          <Card>
            <CardHead title="Evidence Trail" sub="Documents, URLs, official records, statements and archived references." />
            <EvidenceTray
              claimId={claim.id}
              evidence={claim.evidences.map((e) => ({ id: e.id, type: e.type, title: e.title, notes: e.notes }))}
              sources={sources.map((s) => ({ id: s.id, title: s.title }))}
              canEdit
            />
          </Card>
        )}
      </AdminForm>
    </div>
  );
}
