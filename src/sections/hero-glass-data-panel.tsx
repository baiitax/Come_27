/* ============================================================
   HERO GLASS DATA PANEL - Section 9
   Floating glass panel beside/below the candidate in hero
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function HeroGlassDataPanel() {
  return (
    <section className="py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Left side - Data Panel */}
          <GlassCard premium={true} shadow="medium">
            <div className="px-6 py-6">
              <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted-text)] mb-4">
                PUBLIC SERVICE
              </h3>
              <p className="text-[var(--muted-text)] text-sm mb-2">
                Decades of public and community engagement.
              </p>
              <p className="text-[var(--muted-text)] text-sm mb-2">
                GRASSROOTS
              </p>
              <p className="text-[var(--primary-green)] font-medium text-sm">
                Local government leadership.
              </p>
              <p className="text-[var(--muted-text)] text-sm mb-2">
                STATE EXPERIENCE
              </p>
              <p className="text-[var(--primary-green)] font-medium text-sm">
                Former Deputy Governor of Kano State.
              </p>
              <p className="text-[var(--muted-text)] text-sm mb-2">
                2027
              </p>
              <p className="text-[var(--primary-green)] font-medium text-sm">
                NDC Governorship Candidate.
              </p>
            </div>
          </GlassCard>

          {/* Right side - Timeline indicator */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary-green)] flex items-center justify-center text-[var(--white)] text-xl font-bold">
              1990s
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[var(--gold)] flex items-center justify-center text-[var(--obsidian)] text-xl font-bold">
              2027
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[var(--glass-surface)] flex items-center justify-center border-2 border-[var(--glass-border)] text-[var(--muted-text)] text-xl font-bold">
              KANO
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}