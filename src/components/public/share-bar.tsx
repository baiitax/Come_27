'use client';

import React, { useState } from 'react';

export function ShareBar({ title, url }: { title: string; url?: string }) {
  const [copied, setCopied] = useState(false);
  const full = url ?? (typeof window !== 'undefined' ? window.location.href : '');
  const enc = encodeURIComponent;

  const targets = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${enc(title + ' ' + full)}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(full)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(full)}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(full)}` },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[var(--muted-2)]">Share</span>
      {targets.map((t) => (
        <a
          key={t.label}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${t.label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/70 text-[0.62rem] font-bold text-[var(--muted-text)] transition-all hover:-translate-y-px hover:border-[var(--brand)]/30 hover:text-[var(--brand)]"
        >
          {t.label === 'WhatsApp' ? 'W' : t.label === 'X' ? '𝕏' : t.label === 'Facebook' ? 'f' : 'in'}
        </a>
      ))}
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(full);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch { /* clipboard unavailable */ }
        }}
        className="flex h-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-white/70 px-3 text-[0.62rem] font-bold text-[var(--muted-text)] transition-all hover:border-[var(--brand)]/30 hover:text-[var(--brand)]"
      >
        {copied ? 'Copied ✓' : 'Copy link'}
      </button>
    </div>
  );
}
