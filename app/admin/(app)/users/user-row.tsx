'use client';

import { useTransition } from 'react';
import { toggleUserActive } from '@admin/actions/system';

export function UserRow({ id, active, self }: { id: string; active: boolean; self: boolean }) {
  const [pending, start] = useTransition();
  if (self) return <span className="text-[0.62rem] font-bold uppercase text-[#5E6A63]">you</span>;
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => toggleUserActive(id))}
      className="rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.06] hover:text-white"
    >
      {active ? 'Deactivate' : 'Activate'}
    </button>
  );
}
