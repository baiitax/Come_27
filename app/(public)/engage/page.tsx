import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';
import { SectionHead } from '@/components/public/section-head';
import { SubmissionWizard } from '@/components/public/submission-wizard';
import { PriorityDashboard } from '@/components/public/priority-dashboard';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Engage',
  description: 'Your voice matters. Ask a question, raise a community priority, share an idea, or flag a claim for review.',
};

export default async function EngagePage() {
  const lgas = await safeDb(
    () => prisma.lga.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    [],
    'engage'
  );

  return (
    <div className="pt-32 md:pt-40">
      <section className="mx-auto max-w-7xl px-6">
        <SectionHead
          eyebrow="Engage"
          title={<>Your voice <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">matters.</span></>}
          sub="Ask a question. Raise a community priority. Share an idea. Flag a claim for review."
        />
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-8 px-6 pb-8 lg:grid-cols-5">
        <div className="lg:col-span-3" data-reveal="left">
          <SubmissionWizard lgas={lgas} />
        </div>
        <div className="space-y-6 lg:col-span-2" data-reveal="right" data-delay="150">
          <PriorityDashboard />
          <div className="glass-card !p-6">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Privacy-first</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted-text)]">
              <li className="flex gap-2.5"><span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#12B76A]" />Your identity is never displayed publicly.</li>
              <li className="flex gap-2.5"><span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#12B76A]" />Aggregate submissions are used to understand community priorities and improve public dialogue.</li>
              <li className="flex gap-2.5"><span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#12B76A]" />We collect only the information necessary — no profiling, no targeting.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
