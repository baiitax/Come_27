'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Lga = { id: string; name: string; district: string; priorities: string[]; submissions: number };

export function LgaExplorer() {
  const [lgas, setLgas] = useState<Lga[] | null>(null);
  const [selected, setSelected] = useState<Lga | null>(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/lgas')
      .then((r) => r.json())
      .then((d) => {
        const enriched: Lga[] = (d as { id: string; name: string; senatorialDistrict: string; priorities: string[] }[]).map((l) => ({
          id: l.id,
          name: l.name,
          district: l.senatorialDistrict,
          priorities: l.priorities,
          submissions: 0,
        }));
        setLgas(enriched);
      })
      .catch(() => setLgas([]));
  }, []);

  const filtered = useMemo(
    () => (lgas ?? []).filter((l) => l.name.toLowerCase().includes(q.toLowerCase())),
    [lgas, q]
  );

  return (
    <div className="glass-card !p-6 md:!p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--brand)]">LGA Explorer</p>
          <p className="mt-1 font-display text-xl font-extrabold text-[var(--white)]">44 Local Government Areas</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search LGA…"
          aria-label="Search LGA"
          className="w-52 rounded-full border border-[var(--glass-border)] bg-white px-4 py-2.5 text-sm text-[var(--white)] outline-none transition focus:border-[var(--brand)]/50"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* LGA grid */}
        <div className="grid max-h-[420px] grid-cols-2 gap-2 overflow-y-auto pr-2 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-4">
          {(lgas ?? Array.from({ length: 12 }).map((_, i) => ({ id: `s${i}`, name: '', district: '', priorities: [], submissions: 0 }))).slice(0, lgas ? undefined : 12).map((l) =>
            l.name ? (
              <button
                key={l.id}
                type="button"
                onClick={() => setSelected(l)}
                className={`rounded-xl border px-3 py-3 text-left text-[0.72rem] font-semibold transition-all ${
                  selected?.id === l.id
                    ? 'border-[var(--brand)]/50 bg-[rgba(166,27,27,0.06)] text-[var(--brand)] shadow-[0_6px_18px_rgba(166,27,27,0.12)]'
                    : 'border-[var(--glass-border)] bg-white/60 text-[var(--muted-text)] hover:border-[var(--brand)]/25 hover:text-[var(--white)]'
                }`}
              >
                {l.name}
              </button>
            ) : (
              <div key={l.id} className="h-[52px] animate-pulse rounded-xl bg-[rgba(23,32,51,0.05)]" />
            )
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="glass-card !rounded-2xl !p-6">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--gold-ink)]">{selected.district || 'Kano State'}</p>
              <h3 className="mt-1 font-display text-xl font-extrabold text-[var(--white)]">{selected.name}</h3>

              <div className="mt-5">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-2)]">Development priorities</p>
                {selected.priorities.length ? (
                  <ul className="mt-2 space-y-1.5 text-sm text-[var(--muted-text)]">
                    {selected.priorities.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--brand)]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 rounded-xl border border-[var(--glass-border)] bg-white/60 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted-2)]">
                    Insufficient public data
                  </p>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl border border-[var(--glass-border)] bg-white/60 px-3 py-3">
                  <p className="font-display text-lg font-extrabold text-[var(--brand)]">{selected.submissions}</p>
                  <p className="mt-0.5 text-[0.55rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">Submissions</p>
                </div>
                <div className="rounded-xl border border-[var(--glass-border)] bg-white/60 px-3 py-3">
                  <Link href={`/kano/${selected.id}`} className="text-[0.68rem] font-bold text-[var(--brand)] hover:underline">
                    Full LGA page →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-[var(--glass-border)] bg-white/40 p-8 text-center">
              <p className="max-w-[220px] text-sm leading-relaxed text-[var(--muted-text)]">
                Select an LGA to view its priorities, activity and aggregate community submissions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
