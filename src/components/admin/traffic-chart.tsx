'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function TrafficChart({ data }: { data: { date: string; views: number; unique: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E8A5A" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#0E8A5A" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A24B" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#C9A24B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#5E6A63', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(d) => d.slice(5)} />
        <YAxis tick={{ fill: '#5E6A63', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: '#12161A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }}
          labelStyle={{ color: '#ECEDEA' }}
        />
        <Area type="monotone" dataKey="views" stroke="#0E8A5A" strokeWidth={2} fill="url(#gv)" name="Views" />
        <Area type="monotone" dataKey="unique" stroke="#C9A24B" strokeWidth={1.5} fill="url(#gu)" name="Unique sessions" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
