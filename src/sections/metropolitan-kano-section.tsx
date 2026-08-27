/* ============================================================
   METROPOLITAN KANO - Section 23
   Urban development module: transport, traffic, drainage, sanitation,
   waste, housing, markets, security, digital economy, employment
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function MetropolitanKanoSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            METROPOLITAN KANO
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Urban development challenges and opportunities.
          </p>
        </div>

        {/* Issues grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[ 'transport', 'traffic', 'drainage', 'sanitation', 'waste', 'housing', 'markets', 'security', 'digital economy', 'employment' ].map((issue, i) => (
            <GlassCard
              key={issue}
              premium={true}
              shadow="soft"
              style={{
                border: '1px solid var(--glass-border)',
                animation: `fadeSlideUp 0.6s ease-out ${issue}-delay var(--transition-medium)`,
              }}
            >
              <div className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{
                        background: i % 2 === 0 ? 'rgba(11, 107, 69, 0.1)' : 'rgba(218, 165, 32, 0.1)',
                        color: i % 2 === 0 ? 'var(--primary-green)' : 'var(--gold)',
                       }}
                  >
                    {issue === 'transport' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M2 12l20-8L2 4l10 8 10-8z" /></svg>
                    {issue === 'traffic' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M1 12h22M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 4l10 10M4.93 19.07l1.41 1.41M17.66 6.34l1.41 1.41"/><path d="M9.06 9.06l1.41 1.41M15.94 15.94l1.41 1.41"/></svg>
                    {issue === 'drainage' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-8-8 8v8z"/><path d="M12 4a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/></svg>
                    {issue === 'sanitation' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 0h6"/><path d="M9 10V9"/><path d="M15 10V9"/></svg>
                    {issue === 'waste' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68-2.68M8 2a1 1 0 0 1 1 1v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"/></svg>
                    {issue === 'housing' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="15" y2="21"/></svg>
                    {issue === 'markets' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/></svg>
                    {issue === 'security' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2v4m0 16l-4-4-6 6M12 2l6.95 8.07"/><path d="m19.07 4.93-2.83 2.83-1.42-1.42"/><path d="m9.95 15.06-1.42 1.42 2.83 2.83 1.42 1.42"/></svg>
                    {issue === 'digital economy' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y3="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="15"/><line x1="15" y1="3" x2="15" y2="15"/></svg>
                    {issue === 'employment' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M13 2L3 14h4l10 12h-4l-4-8h12l-4 8h-4z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[var(--white)]">{issue}</h3>
                    <p className="text-[var(--muted-text)] text-sm mt-1">
                      Kano urban development issue
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                  <p className="text-xs text-[var(--muted-text)]">
                    High-quality Kano urban imagery illustrates each challenge.
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Urban Kano CTA */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)] text-center">
          <p className="text-sm text-[var(--muted-text)]">
            While the <strong>Rural Kano</strong> module addresses agriculture, irrigation,
            and rural development, this <strong>Metropolitan Kano</strong> section ensures
            Abuja Road, Kano City, Fagge, and all urban communities receive dedicated
            attention for transport, housing, digital economy, and employment.
          </p>
        </div>
      </div>
    </section>
  );
}