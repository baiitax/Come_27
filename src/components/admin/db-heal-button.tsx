'use client';

import React, { useState, useTransition } from 'react';

type Report = {
  ok: boolean;
  reachable: boolean;
  schemaPresent: boolean;
  migrated: boolean;
  seeded: boolean;
  users: number;
  detail: string;
};

export function DbHealButton() {
  const [busy, startTransition] = useTransition();
  const [report, setReport] = useState<Report | null>(null);

  async function run() {
    setReport(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/db/heal', { method: 'POST' });
        const data = await res.json().catch(() => null);
        if (data && typeof data === 'object' && 'ok' in data) setReport(data as Report);
        else setReport({ ok: false, reachable: false, schemaPresent: false, migrated: false, seeded: false, users: 0, detail: data?.error ?? 'Request failed.' });
      } catch {
        setReport({ ok: false, reachable: false, schemaPresent: false, migrated: false, seeded: false, users: 0, detail: 'Request failed.' });
      }
    });
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Database self-heal</p>
          <p className="mt-1 text-xs leading-relaxed text-[#8A968E]">
            If the database is fresh or empty (e.g. a newly attached Vercel Postgres), this applies the
            migration and seeds the demo content automatically — no CLI needed.
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={run}
          className="shrink-0 rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2 text-xs font-bold text-white shadow-[0_8px_20px_rgba(11,107,69,0.3)] disabled:opacity-50"
        >
          {busy ? 'Running…' : 'Self-heal now'}
        </button>
      </div>
      {report && (
        <div className={`mt-3 rounded-lg border px-3 py-2 text-xs ${report.ok ? 'border-[rgba(18,183,106,0.35)] bg-[rgba(18,183,106,0.08)] text-[#4CC39A]' : 'border-[rgba(240,68,56,0.35)] bg-[rgba(240,68,56,0.08)] text-[#E06A75]'}`}>
          <p className="font-semibold">{report.ok ? 'Database operational.' : 'Database not operational.'} {report.detail}</p>
          <p className="mt-1 text-[0.65rem] opacity-80">
            reachable: {report.reachable ? 'yes' : 'no'} · schema: {report.schemaPresent ? 'present' : 'missing'} ·
            migrated: {report.migrated ? 'yes' : 'no'} · seeded: {report.seeded ? 'yes' : 'no'} · users: {report.users}
          </p>
        </div>
      )}
    </div>
  );
}
