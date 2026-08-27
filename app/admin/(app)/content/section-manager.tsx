'use client';

import { useTransition } from 'react';

interface Section {
  id: string;
  key: string;
  title: string;
  enabled: boolean;
  sort: number;
}

async function post(endpoint: string, body?: Record<string, unknown>) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) window.location.href = '/admin/login?reason=expired';
  return res.json().catch(() => ({}));
}

export function SectionManager({ sections }: { sections: Section[] }) {
  const [pending, start] = useTransition();
  const btn = 'rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] transition hover:bg-[rgba(16,24,40,0.04)] hover:text-[#172033] disabled:opacity-40';

  return (
    <ul className="divide-y divide-[rgba(16,24,40,0.06)]">
      {sections.map((s, i) => (
        <li key={s.id} className={`flex items-center gap-3 px-5 py-3 ${s.enabled ? '' : 'opacity-50'}`}>
          <span className="w-6 font-display text-xs font-bold text-[#98A2B3]">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#172033]">{s.title}</p>
            <p className="text-[0.65rem] uppercase tracking-wide text-[#98A2B3]">{s.key}</p>
          </div>
          <span className={`h-2 w-2 rounded-full ${s.enabled ? 'bg-[#12B76A]' : 'bg-[#98A2B3]'}`} aria-hidden />
          <button type="button" disabled={pending || i === 0} onClick={() => start(async () => { await post(`/api/admin/sections/${s.id}/move`, { dir: 'up' }); })} className={btn} aria-label="Move up">↑</button>
          <button type="button" disabled={pending || i === sections.length - 1} onClick={() => start(async () => { await post(`/api/admin/sections/${s.id}/move`, { dir: 'down' }); })} className={btn} aria-label="Move down">↓</button>
          <button
            type="button"
            disabled={pending}
            onClick={() => start(async () => { await post(`/api/admin/sections/${s.id}/toggle`); })}
            className={`${btn} ${s.enabled ? 'hover:text-[#027A48]' : 'hover:text-[#B54708]'}`}
          >
            {s.enabled ? 'Enabled' : 'Hidden'}
          </button>
        </li>
      ))}
    </ul>
  );
}
