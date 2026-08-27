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
          className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(150deg,#0E2A1F_0%,#081C13_100%)] px-8 py-14 text-center shadow-[0_30px_80px_rgba(16,37,27,0.35)] ring-1 ring-[rgba(214,178,94,0.3)] md:px-16 md:py-20"
        >
          {/* Ambient glow inside card */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div
              ref={orbRef}
              className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#138A5B]/30 blur-[90px]"
            />
            <div className="absolute -bottom-28 -right-16 h-64 w-64 rounded-full bg-[#D6B25E]/20 blur-[100px]" />
            <div className="pattern-kano absolute inset-0 opacity-20" />
          </div>

          {/* NDC tricolor hairline */}
          <div
            aria-hidden
            className="absolute inset-x-10 top-0 h-[3px] bg-[linear-gradient(90deg,#007A5E_0%,#F7F9F8_50%,#C8102E_100%)] opacity-70"
          />

          <div className="relative">
            <span className="section-eyebrow !text-[#E8CE8F]">
              <span style={{ color: '#E8CE8F' }}>Join the Movement</span>
            </span>

            <h2 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
              KANO&apos;S NEXT CHAPTER
              <span className="mt-2 block bg-[linear-gradient(100deg,#E8CE8F,#D6B25E_55%,#B98F3E)] bg-clip-text text-transparent">
                STARTS WITH YOU
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#B9CCC2] md:text-lg">
              Volunteers, fact-checkers, community leaders — the 2027 movement is built one voice
              at a time. Stand with the man who has served Kano for decades.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="/about" className="btn-primary">
                Become a Volunteer
                <span aria-hidden>→</span>
              </a>
              <a
                href="/#record"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.3)] bg-white/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] text-white backdrop-blur transition-all duration-300 hover:bg-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
              >
                Review the Record
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8FA79B]">
              <span aria-hidden className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#007A5E]" />
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8102E]" />
              </span>
              NDC • For a Better Kano • 2027
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
