'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Record<string, { href: string; title: string; meta?: string }[]> | null>(null);

  React.useEffect(() => {
    if (q.trim().length < 2) { setResults(null); return; }
    const t = setTimeout(() => {
      fetch(`/api/public/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then(setResults)
        .catch(() => setResults({}));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const GROUPS = [
    ['news', 'News'], ['speeches', 'Speeches'], ['events', 'Events'],
    ['policies', 'Policies'], ['facts', 'Facts'], ['records', 'Records'], ['media', 'Media'],
  ] as const;

  const total = results ? Object.values(results).reduce((a, r) => a + r.length, 0) : 0;

  return (
    <div className="pt-36 md:pt-44">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-center text-[0.62rem] font-bold uppercase tracking-[0.3em] text-[var(--brand)]">Search</p>
        <div className="relative mt-6">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What are you looking for?"
            aria-label="Search the site"
            className="w-full rounded-2xl border border-[var(--glass-border)] bg-white px-6 py-5 text-lg text-[var(--white)] shadow-[0_10px_40px_rgba(23,32,51,0.08)] outline-none transition focus:border-[var(--brand)]/50"
          />
          <span aria-hidden className="absolute right-5 top-1/2 -translate-y-1/2 rounded-lg border border-[var(--glass-border)] bg-white px-2 py-1 text-[0.6rem] font-bold text-[var(--muted-2)]">⌘ K</span>
        </div>

        {results && (
          <div className="mt-8 space-y-8">
            {total === 0 && (
              <p className="glass-card !p-8 text-center text-sm text-[var(--muted-text)]">
                No results for “{q}”. Try a different word.
              </p>
            )}
            {GROUPS.map(([key, label]) =>
              results[key]?.length ? (
                <section key={key}>
                  <h2 className="mb-3 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[var(--muted-2)]">{label}</h2>
                  <ul className="space-y-2">
                    {results[key].map((r, i) => (
                      <li key={i}>
                        <Link href={r.href} className="glass-card glass-panel-hover block !p-4">
                          <p className="font-display text-sm font-bold text-[var(--white)]">{r.title}</p>
                          {r.meta && <p className="mt-0.5 text-xs text-[var(--muted-text)]">{r.meta}</p>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}
