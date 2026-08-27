import { cn } from '@/lib/utils';

const ACCENTS: Record<string, string> = {
  green: 'text-[var(--brand)]',
  gold: 'text-[var(--gold-ink)]',
  crimson: 'text-[var(--brand)]',
};

export function StatsStrip({ stats, className = '' }: { stats: { value: string; label: string; accent: string; source?: string | null }[]; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 md:grid-cols-4', className)}>
      {stats.map((s) => (
        <div key={s.label} className="glass-card glass-panel-hover !p-5 text-center">
          <p className={cn('font-display text-4xl font-extrabold tracking-tight md:text-5xl', ACCENTS[s.accent] ?? 'text-[var(--white)]')}>
            {s.value}
          </p>
          <p className="mt-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-text)]">{s.label}</p>
          {s.source && (
            <p className="mt-2 text-[0.58rem] text-[var(--muted-2)]">Source: {s.source}</p>
          )}
        </div>
      ))}
    </div>
  );
}
