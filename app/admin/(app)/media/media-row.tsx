'use client';

import React, { useState, useTransition } from 'react';
import { updateAssetMeta, deleteAsset } from '@admin/actions/media';
import { Badge, DemoTag } from '@/components/admin/ui';

type Asset = { id: string; filename: string; path: string; kind: string; size: number; altText: string; copyright: string; source: string; tags: string[]; isDemo: boolean; createdAt: string };

const KIND_ICON: Record<string, string> = { image: '🖼', video: '🎬', audio: '🎧', pdf: '📄', document: '📄' };

export function MediaRow({ asset, canManage }: { asset: Asset; canManage?: boolean }) {
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string>();
  const fmt = (b: number) => (b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.ceil(b / 1024) + ' KB');

  return (
    <li className="flex items-center gap-4 px-5 py-3.5">
      {asset.kind === 'image' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset.path} alt={asset.altText || asset.filename} className="h-12 w-12 rounded-lg border border-white/[0.08] object-cover" />
      ) : (
        <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-lg">{KIND_ICON[asset.kind] ?? '📎'}</span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{asset.filename}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[0.65rem] text-[#8A968E]">
          <Badge tone={asset.kind === 'image' ? 'green' : asset.kind === 'video' ? 'blue' : 'gold'}>{asset.kind}</Badge>
          <span>{fmt(asset.size)}</span>
          <span>{new Date(asset.createdAt).toDateString()}</span>
          {asset.tags.map((t) => <span key={t} className="rounded bg-white/[0.05] px-1.5 py-0.5">#{t}</span>)}
          {asset.isDemo && <DemoTag />}
          {!asset.altText && asset.kind === 'image' && <span className="text-[#DDBE72]">⚠ missing alt text</span>}
        </p>
      </div>

      {canManage && (editing ? (
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              const res = await updateAssetMeta(undefined, fd);
              if (res && 'ok' in res && res.ok) setEditing(false);
            });
          }}
        >
          <input type="hidden" name="id" value={asset.id} />
          <label>
            <span className="mb-0.5 block text-[0.55rem] font-bold uppercase text-[#8A968E]">Alt text</span>
            <input name="altText" defaultValue={asset.altText} className="w-44 rounded-md border border-white/[0.09] bg-[#0D1114] px-2 py-1.5 text-xs text-white" />
          </label>
          <label>
            <span className="mb-0.5 block text-[0.55rem] font-bold uppercase text-[#8A968E]">Copyright</span>
            <input name="copyright" defaultValue={asset.copyright} className="w-36 rounded-md border border-white/[0.09] bg-[#0D1114] px-2 py-1.5 text-xs text-white" />
          </label>
          <label>
            <span className="mb-0.5 block text-[0.55rem] font-bold uppercase text-[#8A968E]">Source</span>
            <input name="source" defaultValue={asset.source} className="w-36 rounded-md border border-white/[0.09] bg-[#0D1114] px-2 py-1.5 text-xs text-white" />
          </label>
          <label>
            <span className="mb-0.5 block text-[0.55rem] font-bold uppercase text-[#8A968E]">Tags</span>
            <input name="tags" defaultValue={asset.tags.join(', ')} className="w-40 rounded-md border border-white/[0.09] bg-[#0D1114] px-2 py-1.5 text-xs text-white" />
          </label>
          <button type="submit" disabled={pending} className="rounded-md bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-3 py-1.5 text-[0.65rem] font-bold text-white">Save</button>
          <button type="button" onClick={() => setEditing(false)} className="rounded-md border border-white/[0.1] px-2 py-1.5 text-[0.65rem] font-bold text-[#9AA39C]">✕</button>
        </form>
      ) : (
        <span className="flex items-center gap-1.5">
          <button type="button" onClick={() => setEditing(true)} className="rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.06] hover:text-white">Meta</button>
          <button
            type="button"
            disabled={pending}
            onClick={() => start(() => deleteAsset(asset.id))}
            className="rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-[#C0323E]/15 hover:text-[#E06A75]"
          >
            Delete
          </button>
        </span>
      ))}
    </li>
  );
}
