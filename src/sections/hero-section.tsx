'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParallax } from '@/hooks/use-parallax';

const stats = [
  { value: '27+', label: 'Years in public service', accent: 'text-[var(--primary-green)]' },
  { value: '44', label: 'LGAs to empower', accent: 'text-[var(--gold-ink)]' },
  { value: '2027', label: 'NDC • Kano', accent: 'text-[var(--kwankwasiya)]' },
];

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

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
  const orbARef = useParallax<HTMLDivElement>(0.06);
  const orbBRef = useParallax<HTMLDivElement>(-0.08);
  const portraitRef = useParallax<HTMLDivElement>(0.05);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-20">
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0">
        <div className="pattern-kano absolute inset-0" />
        <div
          ref={orbARef}
          className="absolute -left-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-[#0B6B45]/20 blur-[110px]"
        />
        <div
          ref={orbBRef}
          className="absolute -right-24 bottom-1/4 h-[26rem] w-[26rem] rounded-full bg-[#D6B25E]/12 blur-[120px]"
        />
        {/* vertical gold hairline */}
        <div className="absolute inset-y-0 left-[46%] hidden w-px bg-[linear-gradient(180deg,transparent,rgba(214,178,94,0.25),transparent)] lg:block" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12">
        {/* ---------------- Left: headline ---------------- */}
        <div className="lg:col-span-7">
          <div className="hero-rise flex flex-wrap items-center gap-3" style={{ '--rise-delay': '150ms' } as React.CSSProperties}>
            <span className="glass-static inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.26em] text-[var(--white)]">
              <span aria-hidden className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-[var(--ndc-green)]" />
                <span className="h-2 w-2 rounded-full bg-white" />
                <span className="h-2 w-2 rounded-full bg-[var(--ndc-red)]" />
              </span>
              NDC • 2027 Kano Governorship
            </span>
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-[var(--kwankwasiya)]">
              Amintace 2027
            </span>
          </div>

          <h1 className="mt-8 font-display font-bold leading-[0.98] tracking-tight">
            <span
              className="hero-rise block text-[clamp(2.6rem,7vw,5.4rem)] text-[var(--white)]"
              style={{ '--rise-delay': '300ms' } as React.CSSProperties}
            >
              COMRADE AMINU
            </span>
            <span
              className="hero-rise block text-[clamp(2.6rem,7vw,5.4rem)]"
              style={{ '--rise-delay': '450ms' } as React.CSSProperties}
            >
              ABDULLSALAM
            </span>
            <span
              className="hero-rise text-gold-gradient block text-[clamp(2.9rem,8vw,6.2rem)]"
              style={{ '--rise-delay': '600ms' } as React.CSSProperties}
            >
              GWARZO
            </span>
          </h1>

          <div className="gold-rule hero-rise mt-8 max-w-md" style={{ '--rise-delay': '750ms' } as React.CSSProperties} />

          <p
            className="hero-rise mt-8 text-xl font-medium leading-snug text-[var(--white)] md:text-2xl"
            style={{ '--rise-delay': '850ms' } as React.CSSProperties}
          >
            A LIFETIME OF SERVICE.
            <span className="block text-[var(--muted-text)]">A NEW RESPONSIBILITY TO KANO.</span>
          </p>

          <p
            className="hero-rise mt-6 max-w-xl text-base leading-relaxed text-[var(--muted-text)] md:text-lg"
            style={{ '--rise-delay': '950ms' } as React.CSSProperties}
          >
            A public servant, grassroots leader and former Deputy Governor of Kano State — bringing
            decades of institutional and community experience to Kano&apos;s next chapter.
          </p>

          <div className="hero-rise mt-10 flex flex-col gap-4 sm:flex-row" style={{ '--rise-delay': '1100ms' } as React.CSSProperties}>
            <a href="/#record" className="btn-primary">
              Explore the Record
              <span aria-hidden>→</span>
            </a>
            <a href="/#vision" className="btn-secondary">
              Discover the Vision
            </a>
          </div>

          {/* Stats */}
          <div className="hero-rise mt-14 grid max-w-lg grid-cols-3 gap-3" style={{ '--rise-delay': '1250ms' } as React.CSSProperties}>
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass-card !p-4 text-center hover:!translate-y-0"
              >
                <p className={`font-display text-2xl font-bold md:text-3xl ${s.accent}`}>{s.value}</p>
                <p className="mt-1 text-[0.6rem] uppercase leading-snug tracking-[0.14em] text-[var(--muted-text)]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Right: portrait ---------------- */}
        <div className="lg:col-span-5">
          <div
            ref={portraitRef}
            className="hero-rise relative mx-auto w-full max-w-sm lg:max-w-none"
            style={{ '--rise-delay': '500ms' } as React.CSSProperties}
          >
            {/* decorative orbit ring */}
            <div aria-hidden className="spin-slow absolute -inset-6 rounded-[3rem] border border-dashed border-[rgba(214,178,94,0.22)]" />

            <div className="float-slow relative">
              <div className="portrait-frame">
                <Image
                  src="/images/hero/gwarzo-hero.jpg"
                  alt="Comrade Aminu Abdussalam Gwarzo"
                  width={832}
                  height={1216}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>

              {/* floating credential chip */}
              <div
                className="glass-static absolute -left-4 bottom-10 rounded-2xl px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.55)] md:-left-10"
                style={{ transform: `translateY(${drift * -0.04}px)` }}
              >
                <p className="font-display text-sm font-bold tracking-wide text-[var(--white)]">
                  Former Deputy Governor
                </p>
                <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.2em] text-[var(--gold)]">
                  Kano State
                </p>
              </div>

              {/* NDC badge */}
              <div
                className="glass-static absolute -right-3 top-8 flex items-center gap-2 rounded-full px-4 py-2 md:-right-8"
                style={{ transform: `translateY(${drift * 0.05}px)` }}
              >
                <span aria-hidden className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--ndc-green)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--ndc-red)]" />
                </span>
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--white)]">
                  NDC 2027
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="/#vision"
        aria-label="Scroll to content"
        className="fade-in-late absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        style={{ '--rise-delay': '1800ms' } as React.CSSProperties}
      >
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-[var(--glass-border)] p-1.5">
          <span className="scroll-dot h-2 w-1 rounded-full bg-[var(--gold)]" />
        </span>
      </a>
    </section>
  );
}
