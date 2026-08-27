import { HeroSection } from '@/sections/hero-section';
import { WhyGwarzoSection } from '@/sections/why-gwarzo-section';
import { JourneySection } from '@/sections/journey-section';
import { PublicServiceRecordSection } from '@/sections/public-service-record-section';
import { TwentySixTransitionSection } from '@/sections/twenty-six-transition-section';
import { KwankwasiyyaSection } from '@/sections/kwankwasiyya-section';
import { FactsTransparencySection } from '@/sections/facts-transparency-section';
import { CitizenEngagementSection } from '@/sections/citizen-engagement-section';
import { LatestSpeechesSection } from '@/sections/latest-speeches-section';
import { FinalCTASection } from '@/sections/final-cta-section';
import { GlassNavbar } from '@/components/navigation/floating-navbar';

export default function HomePage() {
  return (
    <main className="relative pt-32">
      <GlassNavbar items={[
        { label: 'HOME', href: '/' },
        { label: 'ABOUT', href: '/about' },
        { label: 'RECORD', href: '/record' },
        { label: 'KANO', href: '/kano' },
        { label: 'VISION', href: '/vision' },
        { label: 'MEDIA', href: '/media' },
        { label: 'FACTS', href: '/facts' },
        { label: 'ENGAGE', href: '/engage' },
      ]} />

      <HeroSection />
      <WhyGwarzoSection />
      <JourneySection />
      <PublicServiceRecordSection />
      <TwentySixTransitionSection />
      <KwankwasiyyaSection />
      <FactsTransparencySection />
      <CitizenEngagementSection />
      <LatestSpeechesSection />
      <FinalCTASection />
    </main>
  );
}