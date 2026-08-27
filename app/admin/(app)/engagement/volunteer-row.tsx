'use client';

import { useTransition } from 'react';
import { setVolunteerStatus } from '@admin/actions/engagement';

const STATUSES = ['pending', 'active', 'on-leave', 'declined'];

export function VolunteerRow({ id, status, canManage }: { id: string; status: string; canManage: boolean }) {
  const [pending, start] = useTransition();
  if (!canManage) return null;
  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => start(() => setVolunteerStatus(id, e.target.value as never))}
      className="rounded-md border border-white/[0.1] bg-[#0D1114] px-1.5 py-1 text-[0.65rem] font-bold text-[#C8CFC9]"
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
