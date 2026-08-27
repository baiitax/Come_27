'use client';

import React, { useRef, useState, useTransition } from 'react';

export function MediaUpload({ albums }: { albums: { id: string; name: string }[] }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<string>();
  const [albumName, setAlbumName] = useState('');
  const [albumError, setAlbumError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    setResult(undefined);
    setError(undefined);
    start(async () => {
      const res = await fetch('/api/admin/media/upload', { method: 'POST', body: fd });
      if (res.status === 401) window.location.href = '/admin/login?reason=expired';
      const data = (await res.json().catch(() => ({}))) as { error?: string; path?: string };
      if (res.ok) setResult(data.path ?? 'ok');
      else setError(data.error || 'Upload failed. Try again.');
    });
  }

  return (
    <div className="p-5">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) submit(f);
        }}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[rgba(16,24,40,0.15)] bg-white/50 px-6 py-10 text-center transition-colors hover:border-[#0E8A5A]/50"
      >
        <p className="font-display text-sm font-bold text-[#172033]">Drag & drop or click to upload</p>
        <p className="mt-1 text-xs text-[#667085]">JPG · PNG · WEBP · GIF · MP4 · WEBM · MP3 · PDF · DOC — max 15MB. SVG is rejected for security.</p>
        <input ref={inputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) submit(f); }} />
      </div>

      {error && <p className="mt-3 text-sm text-[#B42318]">{error}</p>}
      {result && <p className="mt-3 text-sm text-[#027A48]">Uploaded: {result}</p>}

      <form
        className="mt-4 flex flex-wrap items-end gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setAlbumError(undefined);
          const res = await fetch('/api/admin/albums', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: albumName }),
          });
          if (res.status === 401) window.location.href = '/admin/login?reason=expired';
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          if (res.ok) setAlbumName('');
          else setAlbumError(data.error || 'Unable to create album.');
        }}
      >
        <label className="flex-1">
          <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wide text-[#667085]">New album</span>
          <input value={albumName} onChange={(e) => setAlbumName(e.target.value)} required className="w-full rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3 py-2 text-sm text-[#172033]" />
        </label>
        {albumError && <p className="text-xs text-[#B42318]">{albumError}</p>}
        <button type="submit" disabled={!albumName} className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2 text-xs font-bold text-white">
          Create album
        </button>
      </form>
    </div>
  );
}
