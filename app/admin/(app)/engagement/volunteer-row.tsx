'use client';

import { useTransition } from 'react';
import { useState } from 'react';

const STATUSES = ['pending', 'active', 'on-leave', 'declined'];

async function post(endpoint: string, body: Record<string, unknown>) {
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (res.status === 401) window.location.href = '/admin/login?reason=expired';
  return res.json().catch(() => ({}));
}

export function VolunteerRow({ id, status, canManage }: { id: string; status: string; canManage: boolean }) {
  const [pending, start] = useTransition();
  if (!canManage) return null;
  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => start(async () => { await post(`/api/admin/volunteers/${id}`, { status: e.target.value }); })}
      className="rounded-md border border-[rgba(16,24,40,0.1)] bg-white px-1.5 py-1 text-[0.65rem] font-bold text-[#364152]"
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
