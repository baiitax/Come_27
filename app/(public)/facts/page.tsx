import Link from 'next/link';
import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';
import { SectionHead } from '@/components/public/section-head';
import { EvidenceBadge } from '@/components/public/evidence-badge';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Facts & Transparency',
  description: 'Facts. Evidence. Accountability. Claim → Verdict → Evidence → Source → Response.',
};

export default async function FactsPage() {
  const [claims, sources] = await safeDb(
  () => Promise.all([
    prisma.claim.findMany({
      where: { isDemo: false },
      orderBy: { updatedAt: 'desc' },
      include: { source: true, evidences: true },
    }),
    prisma.source.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
  ]),
  [[], []],
  'facts'
);

  const verdictTone: Record<string, string> = {
    verified: 'text-[#027A48]', 'mostly-verified': 'text-[#027A48]', unverified: 'text-[#B54708]',
    misleading: 'text-[#B42318]', false: 'text-[#B42318]', insufficient: 'text-[#475467]', 'under-review': 'text-[#B54708]',
  };

  return (
    <div className="pt-32 md:pt-40">
      <section className="mx-auto max-w-6xl px-6">
        <SectionHead
          eyebrow="Facts & Transparency"
          title={<>Facts. <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">Evidence. Accountability.</span></>}
          sub="Our evidence methodology: every factual record carries a verdict, its evidence, its source, and — where appropriate — the candidate's response. You should never have to guess."
        />
      </section>

      {/* Methodology */}
      <section className="mx-auto mt-12 max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5" data-reveal>
          {['Claim', 'Verdict', 'Evidence', 'Source', 'Response'].map((s, i) => (
            <div key={s} className="glass-card glass-panel-hover flex items-center gap-3 !p-4">
              <span className="font-display text-xl font-extrabold text-[rgba(23,32,51,0.15)]">{i + 1}</span>
              <span className="text-sm font-bold text-[var(--white)]">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Fact checks */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--white)]">Fact Checks</h2>
        {claims.length === 0 ? (
          <div className="glass-card !p-12 text-center">
            <p className="font-display text-lg font-bold text-[var(--white)]">No fact checks published yet</p>
            <p className="mt-2 text-sm text-[var(--muted-text)]">You can flag a claim for review from the Engage page.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((c, i) => (
              <div key={c.id} data-reveal data-delay={String((i % 3) * 80)} className="glass-card glass-panel-hover p-6 md:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-2)]">The claim</p>
                    <p className="mt-2 font-display text-lg font-bold leading-snug text-[var(--white)]">“{c.statement}”</p>
                    {c.context && <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)]">{c.context}</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-2)]">Verdict</p>
                    <p className={`mt-1 font-display text-xl font-extrabold ${verdictTone[c.status] ?? 'text-[var(--white)]'}`}>
                      {c.status.replace('-', ' ')}
                    </p>
                    <div className="mt-2"><EvidenceBadge status={c.status} source={c.source?.title} verifiedDate={c.verifiedAt} /></div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--glass-border)] pt-5 md:grid-cols-3">
                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-2)]">Evidence</p>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--muted-text)]">
                      {c.evidences.length ? c.evidences.map((e) => <li key={e.id}>· {e.title}</li>) : <li>· Under assembly</li>}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-2)]">Source</p>
                    <p className="mt-2 text-sm text-[var(--muted-text)]">{c.source ? `${c.source.publisher || c.source.title}` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-2)]">Candidate response</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)]">{c.verdictNotes || '—'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sources */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-6 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--white)]">Source Registry</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2" data-reveal>
          {sources.map((s) => (
            <div key={s.id} className="glass-card glass-panel-hover flex items-center gap-4 !p-4">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${s.reliability === 'official' || s.reliability === 'high' ? 'bg-[#12B76A]' : s.reliability === 'low' || s.reliability === 'unverified' ? 'bg-[#F79009]' : 'bg-[#2E90FA]'}`} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[var(--white)]">{s.title}</p>
                <p className="truncate text-xs text-[var(--muted-text)]">{s.publisher} · {s.type.replace('-', ' ')} · reliability: {s.reliability}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/engage" className="btn-secondary">Flag a claim for review</Link>
        </div>
      </section>
    </div>
  );
}
