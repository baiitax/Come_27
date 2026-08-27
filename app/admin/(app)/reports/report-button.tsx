'use client';

import { useTransition } from 'react';
import { generateReport } from '@admin/actions/system';

export function ReportButton({ kind, label, desc }: { kind: 'daily' | 'weekly' | 'monthly'; label: string; desc: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => generateReport(kind))}
      className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 text-left transition-colors hover:border-[#C9A24B]/40 min-w-[220px]"
    >
      <p className="font-display text-sm font-bold text-white">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-[#8A968E]">{desc}</p>
      <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-wide text-[#C9A24B]">{pending ? 'Generating…' : 'Generate →'}</p>
    </button>
  );
}
