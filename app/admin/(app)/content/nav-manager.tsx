'use client';

import React, { useState, useTransition } from 'react';
import { saveNavItem, deleteNavItem } from '@admin/actions/site';

interface NavItem {
  id: string;
  label: string;
  href: string;
  sort: number;
  enabled: boolean;
}

export function NavManager({ items }: { items: NavItem[] }) {
  const [pending, start] = useTransition();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string>();
  const btn = 'rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.06] hover:text-white disabled:opacity-40';

  return (
    <div>
      <ul className="divide-y divide-white/[0.05]">
        {items.map((n) => (
          <li key={n.id} className="flex items-center gap-3 px-5 py-2.5">
            <span className={`h-2 w-2 rounded-full ${n.enabled ? 'bg-[#4CC39A]' : 'bg-[#5E6A63]'}`} aria-hidden />
            <span className="flex-1 text-sm font-semibold text-white">{n.label}</span>
            <code className="rounded bg-white/[0.04] px-2 py-0.5 text-[0.68rem] text-[#8A968E]">{n.href}</code>
            <button
              type="button"
              disabled={pending}
              onClick={() => start(() => deleteNavItem(n.id))}
              className={`${btn} hover:bg-[#C0323E]/15 hover:text-[#E06A75]`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {adding ? (
        <form
          className="flex flex-wrap items-end gap-2 border-t border-white/[0.05] px-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(undefined);
            const fd = new FormData(e.currentTarget);
            start(async () => {
              const res = await saveNavItem(undefined, fd);
              if (res && 'error' in res && res.error) setError(res.error);
              else setAdding(false);
            });
          }}
        >
          <label className="flex-1">
            <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#8A968E]">Label</span>
            <input name="label" required className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3 py-2 text-sm text-white outline-none focus:border-[#C9A24B]/60" />
          </label>
          <label className="flex-1">
            <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#8A968E]">Href</span>
            <input name="href" required placeholder="/about or /#record" className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3 py-2 text-sm text-white outline-none focus:border-[#C9A24B]/60" />
          </label>
          {error && <p className="w-full text-xs text-[#E06A75]">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2 text-xs font-bold text-white">
              Add
            </button>
            <button type="button" onClick={() => setAdding(false)} className="rounded-lg border border-white/[0.1] px-3 py-2 text-xs font-bold text-[#9AA39C]">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="border-t border-white/[0.05] px-5 py-3">
          <button type="button" onClick={() => setAdding(true)} className={btn}>
            + Add item
          </button>
        </div>
      )}
    </div>
  );
}
