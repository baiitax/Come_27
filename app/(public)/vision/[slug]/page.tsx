import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';
import { EvidenceBadge } from '@/components/public/evidence-badge';
import { ShareBar } from '@/components/public/share-bar';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Policy' };

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = await safeDb(() => prisma.policySector.findFirst({
    where: { published: true, name: { equals: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) } },
    include: { initiatives: { orderBy: { sort: 'asc' } } },
  }), null, 'vision-detail');
  const all = sector ? [sector] : await safeDb(() => prisma.policySector.findMany({ where: { published: true }, include: { initiatives: true } }), [], 'vision-fallback');
  // fallback: case-insensitive-ish match
    const s = sector ?? all.find((x) => x.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
  if (!s) notFound();

  const objectives = JSON.parse(s.objectivesJson || '[]') as string[];
  const initiatives = s.initiatives.map((i) => i.title);
  const research = JSON.parse(s.researchJson || '[]') as string[];

  return (
    <div className="pt-32 md:pt-40">
      <article className="mx-auto max-w-3xl px-6 pb-20">
        <Link href="/vision" className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--brand)] hover:underline">
          ← The Vision
        </Link>

        <div data-reveal className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <EvidenceBadge status="proposed" />
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[var(--muted-2)]">Policy Proposal</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-[var(--white)] md:text-5xl">
            {s.name}
          </h1>
        </div>

        <div className="gold-rule mt-8 w-40" />

        {s.problemStatement && (
          <section data-reveal className="mt-10">
            <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">The Challenge</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--muted-text)]">{s.problemStatement}</p>
          </section>
        )}
        {s.currentContext && (
          <section data-reveal className="mt-8">
            <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Current Context</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--muted-text)]">{s.currentContext}</p>
          </section>
        )}
        {s.approach && (
          <section data-reveal className="mt-8">
            <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">What We Propose</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--muted-text)]">{s.approach}</p>
          </section>
        )}
        {objectives.length > 0 && (
          <section data-reveal className="mt-8">
            <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Objectives</h2>
            <ul className="mt-3 space-y-2">
              {objectives.map((o) => (
                <li key={o} className="flex gap-3 text-sm leading-relaxed text-[var(--muted-text)]">
                  <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                  {o}
                </li>
              ))}
            </ul>
          </section>
        )}
        {initiatives.length > 0 && (
          <section data-reveal className="mt-8">
            <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Key Initiatives</h2>
            <ul className="mt-3 space-y-2">
              {initiatives.map((i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--muted-text)]">
                  <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                  {i}
                </li>
              ))}
            </ul>
          </section>
        )}
        {research.length > 0 && (
          <section data-reveal className="mt-8">
            <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Sources</h2>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted-text)]">
              {research.map((r) => <li key={r}>· {r}</li>)}
            </ul>
          </section>
        )}

        <div data-reveal className="mt-10 rounded-2xl border border-[rgba(166,27,27,0.2)] bg-[rgba(166,27,27,0.04)] p-5">
          <p className="text-sm leading-relaxed text-[var(--muted-text)]">
            <span className="font-bold text-[var(--white)]">Note: </span>
            This is a campaign proposal. It is not a completed government program.
          </p>
        </div>

        <div data-reveal className="mt-10 border-t border-[var(--glass-border)] pt-8">
          <ShareBar title={`${s.name} — Gwarzo 2027 Vision`} url="" />
        </div>
      </article>
    </div>
  );
}
