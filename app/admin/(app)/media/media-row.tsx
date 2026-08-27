'use client';

import React, { useState, useTransition } from 'react';
import { Badge, DemoTag } from '@/components/admin/ui';

type Asset = { id: string; filename: string; path: string; kind: string; size: number; altText: string; copyright: string; source: string; tags: string[]; isDemo: boolean; createdAt: string };

const KIND_ICON: Record<string, string> = { image: '🖼', video: '🎬', audio: '🎧', pdf: '📄', document: '📄' };

async function post(endpoint: string, body?: Record<string, unknown>) {
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (res.status === 401) window.location.href = '/admin/login?reason=expired';
  return res.json().catch(() => ({}));
}

const fmt = (b: number) => (b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.ceil(b / 1024) + ' KB');

export function MediaRow({ asset, canManage }: { asset: Asset; canManage?: boolean }) {
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const inputCls = 'w-40 rounded-md border border-[rgba(16,24,40,0.1)] bg-white px-2 py-1.5 text-xs text-[#172033]';

  return (
    <li className="flex items-center gap-4 px-5 py-3.5">
      {asset.kind === 'image' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset.path} alt={asset.altText || asset.filename} className="h-12 w-12 rounded-lg border border-[rgba(16,24,40,0.08)] object-cover" />
      ) : (
        <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[rgba(16,24,40,0.08)] bg-white text-lg">{KIND_ICON[asset.kind] ?? '📎'}</span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#172033]">{asset.filename}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[0.65rem] text-[#667085]">
          <Badge tone={asset.kind === 'image' ? 'green' : asset.kind === 'video' ? 'blue' : 'gold'}>{asset.kind}</Badge>
          <span>{fmt(asset.size)}</span>
          <span>{new Date(asset.createdAt).toDateString()}</span>
          {asset.tags.map((t) => <span key={t} className="rounded bg-[rgba(16,24,40,0.04)] px-1.5 py-0.5">#{t}</span>)}
          {asset.isDemo && <DemoTag />}
          {!asset.altText && asset.kind === 'image' && <span className="text-[#B54708]">⚠ missing alt text</span>}
        </p>
      </div>

      {canManage && (editing ? (
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await post(`/api/admin/media/${asset.id}`, {
                altText: String(fd.get('altText') ?? ''),
                copyright: String(fd.get('copyright') ?? ''),
                source: String(fd.get('source') ?? ''),
                tags: String(fd.get('tags') ?? ''),
              });
              setEditing(false);
            });
          }}
        >
          <label><span className="mb-0.5 block text-[0.55rem] font-bold uppercase text-[#667085]">Alt text</span><input name="altText" defaultValue={asset.altText} className={inputCls} /></label>
          <label><span className="mb-0.5 block text-[0.55rem] font-bold uppercase text-[#667085]">Copyright</span><input name="copyright" defaultValue={asset.copyright} className={inputCls} /></label>
          <label><span className="mb-0.5 block text-[0.55rem] font-bold uppercase text-[#667085]">Source</span><input name="source" defaultValue={asset.source} className={inputCls} /></label>
          <label><span className="mb-0.5 block text-[0.55rem] font-bold uppercase text-[#667085]">Tags</span><input name="tags" defaultValue={asset.tags.join(', ')} className={inputCls} /></label>
          <button type="submit" disabled={pending} className="rounded-md bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-3 py-1.5 text-[0.65rem] font-bold text-white">Save</button>
          <button type="button" onClick={() => setEditing(false)} className="rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1.5 text-[0.65rem] font-bold text-[#667085]">✕</button>
        </form>
      ) : (
        <span className="flex items-center gap-1.5">
          <button type="button" onClick={() => setEditing(true)} className="rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] hover:bg-[rgba(16,24,40,0.04)] hover:text-[#172033]">Meta</button>
          <button
            type="button"
            disabled={pending}
            onClick={() => start(async () => { await post(`/api/admin/media/${asset.id}/delete`); })}
            className="rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] hover:text-[#B42318]"
          >
            Delete
          </button>
        </span>
      ))}
    </li>
  );
}
