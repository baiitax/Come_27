import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';
import { SectionHead } from '@/components/public/section-head';
import { WhyGwarzoSection } from '@/sections/why-gwarzo-section';
import { JourneySection } from '@/sections/journey-section';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'About Gwarzo',
  description: 'Comrade Aminu Abdussalam Gwarzo — a life built around service. Career, public service, grassroots experience and current candidacy.',
};

export default async function AboutPage() {
  const candidate = await safeDb(() => prisma.candidate.findFirst(), null, 'about');
  const c = {
    name: candidate?.fullName ?? 'Comrade Aminu Abdussalam Gwarzo',
    title: candidate?.title ?? 'NDC Candidate for Governor of Kano State 2027',
    shortBio: candidate?.shortBio ?? 'A public servant, grassroots leader and former Deputy Governor of Kano State.',
    longBio: candidate?.longBio ?? '',
    profileImageUrl: candidate?.profileImageUrl ?? '/images/hero/gwarzo-hero.jpg',
  };
  const paras = c.longBio.split('\n').map((p) => p.trim()).filter(Boolean);

  return (
    <div className="pt-32 md:pt-40">
      <section className="mx-auto max-w-7xl px-6">
        <SectionHead
          eyebrow="About Gwarzo"
          title={<>The man behind <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">the movement.</span></>}
          sub={c.title}
        />
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl grid-cols-1 items-start gap-12 px-6 pb-8 lg:grid-cols-12">
        <div data-reveal="left" className="lg:col-span-5">
          <div className="relative mx-auto max-w-sm">
            <div aria-hidden className="absolute -inset-3 -translate-x-2 -translate-y-2 rounded-[2rem] border border-[rgba(198,146,50,0.3)]" />
            <div className="portrait-frame">
              <Image src={c.profileImageUrl} alt={c.name} width={864} height={1220} priority className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
        <div data-reveal="right" data-delay="120" className="lg:col-span-7">
          {paras.length ? paras.map((p, i) => (
            <p key={i} className="mb-5 max-w-[720px] text-base leading-[1.75] text-[var(--muted-text)] md:text-lg">{p}</p>
          )) : (
            <p className="mb-5 max-w-[720px] text-base leading-[1.75] text-[var(--muted-text)] md:text-lg">{c.shortBio}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="glass-card !p-5">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--muted-2)]">Current candidacy</p>
              <p className="mt-1.5 font-display text-sm font-bold text-[var(--white)]">NDC · 2027 Kano Governorship</p>
            </div>
            <div className="glass-card !p-5">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--muted-2)]">Documented service</p>
              <p className="mt-1.5 font-display text-sm font-bold text-[var(--white)]">1990s — present</p>
            </div>
            <div className="glass-card !p-5">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--muted-2)]">Record</p>
              <Link href="/record" className="mt-1.5 inline-block font-display text-sm font-bold text-[var(--brand)] hover:underline">Explore →</Link>
            </div>
          </div>
        </div>
      </section>

      <WhyGwarzoSection />
      <JourneySection />
    </div>
  );
}
