'use client';

import React, { useState, useTransition } from 'react';
import { Badge } from '@/components/admin/ui';

type Ev = { id: string; type: string; title: string; notes: string };
type Src = { id: string; title: string };

async function post(endpoint: string, body: Record<string, unknown>) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.status === 401) window.location.href = '/admin/login?reason=expired';
  return res.json().catch(() => ({}));
}

export function EvidenceTray({ claimId, evidence, sources }: { claimId: string; evidence: Ev[]; sources: Src[] }) {
  const [pending, start] = useTransition();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string>();
  const [type, setType] = useState('url');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [sourceId, setSourceId] = useState('');

  const tone = (t: string) => (t === 'official-record' ? 'green' : t === 'url' ? 'blue' : 'gold') as 'green' | 'blue' | 'gold';

  return (
    <div>
      {evidence.length > 0 && (
        <ul className="divide-y divide-[rgba(16,24,40,0.06)]">
          {evidence.map((e) => (
            <li key={e.id} className="flex items-center gap-3 px-5 py-3">
              <Badge tone={tone(e.type)}>{e.type}</Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#172033]">{e.title}</p>
                {e.notes && <p className="truncate text-xs text-[#98A2B3]">{e.notes}</p>}
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => start(async () => { await post(`/api/admin/evidence/${e.id}/remove`, {}); })}
                className="rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] hover:text-[#B42318]"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <form
          className="flex flex-wrap items-end gap-2 border-t border-[rgba(16,24,40,0.06)] px-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            start(async () => {
              const res = await post('/api/admin/evidence', { claimId, type, title, url, sourceId: sourceId || null });
              if (res.error) setError(res.error);
              else setAdding(false);
            });
          }}
        >
          <label>
            <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#667085]">Type</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3 py-2 text-sm text-[#172033]">
              {['url', 'document', 'pdf', 'image', 'official-record', 'statement', 'archived'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex-1">
            <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#667085]">Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3 py-2 text-sm text-[#172033]" />
          </label>
          <label className="flex-1">
            <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#667085]">URL</span>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" className="w-full rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3 py-2 text-sm text-[#172033]" />
          </label>
          <label>
            <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#667085]">Source</span>
            <select value={sourceId} onChange={(e) => setSourceId(e.target.value)} className="rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3 py-2 text-sm text-[#172033]">
              <option value="">— none —</option>
              {sources.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </label>
          {error && <p className="w-full text-xs text-[#B42318]">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2 text-xs font-bold text-white">Add</button>
            <button type="button" onClick={() => setAdding(false)} className="rounded-lg border border-[rgba(16,24,40,0.1)] px-3 py-2 text-xs font-bold text-[#667085]">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="border-t border-[rgba(16,24,40,0.06)] px-5 py-3">
          <button type="button" onClick={() => setAdding(true)} className="rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] hover:bg-[rgba(16,24,40,0.04)] hover:text-[#172033]">+ Add evidence</button>
        </div>
      )}
    </div>
  );
}
