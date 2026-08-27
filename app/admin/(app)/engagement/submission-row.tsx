'use client';

import React, { useState, useTransition } from 'react';
import { setSubmissionStatus, respondToSubmission, deleteSubmission } from '@admin/actions/engagement';

const STATUSES = ['new', 'acknowledged', 'under-review', 'assigned', 'responded', 'resolved', 'archived'];

export function SubmissionRow(props: {
  id: string;
  status: string;
  priority: string;
  assignedTo: string;
  response: string;
  internalNotes: string;
  canRespond: boolean;
  canDelete: boolean;
}) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const btn = 'rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.06] hover:text-white disabled:opacity-40';

  return (
    <div className={open ? 'flex justify-end' : 'flex items-center justify-end gap-1.5'}>
      <select
        value={props.status}
        disabled={!props.canRespond || pending}
        onChange={(e) => start(() => setSubmissionStatus(props.id, e.target.value as never))}
        className="rounded-md border border-white/[0.1] bg-[#0D1114] px-1.5 py-1 text-[0.65rem] font-bold text-[#C8CFC9]"
      >
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      {props.canRespond && (
        <button type="button" onClick={() => setOpen((v) => !v)} className={btn}>
          {open ? 'Close' : 'Respond'}
        </button>
      )}
      {props.canDelete && (
        <button type="button" disabled={pending} onClick={() => start(() => deleteSubmission(props.id))} className={`${btn} hover:bg-[#C0323E]/15 hover:text-[#E06A75]`}>
          Del
        </button>
      )}
      {open && (
        <form
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await respondToSubmission(undefined, fd);
              setOpen(false);
            });
          }}
        >
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#12161A] p-5">
            <p className="font-display text-sm font-bold text-white">Respond to submission</p>
            <input type="hidden" name="id" value={props.id} />
            <label className="mt-4 block">
              <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#8A968E]">Public response</span>
              <textarea name="response" defaultValue={props.response} rows={4} className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3 py-2 text-sm text-white" placeholder="What will the campaign do about this?" />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label>
                <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#8A968E]">Assigned officer</span>
                <input name="assignedTo" defaultValue={props.assignedTo} className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3 py-2 text-sm text-white" />
              </label>
              <label>
                <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#8A968E]">Priority</span>
                <select name="priority" defaultValue={props.priority} className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3 py-2 text-sm text-white">
                  {['low', 'normal', 'high'].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
            </div>
            <label className="mt-3 block">
              <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#8A968E]">Internal notes (never public)</span>
              <textarea name="internalNotes" defaultValue={props.internalNotes} rows={2} className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3 py-2 text-sm text-white" />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-white/[0.1] px-3 py-2 text-xs font-bold text-[#9AA39C]">Cancel</button>
              <button type="submit" disabled={pending} className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2 text-xs font-bold text-white">Save & respond</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
