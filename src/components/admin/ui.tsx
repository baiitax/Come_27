'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ============================================================ tokens
export const A = {
  panel: 'rounded-xl border border-[rgba(16,24,40,0.08)] bg-white/75',
  panelHover: 'rounded-xl border border-[rgba(16,24,40,0.08)] bg-white/75 transition-colors hover:border-[rgba(16,24,40,0.1)]',
  input:
    'w-full rounded-lg border border-[rgba(16,24,40,0.08)] bg-white px-3.5 py-2.5 text-sm text-[#172033] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-[#C9A24B]/60 focus:ring-2 focus:ring-[#C9A24B]/20',
  btn: 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50',
  btnPrimary:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(11,107,69,0.35)] transition-all hover:brightness-110 hover:-translate-y-px',
  btnCrimson:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#C0323E,#8E1420)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(163,22,33,0.35)] transition-all hover:brightness-110 hover:-translate-y-px',
  btnGhost:
    'inline-flex items-center justify-center gap-2 rounded-lg border border-[rgba(16,24,40,0.1)] px-4 py-2.5 text-sm font-semibold text-[#364152] transition-colors hover:bg-[rgba(16,24,40,0.04)] hover:text-white',
};

// ============================================================ primitives
export function Card({ className = '', children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${A.panel} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardHead({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(16,24,40,0.08)] px-5 py-4">
      <div>
        <h3 className="font-display text-[0.95rem] font-bold tracking-wide text-white">{title}</h3>
        {sub && <p className="mt-0.5 text-xs text-[#667085]">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: 'green' | 'gold' | 'crimson' | 'blue' | 'neutral' | 'red' | 'slate';
  children: React.ReactNode;
  className?: string;
}) {
  const tones: Record<string, string> = {
    green: 'bg-[#0E8A5A]/15 text-[#027A48] border-[#0E8A5A]/30',
    gold: 'bg-[#C9A24B]/12 text-[#9C7427] border-[#C9A24B]/35',
    crimson: 'bg-[#A31621]/15 text-[#B42318] border-[#A31621]/40',
    red: 'bg-[#C0323E]/15 text-[#B42318] border-[#C0323E]/40',
    blue: 'bg-[#3B82F6]/10 text-[#2563EB] border-[#3B82F6]/30',
    neutral: 'bg-[rgba(16,24,40,0.04)] text-[#667085] border-[rgba(16,24,40,0.08)]',
    slate: 'bg-[#5E7168]/10 text-[#667085] border-[#5E7168]/25',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export { STATUS_TONE, statusTone, type Tone } from '@/lib/status-tone';

export function DemoTag() {
  return <Badge tone="gold">DEMO DATA</Badge>;
}

export function KpiCard({ label, value, change, spark = [], href, demo = false }: { label: string; value: string; change: number | null; spark?: number[]; href?: string; demo?: boolean }) {
  const inner = (
    <div className={`${A.panelHover} group relative h-full cursor-default p-4 ${href ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#667085]">{label}</p>
        {demo ? (
          <Badge tone="gold">demo</Badge>
        ) : change !== null ? (
          <span className={`text-[0.68rem] font-bold ${change >= 0 ? 'text-[#027A48]' : 'text-[#B42318]'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="font-display text-3xl font-extrabold tracking-tight text-white">{value}</p>
        {spark.length >= 2 && (
          <svg viewBox="0 0 60 24" className="h-6 w-14 shrink-0 opacity-80" aria-hidden>
            <polyline
              fill="none"
              stroke={change !== null && change < 0 ? '#E06A75' : '#C9A24B'}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={spark.map((v, i) => {
                const max = Math.max(...spark, 1);
                return `${(i / (spark.length - 1)) * 56 + 2},${22 - (v / max) * 18}`;
              }).join(' ')}
            />
          </svg>
        )}
      </div>
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function PageHeader({ title, sub, right, crumb }: { title: string; sub?: string; right?: React.ReactNode; crumb?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {crumb && <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#9C7427]">{crumb}</p>}
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-white md:text-[1.7rem]">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-sm text-[#667085]">{sub}</p>}
      </div>
      {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
    </div>
  );
}

// ============================================================ form helpers
export function Field({ label, hint, required, children, className = '' }: { label: string; hint?: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-baseline gap-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#667085]">
        {label}
        {required && <span className="text-[#B42318]">*</span>}
        {hint && <span className="normal-case tracking-normal text-[#98A2B3]">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${A.input} ${props.className ?? ''}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${A.input} min-h-[110px] leading-relaxed ${props.className ?? ''}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${A.input} appearance-none pr-8 ${props.className ?? ''}`} />;
}

export function Check({ label, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#364152]">
      <input type="checkbox" {...rest} className="h-4 w-4 rounded border-white/20 bg-white accent-[#0E8A5A]" />
      {label}
    </label>
  );
}

// ============================================================ tables
export function Table({ head, children, className = '' }: { head: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-[rgba(16,24,40,0.08)] text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#667085]">{head}</tr>
        </thead>
        <tbody className="divide-y divide-[rgba(16,24,40,0.06)]">{children}</tbody>
      </table>
    </div>
  );
}

export function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 ${className}`}>{children}</th>;
}

export function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle text-[#364152] ${className}`}>{children}</td>;
}

export function EmptyState({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(16,24,40,0.08)] bg-[rgba(16,24,40,0.03)] text-xl">◇</div>
      <p className="font-display text-sm font-bold text-white">{title}</p>
      {sub && <p className="mt-1 max-w-sm text-xs text-[#667085]">{sub}</p>}
    </div>
  );
}

// ============================================================ misc
export function DemoBanner() {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#C9A24B]/30 bg-[#C9A24B]/[0.07] px-4 py-2.5 text-xs text-[#9C7427]">
      <span aria-hidden>⚠</span> Some records below are <strong>DEMO data</strong> for development. Demo analytics is always excluded from public-facing statistics.
    </div>
  );
}

export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <div className="mb-4 rounded-lg border border-[#C0323E]/40 bg-[#C0323E]/10 px-4 py-2.5 text-sm text-[#B42318]">{error}</div>
  );
}

export function SaveBar({ onSave, saving, saveLabel = 'Save' }: { onSave: () => void; saving?: boolean; saveLabel?: string }) {
  const router = useRouter();
  return (
    <div className="sticky bottom-4 z-10 flex items-center justify-end gap-2 rounded-xl border border-[rgba(16,24,40,0.08)] bg-white/90 backdrop-blur-xl p-3 shadow-[0_-10px_40px_rgba(16,24,40,0.12)] backdrop-blur">
      <button type="button" onClick={() => router.back()} className={A.btnGhost}>
        Cancel
      </button>
      <button type="submit" disabled={saving} className={A.btnPrimary}>
        {saving ? 'Saving…' : saveLabel}
      </button>
    </div>
  );
}
