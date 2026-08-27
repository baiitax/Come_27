'use client';

import React from 'react';
import { useParallax } from '@/hooks/use-parallax';

export function FinalCTASection() {
  const orbRef = useParallax<HTMLDivElement>(0.08);

  return (
    <section id="engage" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div
          data-reveal="zoom"
          className="glass-card premium relative overflow-hidden !p-10 text-center md:!p-16"
        >
          {/* Ambient glow inside card */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div
              ref={orbRef}
              className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#0B6B45]/25 blur-[90px]"
            />
            <div className="absolute -bottom-28 -right-16 h-64 w-64 rounded-full bg-[#D6B25E]/15 blur-[100px]" />
          </div>

          <div className="relative">
            <span className="section-eyebrow">Join the Movement</span>

            <h2 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-[var(--white)] md:text-6xl">
              KANO&apos;S NEXT CHAPTER
              <span className="text-gold-gradient block">STARTS WITH YOU</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted-text)] md:text-lg">
              Volunteers, fact-checkers, community leaders — the 2027 movement is built one voice at
              a time. Stand with the man who has served Kano for decades.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="/about" className="btn-primary">
                Become a Volunteer
                <span aria-hidden>→</span>
              </a>
              <a href="/#record" className="btn-secondary">
                Review the Record
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted-text)]">
              <span aria-hidden className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ndc-green)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ndc-red)]" />
              </span>
              NDC • For a Better Kano • 2027
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
