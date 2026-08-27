'use client';

import React from 'react';

export function RecordFilters({ filters }: { filters: { id: string; label: string }[] }) {
  function apply(id: string) {
    const grid = document.getElementById('record-grid');
    if (!grid) return;
    // client-side highlight filter: records carry data-filter attributes set by the server
    grid.querySelectorAll<HTMLElement>('[data-filter]').forEach((el) => {
      const match = id === 'all' || (el.dataset.filter ?? '').includes(id);
      el.style.display = match ? '' : 'none';
    });
    document.querySelectorAll<HTMLElement>('[data-filter-btn]').forEach((b) => {
      const active = b.dataset.filterBtn === id;
      b.classList.toggle('bg-[var(--brand)]', active);
      b.classList.toggle('text-white', active);
      b.classList.toggle('border-[var(--brand)]', active);
      b.classList.toggle('text-[var(--muted-text)]', !active);
      b.classList.toggle('border-[var(--glass-border)]', !active);
    });
  }

  return (
    <div className="sticky top-16 z-30 border-y border-[var(--glass-border)] bg-[rgba(250,251,252,0.85)] py-3 backdrop-blur-xl md:top-14">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-1" role="tablist" aria-label="Record filters">
        {filters.map((f, i) => (
          <button
            key={f.id}
            type="button"
            data-filter-btn={f.id}
            onClick={() => apply(f.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] transition-all ${
              i === 0 ? 'border-[var(--brand)] bg-[var(--brand)] text-white' : 'border-[var(--glass-border)] bg-white/70 text-[var(--muted-text)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
