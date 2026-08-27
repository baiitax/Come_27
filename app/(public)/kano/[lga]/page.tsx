import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';
import { SectionHead } from '@/components/public/section-head';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'LGA' };

export default async function LgaPage({ params }: { params: Promise<{ lga: string }> }) {
  const { lga } = await params;
  const l = await safeDb(
    () => prisma.lga.findUnique({
      where: { id: lga },
      include: { _count: { select: { submissions: true, events: true, volunteers: true } } },
    }),
    null,
    'lga-detail'
  );
  if (!l) notFound();
  const priorities = JSON.parse(l.prioritiesJson || '[]') as string[];

  return (
    <div className="pt-32 md:pt-40">
      <article className="mx-auto max-w-4xl px-6 pb-20">
        <Link href="/kano" className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--brand)] hover:underline">
          ← Kano · 44 LGAs
        </Link>

        <div data-reveal className="mt-8">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--gold-ink)]">{l.senatorialDistrict || 'Kano State'}</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-[var(--white)] md:text-5xl">{l.name}</h1>
        </div>
        <div className="gold-rule mt-6 w-40" />

        <div className="mt-10 grid grid-cols-3 gap-3">
          {[
            [l._count.submissions, 'Community submissions'],
            [l._count.events, 'Events'],
            [l._count.volunteers, 'Volunteers'],
          ].map(([v, label], i) => (
            <div key={i} className="glass-card !p-4 text-center">
              <p className="font-display text-3xl font-extrabold text-[var(--brand)]">{v}</p>
              <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)]">{label}</p>
            </div>
          ))}
        </div>

        <section data-reveal className="mt-10">
          <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Development priorities</h2>
          {priorities.length ? (
            <ul className="mt-4 space-y-2.5">
              {priorities.map((p) => (
                <li key={p} className="flex gap-3 text-base leading-relaxed text-[var(--muted-text)]">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                  {p}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-2xl border border-[var(--glass-border)] bg-white/60 px-5 py-4 text-sm font-semibold uppercase tracking-wide text-[var(--muted-2)]">
              Insufficient public data
            </p>
          )}
        </section>

        <p className="mt-10 text-xs leading-relaxed text-[var(--muted-2)]">
          Aggregate data only — no individual-level information. Submissions from this LGA are
          shown only in aggregate, consistent with the campaign&apos;s privacy-first engagement policy.
        </p>
      </article>
    </div>
  );
}
