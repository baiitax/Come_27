'use client';

import { useTransition } from 'react';

export function UserRow({ id, active, self }: { id: string; active: boolean; self: boolean }) {
  const [pending, start] = useTransition();
  if (self) return <span className="text-[0.62rem] font-bold uppercase text-[#98A2B3]">you</span>;
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(async () => {
        const res = await fetch(`/api/admin/users/${id}/toggle`, { method: 'POST' });
        if (res.status === 401) window.location.href = '/admin/login?reason=expired';
      })}
      className="rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] transition hover:bg-[rgba(16,24,40,0.04)] hover:text-[#172033]"
    >
      {active ? 'Deactivate' : 'Activate'}
    </button>
  );
}
