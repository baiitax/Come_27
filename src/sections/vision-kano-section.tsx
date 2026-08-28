/* ============================================================
   VISION FOR KANO - Section 7/25
   High-level vision statement leading to policy pillars
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function VisionForKanoSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            VISION FOR KANO
          </h2>
          <p className="text-2xl md:text-3xl text-[var(--muted-text)] max-w-2xl mx-auto">
            A safer, more educated, productive and accountable Kano.
          </p>
        </div>

        {/* Vision statement card */}
        <GlassCard premium={true} shadow="medium">
          <div className="px-8 pt-8 pb-6">
            <p className="text-[var(--muted-text)] text-lg leading-relaxed mb-6">
              Comarade Aminu Abdussalam Gwarzo seeks to bring decades of institutional and
              community experience to the next chapter of Kano's development. The vision is
              built on evidence, grounded in grassroots reality, and ambitious in scope.
            </p>
            <p className="text-[var(--muted-text)] text-sm">
              This vision is subject to final campaign documentation and applicable law.
              Policy proposals will be replaced or adapted once the official manifesto is released.
            </p>
          </div>
        </GlassCard>

        {/* The 10 policy pillars - summarized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const titles = [
              'Security & Community Protection',
              'Education & Human Capital',
              'Healthcare',
              'Agriculture & Food Security',
              'Jobs & Enterprise',
              'Water & Sanitation',
              'Infrastructure & Urban Development',
              'Industrialization',
              'Local Government Reform',
              'Digital Government',
            ];
            return (
              <GlassCard
                key={num}
                premium={true}
                shadow="soft"
                style={{
                  border: '1px solid var(--glass-border)',
                }}
              >
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--primary-green)]">
                    {num}. {titles[num - 1]}
                  </span>
                  <EvidenceBadge
                    status="proposed"
                    size="xs"
                    style={{
                      background: 'rgba(168, 181, 175, 0.2)',
                      color: '#A8B5AF',
                      border: '1px solid rgba(168, 181, 175, 0.4)',
                    }}
                  />
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Call to action below vision */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)] text-center">
          <p className="text-sm text-[var(--muted-text)]">
            These proposed policy pillars form the information architecture for Kano's future.
            They will be replaced or adapted to the official manifesto once released.
          </p>
        </div>
      </div>
    </section>
  );
}