import dynamic from 'next/dynamic';
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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyGwarzoSection />
      <JourneySection />
      <PublicServiceRecordSection />
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
