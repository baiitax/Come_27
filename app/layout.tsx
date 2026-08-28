import './globals.css';
import type { ReactNode } from 'react';
import { Manrope, Fraunces } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
});

export const metadata = {
  metadataBase: new URL('https://come-pcipyrd8f-baiita-x-degen-s-projects.vercel.app'),
  title: {
    default: 'Comarade Aminu Abdussalam Gwarzo | 2027 Kano Governorship',
    template: '%s | Gwarzo 2027',
  },
  description:
    'Official digital portfolio of Comarade Aminu Abdussalam Gwarzo — NDC candidate for Governor of Kano State 2027. A lifetime of service. A new responsibility to Kano.',
  keywords: ['Gwarzo 2027', 'Aminu Abdussalam Gwarzo', 'Kano Governor 2027', 'NDC Kano', 'Kano State', 'Nigeria'],
  openGraph: {
    title: 'Comarade Aminu Abdussalam Gwarzo | 2027 Kano Governorship',
    description:
      'A lifetime of service. A new responsibility to Kano. NDC candidate for Governor of Kano State 2027.',
    url: 'https://come-pcipyrd8f-baiita-x-degen-s-projects.vercel.app/',
    siteName: 'Gwarzo 2027',
    locale: 'en_NG',
    type: 'website',
    images: [{ url: '/images/hero/gwarzo-hero.jpg', width: 1122, height: 1402, alt: 'Comarade Aminu Abdussalam Gwarzo' }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body className={`font-sans antialiased ${manrope.variable} ${fraunces.variable}`}>{children}</body>
    </html>
  );
}
