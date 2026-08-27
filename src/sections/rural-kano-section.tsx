/* ============================================================
   RURAL KANO - Section dedicated to rural development
   Agriculture, irrigation, rural roads, water, health, education,
   livestock, market access, rural enterprise
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function RuralKanoSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rural Development Overview */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
              RURAL KANO
            </h2>
            <p className="text-[var(--muted-text)] text-lg">
              Dedicated module for Kano's agricultural communities and rural development.
            </p>
          </div>

          {/* Agriculture Card */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                AGRICULTURE
              </h3>
              <ul className="space-y-3 text-[var(--muted-text)]">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--primary-green)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--primary-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]">Crop Production</p>
                    <p className="text-[var(--muted-text)] text-sm">Rice, wheat, soy, groundnut across Kano's agricultural zones</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--primary-green)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--primary-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]">Irrigation</p>
                    <p className="text-[var(--muted-text)] text-sm">Small-scale and large-scale irrigation projects</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--primary-green)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--primary-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]">Farm Inputs</p>
                    <p className="text-[var(--muted-text)] text-sm">Fertilizers, seeds, equipment access</p>
                  </div>
                </li>
              </ul>
              <p className="mt-4 text-xs text-[var(--muted-text)]">
                Data source: Kano State Agricultural Ministry, 2023-2024 reports.
              </p>
            </div>
          </GlassCard>

          {/* Irrigation Card */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                IRRIGATION
              </h3>
              <ul className="space-y-3 text-[var(--muted-text)]">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--gold)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]">Coverage</p>
                    <p className="text-[var(--muted-text)] text-sm">Percentage of farmland under irrigation</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--gold)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]">Projects</p>
                    <p className="text-[var(--muted-text)] text-sm">Number of irrigation projects across 44 LGAs</p>
                  </div>
                </li>
              </ul>
            </div>
          </GlassCard>

          {/* Rural Roads Card */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                RURAL ROADS
              </h3>
              <ul className="space-y-3 text-[var(--muted-text)]">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--danger)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--danger)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]">Network</p>
                    <p className="text-[var(--muted-text)] text-sm">Rural road network coverage</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--danger)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--danger)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]">Maintenance</p>
                    <p className="text-[var(--muted-text)] text-sm">Rural road upkeep and rehabilitation</p>
                  </div>
                </li>
              </ul>
            </div>
          </GlassCard>

          {/* Water Card */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                WATER
              </h3>
              <ul className="space-y-3 text-[var(--muted-text)]">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--primary-green)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--primary-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]">Access</p>
                    <p className="text-[var(--muted-text)] text-sm">Rural household water access</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--primary-green)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--primary-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]">Quality</p>
                    <p className="text-[var(--muted-text)] text-sm">Water quality and safety</p>
                  </div>
                </li>
              </ul>
            </div>
          </GlassCard>

          {/* Health Card */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                HEALTH
              </h3>
              <ul className="space-y-3 text-[var(--muted-text)]">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--danger)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--danger)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]</p>
                    <p className="text-[var(--muted-text)] text-sm">Primary health centre coverage</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--danger)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--danger)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]">Services</p>
                    <p className="text-[var(--muted-text)] text-sm">Rural healthcare services</p>
                  </div>
                </li>
              </ul>
            </div>
          </GlassCard>

          {/* Education Card */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                EDUCATION
              </h3>
              <ul className="space-y-3 text-[var(--muted-text)]">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--primary-green)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--primary-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]</p>
                    <p className="text-[var(--muted-text)] text-sm">Rural school enrollment</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-[var(--primary-green)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--primary-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 2v4M5 12h14M12 20v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]</p>
                    <p className="text-[var(--muted-text)] text-sm">Teacher-pupil ratio</p>
                  </div>
                </li>
              </ul>
            </div>
          </GlassCard>

          {/* Livestock & Markets */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            <GlassCard premium={true} shadow="soft">
              <div className="px-6 py-6">
                <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                  LIVESTOCK
                </h3>
                <ul className="space-y-3 text-[var(--muted-text)]">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-xl bg-[var(--primary-green)]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[var(--primary-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 2v4M5 12h14M12 20v4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--white)]">Production</p>
                      <p className="text-[var(--muted-text)] text-sm">Livestock population and production</p>
                    </div>
                  </li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard premium={true} shadow="soft">
              <div className="px-6 py-6">
                <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                  MARKET ACCESS
                </h3>
                <ul className="space-y-3 text-[var(--muted-text)]">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-xl bg-[var(--gold)]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[var(--gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 2v4M5 12h14M12 20v4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--white)]</p>
                      <p className="text-[var(--muted-text)] text-sm">Rural market infrastructure</p>
                    </div>
                  </li>
                </ul>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Urban/Rural contrast statement */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)] text-center">
          <p className="text-sm text-[var(--muted-text)]">
            While the <strong>Metropolitan Kano</strong> module addresses transport, traffic,
            drainage, sanitation and urban planning, this <strong>Rural Kano</strong> section
            ensures every community - from farming villages to remote settlements - receives
            dedicated attention and development planning.
          </p>
        </div>
      </div>
    </section>
  );
}