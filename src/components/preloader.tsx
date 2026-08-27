'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Elegant brand preloader: gold ring + monogram + NDC tricolor line.
 * Fades out after load and unmounts itself.
 */
export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLoading(false), 900);
    const t2 = setTimeout(() => setHidden(true), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden={loading}
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--obsidian)] transition-all duration-700',
        loading ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <div className="relative flex h-40 w-40 items-center justify-center">
        {/* rotating gold ring */}
        <div className="absolute inset-0 rounded-full border border-[rgba(214,178,94,0.25)]" />
        <div className="anti-clockwise absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--gold)] border-r-[rgba(214,178,94,0.35)]" />
        {/* pulse ring */}
        <div className="pulse-ring absolute inset-3 rounded-full border border-[rgba(214,178,94,0.4)]" />
        {/* monogram */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-[rgba(11,107,69,0.4)] bg-[linear-gradient(135deg,rgba(14,138,90,0.14),rgba(214,178,94,0.08))] font-display text-2xl font-bold text-[var(--primary-green)] shadow-[0_0_50px_rgba(11,107,69,0.18)]">
          G27
        </div>
      </div>

      <p className="mt-8 font-display text-sm font-bold tracking-[0.42em] text-[var(--white)]">
        GWARZO <span className="text-[var(--gold-ink)]">2027</span>
      </p>
      <p className="mt-2 text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted-text)]">
        For a Better Kano
      </p>

      {/* NDC tricolor line */}
      <div
        aria-hidden
        className="mt-6 h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,var(--ndc-green)_0%,#F7F9F8_50%,var(--ndc-red)_100%)]"
      />
    </div>
  );
}
