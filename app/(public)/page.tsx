import dynamic from 'next/dynamic';
import { prisma } from '@/lib/db';
import { HeroSection } from '@/sections/hero-section';
import { WhyGwarzoSection } from '@/sections/why-gwarzo-section';
import { JourneySection } from '@/sections/journey-section';
import { PublicServiceRecordSection } from '@/sections/public-service-record-section';
import { TwentySixTransitionSection } from '@/sections/twenty-six-transition-section';
import { KwankwasiyyaSection } from '@/sections/kwankwasiyya-section';
import { FactsTransparencySection } from '@/sections/facts-transparency-section';

// Below-the-fold sections are lazy-loaded to keep the initial page light.
const MomentsGallerySection = dynamic(
  () => import('@/sections/moments-gallery-section').then((m) => m.MomentsGallerySection),
  { ssr: true, loading: () => <div className="h-[30rem] md:h-[36rem]" /> }
);
const CitizenEngagementSection = dynamic(
  () => import('@/sections/citizen-engagement-section').then((m) => m.CitizenEngagementSection),
  { ssr: true, loading: () => <div className="h-[30rem] md:h-[34rem]" /> }
);
const LatestSpeechesSection = dynamic(
  () => import('@/sections/latest-speeches-section').then((m) => m.LatestSpeechesSection),
  { ssr: true, loading: () => <div className="h-[26rem] md:h-[30rem]" /> }
);
const FinalCTASection = dynamic(
  () => import('@/sections/final-cta-section').then((m) => m.FinalCTASection),
  { ssr: true, loading: () => <div className="h-[26rem] md:h-[30rem]" /> }
);

export default async function HomePage() {
  const [candidate, stats, records] = await Promise.all([
    prisma.candidate.findFirst(),
    prisma.stat.findMany({ where: { isActive: true }, orderBy: { sort: 'asc' } }),
    prisma.serviceRecord.findMany({ where: { published: true, deletedAt: null }, orderBy: { startDate: 'desc' } }),
  ]);

  return (
    <>
      <HeroSection
        candidate={{
          name: candidate?.fullName ?? 'Comrade Aminu Abdussalam Gwarzo',
          displayName: candidate?.displayName ?? 'Comrade Aminu AbdullSalam Gwarzo',
          title: candidate?.title ?? 'NDC Candidate for Governor of Kano State 2027',
          tagline: candidate?.tagline ?? 'A lifetime of service. A new responsibility to Kano.',
          shortBio: candidate?.shortBio ?? 'A public servant, grassroots leader and former Deputy Governor of Kano State.',
          profileImageUrl: candidate?.profileImageUrl ?? '/images/hero/gwarzo-hero.jpg',
        }}
        stats={stats.length > 0 ? stats.map((s) => ({ value: s.value, label: s.label, accent: s.accent })) : undefined}
      />
      <WhyGwarzoSection />
      <JourneySection />
      <PublicServiceRecordSection records={records.map((r) => ({
        id: r.id,
        year: r.startDate,
        role: r.position,
        institution: r.institution,
        location: r.location,
        responsibility: r.responsibilities,
        impact: r.impact,
        evidence: [r.evidenceStatus],
        filters: [],
      }))} />
      <TwentySixTransitionSection />
      <KwankwasiyyaSection />
      <FactsTransparencySection />
      <MomentsGallerySection />
      <CitizenEngagementSection />
      <LatestSpeechesSection />
      <FinalCTASection />
    </>
  );
}
