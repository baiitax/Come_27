'use client';

import React from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 pt-20">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(240,68,56,0.1)] text-2xl text-[#B42318]">!</div>
        <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-[var(--white)] md:text-3xl">
          Something didn&apos;t load correctly.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--muted-text)]">
          Please try again. If the problem persists, return home and navigate from the main menu.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">Retry</button>
          <Link href="/" className="btn-secondary">Return Home</Link>
        </div>
      </div>
    </div>
  );
}
