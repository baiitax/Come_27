'use client';

import React, { useState } from 'react';

const TONES: Record<string, { chip: string; dot: string; label: string }> = {
  verified: { chip: 'bg-[rgba(18,183,106,0.1)] text-[#027A48] border-[rgba(18,183,106,0.3)]', dot: 'bg-[#12B76A]', label: 'Verified' },
  'official-record': { chip: 'bg-[rgba(46,144,250,0.1)] text-[#175CD3] border-[rgba(46,144,250,0.3)]', dot: 'bg-[#2E90FA]', label: 'Official Record' },
  reported: { chip: 'bg-[rgba(247,144,9,0.12)] text-[#B54708] border-[rgba(247,144,9,0.35)]', dot: 'bg-[#F79009]', label: 'Reported' },
  'campaign-claim': { chip: 'bg-[rgba(124,58,237,0.08)] text-[#6936CC] border-[rgba(124,58,237,0.25)]', dot: 'bg-[#7C3AED]', label: 'Campaign Claim' },
  proposed: { chip: 'bg-[rgba(102,112,133,0.1)] text-[#475467] border-[rgba(102,112,133,0.25)]', dot: 'bg-[#667085]', label: 'Proposed' },
  'under-review': { chip: 'bg-[rgba(240,68,56,0.08)] text-[#B54708] border-[rgba(240,68,56,0.3)]', dot: 'bg-[#F04438]', label: 'Under Review' },
  disputed: { chip: 'bg-[rgba(166,27,27,0.08)] text-[#A61B1B] border-[rgba(166,27,27,0.3)]', dot: 'bg-[#A61B1B]', label: 'Disputed' },
  archived: { chip: 'bg-[rgba(152,162,179,0.12)] text-[#667085] border-[rgba(152,162,179,0.35)]', dot: 'bg-[#98A2B3]', label: 'Archived' },
};

export function EvidenceBadge({
  status,
  source,
  verifiedDate,
  notes,
  className = '',
}: {
  status: string;
  source?: string;
  verifiedDate?: string | Date | null;
  notes?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const tone = TONES[status] ?? TONES['under-review'];

  return (
    <span className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.08em] transition-all ${tone.chip} ${source ? 'cursor-pointer hover:shadow-sm' : ''}`}
      >
        <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
        {tone.label}
        {source && <span aria-hidden className="text-[0.55rem] opacity-70">{open ? '▴' : '▾'}</span>}
      </button>

      {open && source && (
        <span className="glass-static absolute z-30 mt-2 block w-72 rounded-2xl p-4 text-left shadow-[0_18px_50px_rgba(23,32,51,0.18)]" style={{ position: 'absolute' as never }}>
          <span className="block text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-2)]">Evidence details</span>
          <span className="mt-2 block text-sm font-semibold text-[var(--white)]">{tone.label}</span>
          <span className="mt-2 block text-xs text-[var(--muted-text)]">
            <span className="font-semibold text-[var(--white)]">Source:</span> {source}
          </span>
          {verifiedDate && (
            <span className="mt-1 block text-xs text-[var(--muted-text)]">
              <span className="font-semibold text-[var(--white)]">Last verified:</span>{' '}
              {verifiedDate instanceof Date ? verifiedDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : verifiedDate}
            </span>
          )}
          {notes && <span className="mt-2 block text-xs leading-relaxed text-[var(--muted-text)]">{notes}</span>}
        </span>
      )}
    </span>
  );
}
