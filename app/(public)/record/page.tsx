import Link from 'next/link';
import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';
import { SectionHead } from '@/components/public/section-head';
import { EvidenceBadge } from '@/components/public/evidence-badge';
import { RecordFilters } from '@/components/public/record-filters';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'The Record',
  description: 'A public-service journey measured by responsibility, experience and documented work.',
};

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'education', label: 'Education' },
  { id: 'local-government', label: 'Local Government' },
  { id: 'state', label: 'State' },
  { id: 'federal', label: 'Federal' },
  { id: 'executive', label: 'Executive' },
  { id: 'youth', label: 'Youth' },
  { id: 'community', label: 'Community' },
];

export default async function RecordPage() {
  const records = await safeDb(
    () => prisma.serviceRecord.findMany({ where: { published: true, deletedAt: null }, orderBy: { startDate: 'desc' } }),
    [],
    'record'
  );

  return (
    <div className="pt-32 md:pt-40">
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <SectionHead
          eyebrow="The Record"
          title={<>The <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">Record</span></>}
          sub="A public-service journey measured by responsibility, experience and documented work. Every entry carries its evidence status."
        />
      </section>

      <RecordFilters filters={FILTERS} />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" id="record-grid">
          {records.map((r, i) => {
            const filterText = `${r.position} ${r.institution} ${r.location} ${r.responsibilities}`.toLowerCase();
            const cats = ['education', 'local-government', 'state', 'federal', 'executive', 'youth', 'community']
              .filter((c) => (c === 'local-government' ? /local government|municipal/.test(filterText) : filterText.includes(c.split('-')[0])))
              .join(' ');
            return (
            <Link key={r.id} href={`/record/${r.id}`} data-filter={cats} data-reveal="zoom" data-delay={String((i % 3) * 80)} className="group">
              <div className="glass-card glass-panel-hover flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-extrabold text-[var(--brand)]">{r.startDate}–{r.endDate}</span>
                  <EvidenceBadge status={r.evidenceStatus} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-[var(--white)] group-hover:text-[var(--brand)]">{r.position}</h3>
                <p className="mt-1 text-sm font-semibold text-[var(--muted-text)]">{r.institution}</p>
                <p className="mt-0.5 text-xs text-[var(--muted-2)]">{r.location}</p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--muted-text)]">
                  {r.responsibilities || r.description}
                </p>
                {r.impact && (
                  <p className="mt-3 border-t border-[var(--glass-border)] pt-3 text-xs text-[var(--muted-text)]">
                    <span className="font-bold text-[var(--brand)]">Impact: </span>{r.impact}
                  </p>
                )}
              </div>
            </Link>
          );
          })}
        </div>
        {records.length === 0 && (
          <div className="glass-card mt-4 !p-12 text-center">
            <p className="font-display text-lg font-bold text-[var(--white)]">Content unavailable</p>
            <p className="mt-2 text-sm text-[var(--muted-text)]">The record is being prepared. Please try again later.</p>
          </div>
        )}
      </section>
    </div>
  );
}
