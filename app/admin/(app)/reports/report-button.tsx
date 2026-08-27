'use client';

import { useTransition } from 'react';
import { useState } from 'react';

export function ReportButton({ kind, label, desc }: { kind: 'daily' | 'weekly' | 'monthly'; label: string; desc: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          setError(undefined);
          const res = await fetch('/api/admin/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind }) });
          if (res.status === 401) window.location.href = '/admin/login?reason=expired';
          if (!res.ok) setError((await res.json().catch(() => ({}))).error || 'Unable to generate report.');
        })
      }
      className="flex-1 rounded-xl border border-[rgba(16,24,40,0.06)] bg-white/70 px-5 py-4 text-left transition-colors hover:border-[#C9A24B]/40 min-w-[220px]"
    >
      <p className="font-display text-sm font-bold text-[#172033]">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#667085]">{desc}</p>
      <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-wide text-[#9C7427]">
        {pending ? 'Generating…' : error ? error : 'Generate →'}
      </p>
    </button>
  );
}
