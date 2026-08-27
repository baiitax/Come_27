import './globals.css';
import type { ReactNode } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Preloader } from '@/components/preloader';
import { ScrollReveals } from '@/components/scroll-reveals';
import { SiteFooter } from '@/components/site-footer';
import { GlassNavbar } from '@/components/navigation/floating-navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://come-pcipyrd8f-baiita-x-degen-s-projects.vercel.app'),
  title: {
    default: 'Comrade Aminu Abdussalam Gwarzo | 2027 Kano Governorship',
    template: '%s | Gwarzo 2027',
  },
  description:
    'Official digital portfolio of Comrade Aminu Abdussalam Gwarzo — NDC candidate for Governor of Kano State 2027. A lifetime of service. A new responsibility to Kano.',
  keywords: [
    'Gwarzo 2027',
    'Aminu Abdussalam Gwarzo',
    'Kano Governor 2027',
    'NDC Kano',
    'Kano State',
    'Nigeria',
  ],
  openGraph: {
    title: 'Comrade Aminu Abdussalam Gwarzo | 2027 Kano Governorship',
    description:
      'A lifetime of service. A new responsibility to Kano. NDC candidate for Governor of Kano State 2027.',
    url: 'https://come-pcipyrd8f-baiita-x-degen-s-projects.vercel.app/',
    siteName: 'Gwarzo 2027',
    locale: 'en_NG',
    type: 'website',
    images: [{ url: '/images/hero/gwarzo-hero.jpg', width: 832, height: 1216, alt: 'Comrade Aminu Abdussalam Gwarzo' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="grain relative">
        {/* Preloader */}
        <Preloader />

        {/* Ambient aurora background */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0C1B15_0%,#07100D_55%)]" />
          <div className="aurora-a absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-[#0B6B45]/14 blur-[120px]" />
          <div className="aurora-b absolute top-1/3 -right-52 h-[38rem] w-[38rem] rounded-full bg-[#D6B25E]/8 blur-[140px]" />
          <div className="aurora-a absolute -bottom-60 left-1/4 h-[30rem] w-[30rem] rounded-full bg-[#138A5B]/10 blur-[130px]" />
        </div>

        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-[var(--gold)] focus:px-5 focus:py-2 focus:text-sm focus:font-bold focus:text-black"
        >
          Skip to main content
        </a>

        <ScrollReveals />

        <GlassNavbar />

        <main id="main-content" className="relative">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
