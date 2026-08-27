import Link from 'next/link';
import { prisma } from '@/lib/db';
import { SectionHead } from '@/components/public/section-head';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'The Vision',
  description: 'A better Kano built on human capital, opportunity and accountable governance — twelve policy pillars, clearly marked as proposals.',
};

export default async function VisionPage() {
  const sectors = await prisma.policySector.findMany({
    where: { published: true },
    include: { initiatives: { orderBy: { sort: 'asc' } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="pt-32 md:pt-40">
      <section className="mx-auto max-w-6xl px-6">
        <SectionHead
          eyebrow="The Vision"
          title={<>A better Kano, built on <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">human capital, opportunity and accountable governance.</span></>}
          sub="Twelve policy pillars. Every item below is a campaign proposal — clearly marked, with sources where they exist."
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s, i) => (
            <Link key={s.id} href={`/vision/${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} data-reveal="zoom" data-delay={String((i % 3) * 80)} className="group">
              <div className="glass-card glass-panel-hover flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[0.68rem] font-extrabold tracking-[0.2em] text-[var(--gold-ink)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="rounded-full border border-[rgba(102,112,133,0.25)] bg-[rgba(102,112,133,0.1)] px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-[#475467]">
                    Policy Proposal
                  </span>
                </div>
                <h2 className="mt-4 font-display text-xl font-bold text-[var(--white)] group-hover:text-[var(--brand)]">{s.name}</h2>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--muted-text)]">{s.problemStatement}</p>
                <p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--brand)]">
                  Explore the policy →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
