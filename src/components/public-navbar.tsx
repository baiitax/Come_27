'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Record', href: '/record' },
  { label: 'Kano', href: '/kano' },
  { label: 'Vision', href: '/vision' },
  { label: 'Media', href: '/media' },
  { label: 'Newsroom', href: '/newsroom' },
  { label: 'Facts', href: '/facts' },
  { label: 'Engage', href: '/engage' },
];

const MOBILE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Gwarzo', href: '/about' },
  { label: 'The Record', href: '/record' },
  { label: 'Kano', href: '/kano' },
  { label: 'Vision', href: '/vision' },
  { label: 'Media', href: '/media' },
  { label: 'Newsroom', href: '/newsroom' },
  { label: 'Facts & Transparency', href: '/facts' },
  { label: 'Engage', href: '/engage' },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'py-2' : 'py-4'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <nav
            aria-label="Primary"
            className={cn(
              'flex items-center justify-between rounded-2xl px-4 transition-all duration-500 md:px-5',
              scrolled
                ? 'glass-static h-14 shadow-[0_8px_30px_rgba(23,32,51,0.1)]'
                : 'h-16 border border-transparent bg-transparent'
            )}
          >
            {/* Brand */}
            <Link href="/" className="group flex items-center gap-3" aria-label="Gwarzo 2027 — home">
              <span
                className={cn(
                  'flex items-center justify-center rounded-xl border border-[rgba(166,27,27,0.3)] bg-[linear-gradient(135deg,rgba(166,27,27,0.1),rgba(198,146,50,0.12))] font-display font-extrabold text-[var(--brand)] transition-all duration-500 group-hover:scale-105',
                  scrolled ? 'h-9 w-9 text-sm' : 'h-11 w-11 text-base'
                )}
              >
                G27
              </span>
              <span className="hidden leading-none sm:block">
                <span className="block font-display text-sm font-extrabold tracking-[0.14em] text-[var(--white)]">
                  GWARZO <span className="text-[var(--brand)]">2027</span>
                </span>
                <span className="mt-1 block text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted-2)]">
                  For a Better Kano
                </span>
              </span>
            </Link>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {LINKS.map((l) => {
                const active = pathname.startsWith(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        'relative rounded-full px-3.5 py-2 text-[0.78rem] font-semibold tracking-wide transition-colors duration-300',
                        active ? 'text-[var(--brand)]' : 'text-[var(--muted-text)] hover:text-[var(--white)]'
                      )}
                    >
                      {l.label}
                      <span
                        aria-hidden
                        className={cn(
                          'absolute inset-x-3.5 -bottom-0.5 h-px origin-left transition-transform duration-300',
                          active ? 'scale-x-100 bg-[var(--brand)]' : 'scale-x-0 bg-[var(--brand)]'
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <Link
                href="/join"
                className="hidden rounded-full bg-[linear-gradient(135deg,#B32424,var(--brand) 60%,var(--brand-deep))] px-5 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_22px_rgba(166,27,27,0.3)] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(166,27,27,0.4)] md:inline-flex"
              >
                Join the Movement
              </Link>

              {/* Mobile toggle */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-white/70 backdrop-blur lg:hidden"
              >
                <span className="relative block h-3.5 w-5">
                  <span className={cn('absolute left-0 top-0 h-0.5 w-full rounded bg-[var(--white)] transition-all duration-300', open && 'top-1.5 rotate-45')} />
                  <span className={cn('absolute left-0 top-1.5 h-0.5 w-full rounded bg-[var(--white)] transition-all duration-300', open && 'opacity-0')} />
                  <span className={cn('absolute left-0 top-3 h-0.5 w-full rounded bg-[var(--white)] transition-all duration-300', open && 'top-1.5 -rotate-45')} />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col bg-[rgba(250,251,252,0.92)] backdrop-blur-2xl transition-all duration-500 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!open}
      >
        <div className="flex-1 overflow-y-auto px-6 pb-10 pt-28">
          <ul className="space-y-1">
            {MOBILE_LINKS.map((l, i) => (
              <li
                key={l.href}
                className={cn('transition-all duration-500', open ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0')}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}
              >
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-[rgba(23,32,51,0.06)] py-4 font-display text-2xl font-bold tracking-tight text-[var(--white)] transition-colors hover:text-[var(--brand)]"
                >
                  {l.label}
                  <span aria-hidden className="text-[var(--muted-2)]">→</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className={cn('mt-10 space-y-3 transition-all duration-500', open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0')} style={{ transitionDelay: open ? '450ms' : '0ms' }}>
            <Link
              href="/join"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-[linear-gradient(135deg,#B32424,var(--brand) 60%,var(--brand-deep))] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(166,27,27,0.35)]"
            >
              Join the Movement
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block rounded-full border border-[var(--glass-border)] bg-white/70 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.16em] text-[var(--white)]"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="border-t border-[rgba(23,32,51,0.06)] px-6 py-5">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[var(--muted-2)]">
            Gwarzo 2027 · For a Better Kano
          </p>
        </div>
      </div>
    </>
  );
}
