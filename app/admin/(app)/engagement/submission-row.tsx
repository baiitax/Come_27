'use client';

import React, { useState, useTransition } from 'react';

const STATUSES = ['new', 'acknowledged', 'under-review', 'assigned', 'responded', 'resolved', 'archived'];

async function post(endpoint: string, body: Record<string, unknown>) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.status === 401) window.location.href = '/admin/login?reason=expired';
  return res.json().catch(() => ({}));
}

export function SubmissionRow(props: {
  id: string; status: string; priority: string; assignedTo: string; response: string; internalNotes: string; canRespond: boolean; canDelete: boolean;
}) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const btn = 'rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] transition hover:bg-[rgba(16,24,40,0.04)] hover:text-[#172033] disabled:opacity-40';

  return (
    <div className={open ? 'flex justify-end' : 'flex items-center justify-end gap-1.5'}>
      <select
        value={props.status}
        disabled={!props.canRespond || pending}
        onChange={(e) => start(async () => { await post(`/api/admin/submissions/${props.id}`, { status: e.target.value }); })}
        className="rounded-md border border-[rgba(16,24,40,0.1)] bg-white px-1.5 py-1 text-[0.65rem] font-bold text-[#364152]"
      >
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      {props.canRespond && (
        <button type="button" onClick={() => setOpen((v) => !v)} className={btn}>{open ? 'Close' : 'Respond'}</button>
      )}
      {props.canDelete && (
        <button
          type="button"
          disabled={pending}
          onClick={() => start(async () => { await post(`/api/admin/submissions/${props.id}`, { status: 'archived' }); })}
          className={`${btn} hover:text-[#B42318]`}
        >
          Archive
        </button>
      )}
      {open && (
        <form
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(23,32,51,0.4)] p-4 backdrop-blur-sm"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await post(`/api/admin/submissions/${props.id}`, {
                response: String(fd.get('response') ?? ''),
                assignedTo: String(fd.get('assignedTo') ?? ''),
                priority: String(fd.get('priority') ?? 'normal'),
                internalNotes: String(fd.get('internalNotes') ?? ''),
              });
              setOpen(false);
            });
          }}
        >
          <div className="w-full max-w-lg rounded-2xl border border-white bg-white p-5 shadow-2xl">
            <p className="font-display text-sm font-bold text-[#172033]">Respond to submission</p>
            <input type="hidden" name="id" value={props.id} />
            <label className="mt-4 block">
              <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#667085]">Public response</span>
              <textarea name="response" defaultValue={props.response} rows={4} className="w-full rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3 py-2 text-sm text-[#172033]" placeholder="What will the campaign do about this?" />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label>
                <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#667085]">Assigned officer</span>
                <input name="assignedTo" defaultValue={props.assignedTo} className="w-full rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3 py-2 text-sm text-[#172033]" />
              </label>
              <label>
                <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#667085]">Priority</span>
                <select name="priority" defaultValue={props.priority} className="w-full rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3 py-2 text-sm text-[#172033]">
                  {['low', 'normal', 'high'].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
            </div>
            <label className="mt-3 block">
              <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#667085]">Internal notes (never public)</span>
              <textarea name="internalNotes" defaultValue={props.internalNotes} rows={2} className="w-full rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3 py-2 text-sm text-[#172033]" />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-[rgba(16,24,40,0.1)] px-3 py-2 text-xs font-bold text-[#667085]">Cancel</button>
              <button type="submit" disabled={pending} className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2 text-xs font-bold text-white">Save & respond</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
