'use client';

import Link from 'next/link';

export function AuditFilter({ actions }: { actions: string[] }) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5 px-5 pt-4">
      <Link href="/admin/audit" className="rounded-full border border-[rgba(16,24,40,0.1)] px-3 py-1 text-[0.62rem] font-bold uppercase text-[#667085] hover:bg-[rgba(16,24,40,0.04)]">All</Link>
      {actions.map((a) => (
        <Link key={a} href={`/admin/audit?action=${a}`} className="rounded-full border border-[rgba(16,24,40,0.1)] px-3 py-1 text-[0.62rem] font-bold uppercase text-[#667085] hover:bg-[rgba(16,24,40,0.04)] hover:text-white">{a}</Link>
      ))}
    </div>
  );
}
