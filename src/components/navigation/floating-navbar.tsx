'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

const defaultItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Record', href: '/#record' },
  { label: 'Kano', href: '/kano' },
  { label: 'Vision', href: '/#vision' },
  { label: 'Media', href: '/#media' },
  { label: 'Facts', href: '/facts' },
  { label: 'Engage', href: '/#engage' },
];

export const GlassNavbar = ({
  items = defaultItems,
  onScroll,
}: {
  items?: NavItem[];
  onScroll?: (progress: number) => void;
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const p = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
        setScrolled(scrollY > 24);
        setProgress(p);
        onScroll?.(p);
      });
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => {
      window.removeEventListener('scroll', handler);
      cancelAnimationFrame(raf);
    };
  }, [onScroll]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      {/* Tricolor scroll progress (NDC green -> gold -> Kwankwasiya crimson) */}
      <div
        aria-hidden
        className="tricolor-gradient fixed left-0 top-0 z-[60] h-[3px] rounded-r-full transition-[width] duration-150 ease-out"
        style={{ width: `${(progress * 100).toFixed(2)}%` }}
      />
      <nav
        aria-label="Primary"
        className={cn(
          'glass-static flex w-full max-w-6xl items-center justify-between gap-4 rounded-full py-2.5 pl-4 pr-2.5 transition-all duration-500',
          scrolled ? 'shadow-[0_14px_40px_rgba(16,37,27,0.16)] border-[rgba(11,107,69,0.25)]' : ''
        )}
      >
        {/* Brand */}
        <a href="/" className="group flex items-center gap-2.5" aria-label="Gwarzo 2027 — home">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[rgba(11,107,69,0.35)] bg-[linear-gradient(135deg,rgba(14,138,90,0.16),rgba(11,107,69,0.04))] font-display text-sm font-bold text-[var(--primary-green)] transition-transform duration-500 group-hover:scale-105">
            G27
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[3px] bg-[linear-gradient(90deg,var(--ndc-green)_0%,#F7F9F8_50%,var(--ndc-red)_100%)] opacity-80"
            />
          </span>
          <span className="hidden sm:block leading-none">
            <span className="block font-display text-[0.95rem] font-bold tracking-[0.08em] text-[#10251B]">
              GWARZO <span className="text-[var(--primary-green)]">2027</span>
            </span>
            <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.26em] text-[#7A8C82]">
              For a Better Kano
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group relative rounded-full px-3.5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-text)] transition-colors duration-300 hover:text-[var(--white)]"
              >
                {item.label}
                <span
                  aria-hidden
                  className="absolute inset-x-3.5 -bottom-px h-px origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-300 group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="/#engage"
          className="btn-crimson !px-5 !py-2.5 !text-[0.72rem] !tracking-[0.14em] hidden md:inline-flex"
        >
          Join the Movement
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--glass-border)] text-[var(--white)] transition-colors hover:border-[var(--gold)] lg:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={cn(
                'absolute left-0 top-0 h-0.5 w-full rounded bg-current transition-all duration-300',
                menuOpen && 'top-1.5 rotate-45'
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-1.5 h-0.5 w-full rounded bg-current transition-all duration-300',
                menuOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-3 h-0.5 w-full rounded bg-current transition-all duration-300',
                menuOpen && 'top-1.5 -rotate-45'
              )}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'glass-static absolute inset-x-4 top-[5.25rem] origin-top rounded-3xl p-3 transition-all duration-400 lg:hidden',
          menuOpen
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        )}
      >
        <ul className="grid grid-cols-2 gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted-text)] transition-colors hover:bg-[rgba(214,178,94,0.12)] hover:text-[var(--white)]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/#engage"
          onClick={() => setMenuOpen(false)}
          className="mt-2 block rounded-2xl bg-[linear-gradient(135deg,#C0323E,#A31621_60%,#7C0F18)] px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_26px_rgba(163,22,33,0.3)]"
        >
          Join the Movement
        </a>
      </div>
    </header>
  );
};

// Backwards-compatible alias
export const FloatingNavbar = GlassNavbar;
