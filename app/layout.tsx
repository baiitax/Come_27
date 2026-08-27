import './globals.css';
import { Preloader } from '@/components/preloader';
import type { ReactNode } from 'react';
import { Children } from 'react';

export const metadata = {
  title: 'Aminu Abdussalam Gwarzo - 2027 Kano Governorship',
  description: 'Digital leadership portfolio for Comrade Aminu Abdussalam Gwarzo, NDC Candidate for Governor of Kano State 2027',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" lang="ha">
      <body className="bg-[var(--obsidian)] text-[var(--white)] min-h-screen">
        {/* Preloader */}
        <Preloader />
        
        <main className="relative pt-32">
          {/* Skip link for accessibility */}
          <a href="#main-content" className="sr-only focus:focus-focus focus:outline-none focus:outline-2 focus:outline-[var(--primary-green)]">
            Skip to main content
          </a>
          
          {children}
        </main>
      </body>
    </html>
  );
}