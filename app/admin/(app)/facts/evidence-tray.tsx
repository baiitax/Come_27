'use client';

import React, { useState, useTransition } from 'react';
import { Badge } from '@/components/admin/ui';

type AddFn = (state: unknown, fd: FormData) => Promise<{ ok: boolean; error?: string }>;
type RemoveFn = (id: string) => Promise<unknown>;

export function EvidenceTray({
  claimId,
  evidence,
  sources,
  canEdit,
  onAdd,
  onRemove,
}: {
  claimId: string;
  evidence: { id: string; type: string; title: string; notes: string }[];
  sources: { id: string; title: string }[];
  canEdit: boolean;
  onAdd: AddFn;
  onRemove: RemoveFn;
}) {
  const [pending, start] = useTransition();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <div>
      {evidence.length > 0 && (
        <ul className="divide-y divide-white/[0.05]">
          {evidence.map((e) => (
            <li key={e.id} className="flex items-center gap-3 px-5 py-3">
              <Badge tone={e.type === 'official-record' ? 'green' : e.type === 'url' ? 'blue' : 'gold'}>{e.type}</Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{e.title}</p>
                {e.notes && <p className="truncate text-xs text-[#5E6A63]">{e.notes}</p>}
              </div>
              {canEdit && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => start(() => onRemove(e.id))}
                  className="rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-[#C0323E]/15 hover:text-[#E06A75]"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {canEdit &&
        (adding ? (
          <form
            className="flex flex-wrap items-end gap-2 border-t border-white/[0.05] px-5 py-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError(undefined);
              const fd = new FormData(e.currentTarget);
              fd.set('claimId', claimId);
              start(async () => {
                const res = await onAdd(undefined, fd);
                if (res && res.error) setError(res.error);
                else setAdding(false);
              });
            }}
          >
            <label className="flex-1">
              <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#8A968E]">Type</span>
              <select name="type" className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3 py-2 text-sm text-white">
                {['url', 'document', 'pdf', 'image', 'official-record', 'statement', 'archived'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="flex-1">
              <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#8A968E]">Title</span>
              <input name="title" required className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3 py-2 text-sm text-white" />
            </label>
            <label className="flex-1">
              <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#8A968E]">URL</span>
              <input name="url" placeholder="https://" className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3 py-2 text-sm text-white" />
            </label>
            <label className="flex-1">
              <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#8A968E]">Source</span>
              <select name="sourceId" className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3 py-2 text-sm text-white">
                <option value="">— none —</option>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </label>
            {error && <p className="w-full text-xs text-[#E06A75]">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={pending} className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2 text-xs font-bold text-white">Add</button>
              <button type="button" onClick={() => setAdding(false)} className="rounded-lg border border-white/[0.1] px-3 py-2 text-xs font-bold text-[#9AA39C]">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="border-t border-white/[0.05] px-5 py-3">
            <button type="button" onClick={() => setAdding(true)} className="rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.06] hover:text-white">
              + Add evidence
            </button>
          </div>
        ))}
    </div>
  );
}
