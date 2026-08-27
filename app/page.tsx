import HeroSection from '@/src/sections/hero-section';
import WhyGwarzoSection from '@/src/sections/why-gwarzo-section';
import JourneySection from '@/src/sections/journey-section';
import PublicServiceRecordSection from '@/src/sections/public-service-record-section';
import TwentySixTransitionSection from '@/src/sections/twenty-six-transition-section';
import KwankwasiyyaSection from '@/src/sections/kwankwasiyya-section';
import FactsTransparencySection from '@/src/sections/facts-transparency-section';
import CitizenEngagementSection from '@/src/sections/citizen-engagement-section';
import LatestSpeechesSection from '@/src/sections/latest-speeches-section';
import FinalCTASection from '@/src/sections/final-cta-section';
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
      ]}>

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