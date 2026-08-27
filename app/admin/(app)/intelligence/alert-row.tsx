'use client';

import { useTransition } from 'react';
import { resolveAlert } from '@admin/actions/system';

export function AlertRow({ id, resolved }: { id: string; resolved: boolean }) {
  const [pending, start] = useTransition();
  if (resolved) return <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-wide text-[#4CC39A]">resolved</p>;
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => resolveAlert(id))}
      className="mt-1.5 rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.06] hover:text-white"
    >
      Mark as resolved
    </button>
  );
}
