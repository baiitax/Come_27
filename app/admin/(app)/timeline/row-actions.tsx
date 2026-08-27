'use client';

import { useTransition } from 'react';
import Link from 'next/link';

export function TimelineRow({ id }: { id: string; canUp: boolean; canDown: boolean; sort: number }) {
  const [pending, start] = useTransition();
  const btn = 'rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] transition hover:bg-[rgba(16,24,40,0.04)] hover:text-[#172033] disabled:opacity-40';
  return (
    <span className="flex items-center justify-end gap-1.5">
      <Link href={`/admin/timeline/${id}`} className={btn}>Edit</Link>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => {
          const res = await fetch(`/api/admin/timeline/${id}/delete`, { method: 'POST' });
          if (res.status === 401) window.location.href = '/admin/login?reason=expired';
        })}
        className={`${btn} hover:text-[#B42318]`}
      >
        Delete
      </button>
    </span>
  );
}
