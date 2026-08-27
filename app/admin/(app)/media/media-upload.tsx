'use client';

import React, { useRef, useState, useTransition } from 'react';
import { uploadMedia, saveAlbum } from '@admin/actions/media';

export function MediaUpload({ albums }: { albums: { id: string; name: string }[] }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<string>();
  const [albumName, setAlbumName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-5">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f && inputRef.current) {
            const dt = new DataTransfer();
            dt.items.add(f);
            inputRef.current.files = dt.files;
            submit();
          }
        }}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.15] bg-white/[0.02] px-6 py-10 text-center transition-colors hover:border-[#C9A24B]/50"
        onClick={() => inputRef.current?.click()}
      >
        <p className="font-display text-sm font-bold text-white">Drag & drop or click to upload</p>
        <p className="mt-1 text-xs text-[#8A968E]">JPG · PNG · WEBP · GIF · MP4 · WEBM · MP3 · PDF · DOC — max 15MB. SVG is rejected for security.</p>
        <input ref={inputRef} name="file" type="file" className="hidden" onChange={submit} />
      </div>

      {error && <p className="mt-3 text-sm text-[#E06A75]">{error}</p>}
      {result && <p className="mt-3 text-sm text-[#4CC39A]">Uploaded: {result}</p>}

      <form
        className="mt-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const fd = new FormData(e.currentTarget);
            const res = await saveAlbum(undefined, fd);
            if (res && 'error' in res && res.error) setError(res.error);
            else { setAlbumName(''); setError(undefined); }
          });
        }}
      >
        <label className="flex-1">
          <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#8A968E]">New album</span>
          <input name="name" value={albumName} onChange={(e) => setAlbumName(e.target.value)} required className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3 py-2 text-sm text-white" />
        </label>
        <button type="submit" disabled={pending || !albumName} className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2 text-xs font-bold text-white">
          Create album
        </button>
      </form>

      <input type="hidden" name="_albums" value={albums.length} />
    </div>
  );

  function submit() {
    if (!inputRef.current?.files?.[0]) return;
    const fd = new FormData();
    fd.append('file', inputRef.current.files[0]);
    setResult(undefined);
    setError(undefined);
    start(async () => {
      const res = await uploadMedia(undefined, fd);
      if (res && 'error' in res && res.error) setError(res.error);
      else if (res) setResult(String((res as { path?: string }).path ?? 'ok'));
    });
  }
}
