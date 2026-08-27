import FactsTransparencySection from '@/src/sections/facts-transparency-section';
import { GlassNavbar } from '@/components/navigation/floating-navbar';

export default function FactsPage() {
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

      <FactsTransparencySection />
    </main>
  );
}