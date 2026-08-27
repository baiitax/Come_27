'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParallax } from '@/hooks/use-parallax';
import { StatsStrip } from '@/components/public/stats-strip';
import { trackEvent } from '@/components/public/track';

export interface HeroCandidate {
  name: string;
  displayName: string;
  title: string;
  tagline: string;
  shortBio: string;
  profileImageUrl: string;
}

export function HeroSection({
  candidate,
  stats,
}: {
  candidate: HeroCandidate;
  stats: { value: string; label: string; accent: string; source?: string | null }[];
}) {
  const [scrollY, setScrollY] = useState(0);
  const portraitRef = useParallax<HTMLDivElement>(0.05);
  const orbRef = useParallax<HTMLDivElement>(-0.07);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const drift = Math.min(scrollY, 900);

  return (
    <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
      {/* background: subtle tints + fine lines + grain */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          ref={orbRef}
          className="absolute -right-40 -top-32 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(198,146,50,0.1),transparent_65%)]"
        />
        <div
          ref={orbRef}
          className="absolute -left-48 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(166,27,27,0.06),transparent_65%)]"
        />
        <div className="absolute inset-y-0 left-1/2 hidden w-px bg-[linear-gradient(180deg,transparent,rgba(23,32,51,0.08),transparent)] lg:block" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12">
        {/* ---------------- Left: identity ---------------- */}
        <div className="lg:col-span-7">
          <div className="hero-rise flex flex-wrap items-center gap-3" style={{ '--rise-delay': '100ms' } as React.CSSProperties}>
            <span className="glass-static inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.26em] text-[var(--white)]">
              <span aria-hidden className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ndc-green)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-white ring-1 ring-[rgba(23,32,51,0.15)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ndc-red)]" />
              </span>
              NDC • 2027 Kano Governorship
            </span>
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-[var(--brand)]">
              Amintace 2027
            </span>
          </div>

          <h1 className="mt-8 font-display font-extrabold tracking-tight">
            <span className="hero-rise block text-[clamp(2.4rem,6.4vw,4.6rem)] leading-[1.02] text-[var(--muted-2)]" style={{ '--rise-delay': '250ms' } as React.CSSProperties}>
              Comrade
            </span>
            <span className="hero-rise block text-[clamp(2.8rem,7.4vw,5.6rem)] leading-[1.0] text-[var(--white)]" style={{ '--rise-delay': '380ms' } as React.CSSProperties}>
              Aminu Abdussalam
            </span>
            <span
              className="hero-rise block bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_55%,var(--gold))] bg-clip-text text-[clamp(3.2rem,8.6vw,6.6rem)] leading-[0.98] text-transparent"
              style={{ '--rise-delay': '520ms' } as React.CSSProperties}
            >
              Gwarzo
            </span>
          </h1>

          <div className="hero-rise mt-8 max-w-md" style={{ '--rise-delay': '650ms' } as React.CSSProperties}>
            <p className="font-display text-xl font-bold leading-snug text-[var(--white)] md:text-2xl">
              A lifetime of service.
            </p>
            <p className="font-display text-xl font-bold leading-snug text-[var(--muted-text)] md:text-2xl">
              A new responsibility to Kano.
            </p>
          </div>

          <p className="hero-rise mt-6 max-w-xl text-base leading-relaxed text-[var(--muted-text)] md:text-lg" style={{ '--rise-delay': '780ms' } as React.CSSProperties}>
            {candidate.shortBio}
          </p>

          <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ '--rise-delay': '900ms' } as React.CSSProperties}>
            <a
              href="/record"
              onClick={() => trackEvent('cta_click', '/record')}
              className="btn-primary"
            >
              Explore the Record <span aria-hidden>→</span>
            </a>
            <a
              href="/vision"
              onClick={() => trackEvent('cta_click', '/vision')}
              className="btn-secondary"
            >
              Discover the Vision
            </a>
          </div>
        </div>

        {/* ---------------- Right: portrait ---------------- */}
        <div className="lg:col-span-5">
          <div ref={portraitRef} className="hero-rise relative mx-auto w-full max-w-[26rem]" style={{ '--rise-delay': '400ms' } as React.CSSProperties}>
            {/* fine editorial frame */}
            <div aria-hidden className="absolute -inset-3 rounded-[2.2rem] border border-[rgba(166,27,27,0.15)]" />
            <div aria-hidden className="absolute -inset-3 -translate-x-2 -translate-y-2 rounded-[2.2rem] border border-[rgba(198,146,50,0.25)]" />

            <div className="float-slow relative">
              <div className="portrait-frame !rounded-[1.9rem]">
                <Image
                  src={candidate.profileImageUrl || '/images/hero/gwarzo-hero.jpg'}
                  alt={candidate.name}
                  width={864}
                  height={1220}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>

              {/* glass info panel */}
              <div
                className="glass-static absolute -left-4 bottom-10 rounded-2xl px-5 py-4 shadow-[0_18px_50px_rgba(23,32,51,0.16)] md:-left-10"
                style={{ transform: `translateY(${drift * -0.04}px)` }}
              >
                <p className="font-display text-sm font-bold tracking-wide text-[var(--white)]">NDC Candidate</p>
                <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.18em] text-[var(--gold-ink)]">Governor of Kano State 2027</p>
              </div>

              {/* NDC chip */}
              <div
                className="glass-static absolute -right-3 top-8 flex items-center gap-2 rounded-full px-4 py-2 md:-right-7"
                style={{ transform: `translateY(${drift * 0.05}px)` }}
              >
                <span aria-hidden className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--ndc-green)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white ring-1 ring-[rgba(23,32,51,0.15)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--ndc-red)]" />
                </span>
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--white)]">NDC 2027</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Stats (CMS) ---------------- */}
      <div className="relative mx-auto mt-16 max-w-7xl px-6" data-reveal data-delay="200">
        <StatsStrip stats={stats} />
      </div>

      {/* scroll indicator */}
      <a
        href="#meet"
        aria-label="Scroll to explore"
        className="fade-in-late absolute bottom-5 left-1/2 z-10 -translate-x-1/2"
        style={{ '--rise-delay': '1600ms' } as React.CSSProperties}
      >
        <span className="flex flex-col items-center gap-2 text-[0.55rem] font-bold uppercase tracking-[0.3em] text-[var(--muted-2)]">
          Scroll to explore
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-[var(--glass-border)] p-1">
            <span className="scroll-dot h-2 w-0.5 rounded-full bg-[var(--brand)]" />
          </span>
        </span>
      </a>
    </section>
  );
}
