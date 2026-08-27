'use client';

import { useTransition } from 'react';
import { toggleSection, moveSection } from '@admin/actions/site';

interface Section {
  id: string;
  key: string;
  title: string;
  enabled: boolean;
  sort: number;
}

export function SectionManager({ sections }: { sections: Section[] }) {
  const [pending, start] = useTransition();
  const btn = 'rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.06] hover:text-white disabled:opacity-40';

  return (
    <ul className="divide-y divide-white/[0.05]">
      {sections.map((s, i) => (
        <li key={s.id} className={`flex items-center gap-3 px-5 py-3 ${s.enabled ? '' : 'opacity-50'}`}>
          <span className="w-6 font-display text-xs font-bold text-[#5E6A63]">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{s.title}</p>
            <p className="text-[0.65rem] uppercase tracking-wide text-[#5E6A63]">{s.key}</p>
          </div>
          <span className={`h-2 w-2 rounded-full ${s.enabled ? 'bg-[#4CC39A]' : 'bg-[#5E6A63]'}`} aria-hidden />
          <button type="button" disabled={pending || i === 0} onClick={() => start(() => moveSection(s.id, 'up'))} className={btn} aria-label="Move up">
            ↑
          </button>
          <button type="button" disabled={pending || i === sections.length - 1} onClick={() => start(() => moveSection(s.id, 'down'))} className={btn} aria-label="Move down">
            ↓
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => start(() => toggleSection(s.id))}
            className={`${btn} ${s.enabled ? 'hover:bg-[#0E8A5A]/15 hover:text-[#4CC39A]' : 'hover:bg-[#C9A24B]/15 hover:text-[#DDBE72]'}`}
          >
            {s.enabled ? 'Enabled' : 'Hidden'}
          </button>
        </li>
      ))}
    </ul>
  );
}
