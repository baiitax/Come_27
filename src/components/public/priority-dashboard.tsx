'use client';

import React, { useEffect, useState } from 'react';

type Data = { insufficient: boolean; total: number; topics?: { topic: string; count: number; pct: number }[] };

const TOPICS: Record<string, string> = {
  education: 'Education', water: 'Water', roads: 'Roads', healthcare: 'Healthcare',
  agriculture: 'Agriculture', employment: 'Employment', security: 'Security',
  youth: 'Youth', women: 'Women', commerce: 'Commerce', general: 'General',
};

export function PriorityDashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/public/priorities')
      .then((r) => r.json())
      .then((d: Data) => { setData(d); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <div className="glass-card !p-8" aria-busy>
        <div className="h-4 w-40 animate-pulse rounded bg-[rgba(23,32,51,0.06)]" />
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-3 w-full animate-pulse rounded bg-[rgba(23,32,51,0.05)]" />)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="glass-card !p-6 md:!p-8">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--brand)]">
        What Kano is talking about
      </p>

      {data.insufficient ? (
        <div className="mt-5">
          <p className="text-sm font-semibold text-[var(--white)]">
            Community data is still being collected.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)]">
            Priority percentages are published only once a sufficient number of voluntary
            submissions exist. Every figure shown here is real — we never display estimates.
          </p>
          <a href="/engage" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
            Add your voice <span aria-hidden>→</span>
          </a>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {(data.topics ?? []).slice(0, 6).map((t) => (
            <li key={t.topic}>
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span className="font-semibold text-[var(--white)]">{TOPICS[t.topic] ?? t.topic}</span>
                <span className="font-display font-bold text-[var(--brand)]">{t.pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[rgba(23,32,51,0.06)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--brand),var(--gold))]"
                  style={{ width: `${t.pct}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-[0.62rem] text-[var(--muted-2)]">
        Aggregate of voluntary community submissions · no individual data · total: {data.total}
      </p>
    </div>
  );
}
