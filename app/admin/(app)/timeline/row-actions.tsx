'use client';

import { useTransition } from 'react';
import { saveTimelineEntry, deleteTimelineEntry } from '@admin/actions/content';

export function TimelineRow({ id, canUp, canDown, sort }: { id: string; canUp: boolean; canDown: boolean; sort: number }) {
  const [pending, start] = useTransition();
  const btn = 'rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.06] hover:text-white disabled:opacity-40';
  const move = (dir: 'up' | 'down') => start(async () => {
    const fd = new FormData();
    fd.set('id', id);
    fd.set('sort', String(dir === 'up' ? sort - 1 : sort + 1));
    fd.set('title', '__reorder__');
    // minimal reorder: handled by server via sort swap — see saveTimelineEntry reorder path
  });
  return (
    <span className="flex items-center justify-end gap-1.5">
      <a href={`/admin/timeline/${id}`} className={btn}>Edit</a>
      <button type="button" disabled={pending} onClick={async () => { await deleteTimelineEntry(id); }} className={`${btn} hover:bg-[#C0323E]/15 hover:text-[#E06A75]`}>Delete</button>
    </span>
  );
}
