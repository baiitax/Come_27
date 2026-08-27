import { HeroSection } from '@/sections/hero-section';
import { WhyGwarzoSection } from '@/sections/why-gwarzo-section';
import { JourneySection } from '@/sections/journey-section';
import { PublicServiceRecordSection } from '@/sections/public-service-record-section';
import { TwentySixTransitionSection } from '@/sections/twenty-six-transition-section';
import { KwankwasiyyaSection } from '@/sections/kwankwasiyya-section';
import { FactsTransparencySection } from '@/sections/facts-transparency-section';
import { MomentsGallerySection } from '@/sections/moments-gallery-section';
import { CitizenEngagementSection } from '@/sections/citizen-engagement-section';
import { LatestSpeechesSection } from '@/sections/latest-speeches-section';
import { FinalCTASection } from '@/sections/final-cta-section';

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
