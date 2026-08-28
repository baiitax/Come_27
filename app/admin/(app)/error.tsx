'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-[rgba(240,68,56,0.25)] bg-white/80 p-8 text-center shadow-[0_16px_40px_rgba(240,68,56,0.08)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(240,68,56,0.1)] text-2xl text-[#B42318]">⚠</div>
        <h1 className="mt-4 font-display text-xl font-extrabold tracking-tight text-[#172033]">This page hit an error</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#667085]">
          Something failed while rendering this admin page
          {error.digest && <span> (ref: {error.digest})</span>}. Retry — or open diagnostics, which
          re-checks the database live and shows the exact fix.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-full bg-[#172033] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:-translate-y-px">
            Retry
          </button>
          <Link href="/admin/diagnostics" className="rounded-full border border-[rgba(16,24,40,0.15)] bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#344054] transition hover:-translate-y-px">
            Diagnostics
          </Link>
        </div>
      </div>
    </div>
  );
}
