import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';
import { SectionHead } from '@/components/public/section-head';
import { EvidenceBadge } from '@/components/public/evidence-badge';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'The 2026 Political Transition',
  description: 'The 2026 political transition presented as documented — with explicit attribution and evidence status. Allegations are never presented as established facts.',
};

const JOURNEY_STEPS = [
  ['Grassroots', 'Youth and community leadership — the foundation of a political life built among the people.'],
  ['Kwankwasiyya Experience', 'Association with the grassroots development movement that shaped a generation of Kano leadership.'],
  ['Public Service', 'Classroom, local government, state executive and federal education governance.'],
  ['Executive Government', 'Deputy Governor of Kano State — development across all 44 LGAs.'],
  ['Political Realignment', 'The documented 2026 realignment in Kano state politics.'],
  ['NDC 2027 Candidacy', 'Emergence as the NDC Kano governorship candidate for 2027.'],
];

export default async function TransitionPage() {
  const events = await safeDb(() => prisma.transitionEvent.findMany({ orderBy: { sort: 'asc' } }), [], 'transition');

  return (
    <div className="pt-32 md:pt-40">
      <section className="mx-auto max-w-5xl px-6">
        <SectionHead
          eyebrow="Transparency"
          title="The 2026 Political Transition"
          sub="Presented as documented, with explicit attribution and evidence status for every event. Allegations are never presented as established facts."
        />
      </section>

      {/* Documentary timeline */}
      <section className="mx-auto max-w-4xl px-6 py-14">
        <ol className="relative space-y-6 border-l border-[rgba(23,32,51,0.1)] pl-8">
          {events.map((e, i) => (
            <li key={e.id} data-reveal data-delay={String((i % 3) * 80)} className="relative">
              <span aria-hidden className="absolute -left-[2.45rem] top-6 h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--brand)] shadow-[0_0_0_3px_rgba(166,27,27,0.15)]" />
              <div className="glass-card glass-panel-hover p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-display text-lg font-extrabold text-[var(--brand)]">{e.date || '2026'}</p>
                  <EvidenceBadge status={e.evidenceStatus} source={e.source} notes={e.response} />
                </div>
                <h2 className="mt-3 font-display text-xl font-bold text-[var(--white)]">{e.title}</h2>
                <p className="mt-2 max-w-[680px] text-sm leading-relaxed text-[var(--muted-text)]">{e.whatHappened}</p>
                <p className="mt-3 text-[0.7rem] text-[var(--muted-2)]">
                  Attribution: <span className="font-semibold text-[var(--muted-text)]">{e.attribution}</span>
                  {e.source && <> · Source: <span className="font-semibold text-[var(--muted-text)]">{e.source}</span></>}
                </p>
                {e.response && (
                  <div className="mt-4 rounded-xl border-l-2 border-[var(--gold)] bg-[rgba(198,146,50,0.06)] p-4">
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--gold-ink)]">Response</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-text)]">{e.response}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* The political journey */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <SectionHead
          eyebrow="The Political Journey"
          title="How a political life is built"
          sub="Context, not promotion. Relationships are described only where supported by the record."
        />
        <div className="mt-12 space-y-4">
          {JOURNEY_STEPS.map(([title, desc], i) => (
            <div key={title} data-reveal data-delay={String(i * 60)} className="flex items-center gap-5">
              <div className="glass-card !h-14 !w-14 shrink-0 !rounded-2xl flex items-center justify-center font-display text-lg font-extrabold text-[var(--brand)]">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <p className="font-display text-base font-bold text-[var(--white)]">{title}</p>
                <p className="mt-1 text-sm text-[var(--muted-text)]">{desc}</p>
              </div>
              {i < JOURNEY_STEPS.length - 1 && (
                <span aria-hidden className="hidden text-[var(--muted-2)] md:block">↓</span>
              )}
            </div>
          ))}
        </div>
        <div data-reveal className="mt-10 rounded-2xl border border-[rgba(166,27,27,0.2)] bg-[rgba(166,27,27,0.04)] p-5">
          <p className="text-sm leading-relaxed text-[var(--muted-text)]">
            <span className="font-bold text-[var(--white)]">Editorial note: </span>
            Allegations concerning any individual — including those made during the 2026
            proceedings — are attributed to their source and carry an evidence status. Nothing on
            this page presents an allegation as an established fact.
          </p>
        </div>
      </section>
    </div>
  );
}
