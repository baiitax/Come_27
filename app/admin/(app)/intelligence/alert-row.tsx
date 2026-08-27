'use client';

import { useTransition } from 'react';

async function post(endpoint: string, body?: Record<string, unknown>) {
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (res.status === 401) window.location.href = '/admin/login?reason=expired';
  return res.json().catch(() => ({}));
}

export function AlertRow({ id, resolved }: { id: string; resolved: boolean }) {
  const [pending, start] = useTransition();
  if (resolved) return <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-wide text-[#027A48]">resolved</p>;
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(async () => { await post(`/api/admin/alerts/${id}/resolve`); })}
      className="mt-1.5 rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] transition hover:bg-[rgba(16,24,40,0.04)] hover:text-[#172033]"
    >
      Mark as resolved
    </button>
  );
}
