'use client';

import Link from 'next/link';

export function AuditFilter({ actions }: { actions: string[] }) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5 px-5 pt-4">
      <Link href="/admin/audit" className="rounded-full border border-white/[0.1] px-3 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.05]">All</Link>
      {actions.map((a) => (
        <Link key={a} href={`/admin/audit?action=${a}`} className="rounded-full border border-white/[0.1] px-3 py-1 text-[0.62rem] font-bold uppercase text-[#9AA39C] hover:bg-white/[0.05] hover:text-white">{a}</Link>
      ))}
    </div>
  );
}
