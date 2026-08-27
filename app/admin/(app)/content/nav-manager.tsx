'use client';

import React, { useState, useTransition } from 'react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  sort: number;
  enabled: boolean;
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

export function NavManager({ items }: { items: NavItem[] }) {
  const [pending, start] = useTransition();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string>();
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');
  const btn = 'rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] transition hover:bg-[rgba(16,24,40,0.04)] hover:text-[#172033] disabled:opacity-40';

  return (
    <div>
      <ul className="divide-y divide-[rgba(16,24,40,0.06)]">
        {items.map((n) => (
          <li key={n.id} className="flex items-center gap-3 px-5 py-2.5">
            <span className={`h-2 w-2 rounded-full ${n.enabled ? 'bg-[#12B76A]' : 'bg-[#98A2B3]'}`} aria-hidden />
            <span className="flex-1 text-sm font-semibold text-[#172033]">{n.label}</span>
            <code className="rounded bg-[rgba(16,24,40,0.04)] px-2 py-0.5 text-[0.68rem] text-[#667085]">{n.href}</code>
            <button type="button" disabled={pending} onClick={() => start(async () => { await post(`/api/admin/navigation/${n.id}/delete`); })} className={`${btn} hover:text-[#B42318]`}>Delete</button>
          </li>
        ))}
      </ul>

      {adding ? (
        <form
          className="flex flex-wrap items-end gap-2 border-t border-[rgba(16,24,40,0.06)] px-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            start(async () => {
              const res = await post('/api/admin/navigation', { label, href });
              if (res.error) setError(res.error);
              else setAdding(false);
            });
          }}
        >
          <label className="flex-1">
            <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#667085]">Label</span>
            <input value={label} onChange={(e) => setLabel(e.target.value)} required className="w-full rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3 py-2 text-sm text-[#172033] outline-none focus:border-[#0E8A5A]/50" />
          </label>
          <label className="flex-1">
            <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#667085]">Href</span>
            <input value={href} onChange={(e) => setHref(e.target.value)} required placeholder="/about or /#record" className="w-full rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3 py-2 text-sm text-[#172033] outline-none focus:border-[#0E8A5A]/50" />
          </label>
          {error && <p className="w-full text-xs text-[#B42318]">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2 text-xs font-bold text-white">Add</button>
            <button type="button" onClick={() => setAdding(false)} className="rounded-lg border border-[rgba(16,24,40,0.1)] px-3 py-2 text-xs font-bold text-[#667085]">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="border-t border-[rgba(16,24,40,0.06)] px-5 py-3">
          <button type="button" onClick={() => setAdding(true)} className={btn}>+ Add item</button>
        </div>
      )}
    </div>
  );
}
