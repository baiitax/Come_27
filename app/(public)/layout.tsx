import type { ReactNode } from 'react';
import { Preloader } from '@/components/preloader';
import { ScrollReveals } from '@/components/scroll-reveals';
import { SiteFooter } from '@/components/site-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { Track } from '@/components/public/track';
import { ChatWidget } from '@/components/public/chat-widget';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-shell grain relative min-h-screen text-[color:var(--white)]">
      {/* Preloader */}
      <Preloader />

      {/* Ambient aurora background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="aurora-a absolute -top-48 -left-40 h-[36rem] w-[36rem] rounded-full bg-[rgba(166,27,27,0.04)] blur-[130px]" />
        <div className="aurora-b absolute top-1/3 -right-56 h-[40rem] w-[40rem] rounded-full bg-[rgba(198,146,50,0.06)] blur-[140px]" />
        <div className="aurora-a absolute -bottom-64 right-1/4 h-[32rem] w-[32rem] rounded-full bg-[rgba(166,27,27,0.035)] blur-[130px]" />
      </div>

      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-[var(--gold)] focus:px-5 focus:py-2 focus:text-sm focus:font-bold focus:text-black"
      >
        Skip to main content
      </a>

      <ScrollReveals />
      <PublicNavbar />
      <ChatWidget />

      <main id="main-content" className="relative">
        {children}
      </main>

      <SiteFooter />
      {/* breathing room so the fixed mobile Join bar never covers the footer */}
      <div aria-hidden className="h-16 lg:hidden" />
    </div>
  );
}
