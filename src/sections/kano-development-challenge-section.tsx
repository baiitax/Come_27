/* ============================================================
   KANO DEVELOPMENT CHALLENGE - Section 6
   Full digital Kano portal - the challenges the state faces
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function KanoDevelopmentChallengeSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            KANO DEVELOPMENT CHALLENGE
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Understanding the obstacles to plan effectively around.
          </p>
        </div>

        {/* Challenges overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Urban Challenges */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--danger)]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--danger)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2v4M5 12h14M12 20v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--white)]">Urban Challenges</h3>
                  <p className="text-[var(--muted-text)] text-sm mt-1">
                    Transport, traffic, drainage, sanitation, waste management, housing,
                    urban planning, security, digital employment
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                <p className="text-xs text-[var(--muted-text)]">
                  High-quality Kano urban imagery illustrates the scale of challenges.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Rural Challenges */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-green)]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--primary-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2v4M5 12h14M12 20v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--white)]">Rural Challenges</h3>
                  <p className="text-[var(--muted-text)] text-sm mt-1">
                    Agriculture, irrigation, rural roads, water, health, education,
                    livestock, market access, rural enterprise
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                <p className="text-xs text-[var(--muted-text)]">
                  Contrast between urban and rural needs visualized clearly.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Key Statistics */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">Key Development Indicators</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[var(--muted-text)] uppercase tracking-wider mb-1">Population</p>
                  <p className="text-[var(--white)] font-medium">~15M (2024 estimate)</p>
                </div>
                <div>
                  <p className="text-[var(--muted-text)] uppercase tracking-wider mb-1">Literacy Rate</p>
                  <p className="text-[var(--danger)] font-medium">~56%</p>
                </div>
                <div>
                  <p className="text-[var(--muted-text)] uppercase tracking-wider mb-1">Youth Unemployment</p>
                  <p className="text-[var(--danger)] font-medium">~34%</p>
                </div>
                <div>
                  <p className="text-[var(--muted-text)] uppercase tracking-wider mb-1">PHC Coverage</p>
                  <p className="text-[var(--primary-green)] font-medium">~4,521 facilities</p>
                </div>
              </div>
              <p className="mt-6 text-xs text-[var(--muted-text)]">
                Sources: NBS, INEC, Kano State Ministry of Health, 2023-2024 reports. All
                statistics display provenance where published.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Urban/Rural contrast CTA */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)] text-center">
          <p className="text-sm text-[var(--muted-text)]">
            <strong>Urban</strong> development needs differ significantly from <strong>Rural</strong>
            communities - this website includes dedicated modules for both, ensuring every
            Kano community receives attention.
          </p>
        </div>
      </div>
    </section>
  );
}