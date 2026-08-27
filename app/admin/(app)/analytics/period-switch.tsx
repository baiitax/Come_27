'use client';

import Link from 'next/link';

export function PeriodSwitch({ days, tab }: { days: number; tab?: string }) {
  return (
    <div className="flex rounded-lg border border-[rgba(16,24,40,0.1)] p-0.5">
      {[1, 7, 30, 90].map((d) => (
        <Link key={d} href={`/admin/analytics?d=${d}${tab ? `&tab=${tab}` : ''}`} className={`rounded-md px-3 py-1.5 text-[0.68rem] font-bold ${days === d ? 'bg-[rgba(16,24,40,0.03)] text-white' : 'text-[#667085] hover:text-white'}`}>
          {d === 1 ? 'Today' : `${d}d`}
        </Link>
      ))}
    </div>
  );
}
