import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';
import { ShareBar } from '@/components/public/share-bar';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Event' };

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await safeDb(() => prisma.campaignEvent.findUnique({ where: { id: slug }, include: { lga: true } }), null, 'event-detail');
  if (!e || e.status === 'cancelled' || e.status === 'archived') notFound();

  return (
    <div className="pt-32 md:pt-40">
      <article className="mx-auto max-w-3xl px-6 pb-20">
        <Link href="/media" className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--brand)] hover:underline">
          ← Media Center
        </Link>
        <div data-reveal className="mt-8 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[var(--muted-2)]">
              Event · {e.category.replace('-', ' ')}
            </p>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-[var(--white)] md:text-4xl">{e.name}</h1>
          </div>
          <div className="glass-card !rounded-2xl !p-4 text-center">
            <p className="font-display text-3xl font-extrabold text-[var(--brand)]">{e.startsAt.getDate()}</p>
            <p className="mt-0.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--muted-text)]">
              {e.startsAt.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="gold-rule mt-8 w-40" />
        {e.description && (
          <p data-reveal className="mt-8 max-w-[720px] text-base leading-relaxed text-[var(--muted-text)]">{e.description}</p>
        )}
        <dl data-reveal className="mt-8 grid grid-cols-2 gap-4">
          <div className="glass-card !p-4">
            <dt className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-2)]">Location</dt>
            <dd className="mt-1.5 text-sm font-semibold text-[var(--white)]">{e.venue || '—'}</dd>
            {e.address && <dd className="mt-0.5 text-xs text-[var(--muted-text)]">{e.address}</dd>}
            {e.lga && <dd className="mt-0.5 text-xs text-[var(--muted-text)]">{e.lga.name} LGA</dd>}
          </div>
          <div className="glass-card !p-4">
            <dt className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-2)]">Organizer</dt>
            <dd className="mt-1.5 text-sm font-semibold text-[var(--white)]">{e.organizer || 'Gwarzo 2027 Campaign'}</dd>
            {e.registrationUrl && (
              <dd className="mt-2">
                <a href={e.registrationUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[var(--brand)] hover:underline">
                  Register →
                </a>
              </dd>
            )}
          </div>
        </dl>
        <div data-reveal className="mt-10 border-t border-[var(--glass-border)] pt-8">
          <ShareBar title={e.name} url="" />
        </div>
      </article>
    </div>
  );
}
