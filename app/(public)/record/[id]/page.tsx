import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';
import { EvidenceBadge } from '@/components/public/evidence-badge';
import { ShareBar } from '@/components/public/share-bar';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Record Entry' };

export default async function RecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await safeDb(() => prisma.serviceRecord.findUnique({ where: { id } }), null, 'record-detail');
  if (!record || !record.published) notFound();

  return (
    <div className="pt-32 md:pt-40">
      <article className="mx-auto max-w-3xl px-6 pb-20">
        <Link href="/record" className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--brand)] hover:underline">
          ← The Record
        </Link>

        <div data-reveal className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-display text-4xl font-extrabold tracking-tight text-[var(--brand)]">
              {record.startDate}–{record.endDate}
            </p>
            <EvidenceBadge status={record.evidenceStatus} source={record.institution} verifiedDate={record.verificationDate} notes={record.notes} />
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-[var(--white)] md:text-4xl">
            {record.position}
          </h1>
          <p className="mt-2 text-lg font-semibold text-[var(--muted-text)]">{record.institution}</p>
          <p className="mt-1 text-sm text-[var(--muted-2)]">{record.location}</p>
        </div>

        <div className="gold-rule mt-8 w-40" />

        {record.responsibilities && (
          <section data-reveal className="mt-10">
            <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Responsibilities</h2>
            <p className="mt-3 max-w-[720px] text-base leading-relaxed text-[var(--muted-text)]">{record.responsibilities}</p>
          </section>
        )}
        {record.description && (
          <section data-reveal className="mt-8">
            <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Description</h2>
            <p className="mt-3 max-w-[720px] text-base leading-relaxed text-[var(--muted-text)]">{record.description}</p>
          </section>
        )}
        {record.impact && (
          <section data-reveal className="mt-8">
            <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Impact</h2>
            <p className="mt-3 max-w-[720px] text-base leading-relaxed text-[var(--muted-text)]">{record.impact}</p>
          </section>
        )}
        {record.achievements && (
          <section data-reveal className="mt-8">
            <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Achievements</h2>
            <p className="mt-3 max-w-[720px] text-base leading-relaxed text-[var(--muted-text)]">{record.achievements}</p>
          </section>
        )}

        <div data-reveal className="mt-12 border-t border-[var(--glass-border)] pt-8">
          <ShareBar title={record.position} url="" />
        </div>
      </article>
    </div>
  );
}
