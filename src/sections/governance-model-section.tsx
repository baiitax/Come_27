/* ============================================================
   GWARZO GOVERNANCE MODEL - Section 27
   Signature visual framework: LISTEN → PLAN → DELIVER → MEASURE → REPORT
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';
import { EvidenceBadge } from '../components/evidence/evidence-badge';

/* Governance model data */
const governancePhases = [
  {
    id: 'listen',
    title: 'LISTEN',
    subtitle: 'Government should listen to the people',
    description: 'Community engagement, public consultations, grassroots feedback across all 44 LGAs. Town hall meetings, digital feedback channels, direct constituent access.',
    icon: 'Ear',
    color: 'var(--primary-green)',
    progress: 0,
  },
  {
    id: 'plan',
    title: 'PLAN',
    subtitle: 'Government should plan with precision',
    description: 'Evidence-based policy planning, strategic development frameworks, multi-stakeholder consultation. Data-driven approach, Kano development observatory inputs, expert partnerships.',
    icon: 'Map',
    color: 'var(--gold)',
    progress: 0,
  },
  {
    id: 'deliver',
    title: 'DELIVER',
    subtitle: 'Government should deliver results',
    description: 'Executive action, project implementation, tangible development outcomes. 44-LGA coordination, measurable targets, timely delivery across all communities.',
    icon: 'TrendingUp',
    color: 'var(--primary-green)',
    progress: 0,
  },
  {
    id: 'measure',
    title: 'MEASURE',
    subtitle: 'Government should measure progress',
    description: 'Performance metrics, data tracking, impact assessment. Kano Development Observatory dashboards, independent monitoring, citizen feedback integration.',
    icon: 'BarChart2',
    color: 'var(--gold)',
    progress: 0,
  },
  {
    id: 'report',
    title: 'REPORT',
    subtitle: 'Government should report transparently',
    description: 'Public accountability, open data, citizen dashboards. Quarterly reports, annual reviews, transparent governance, evidence-first communication.',
    icon: 'Square',
    color: 'var(--primary-green)',
    progress: 0,
  },
];

export function GovernanceModelSection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            GWARZO GOVERNANCE MODEL
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Government should not only announce. Government should deliver, measure and report.
          </p>
        </div>

        {/* Phase cards in a visual cycle */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {governancePhases.map((phase) => (
            <GlassCard
              key={phase.id}
              premium={true}
              shadow="medium"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.14)',
                transform: `scale(${phase.progress > 0 ? 1.02 : 1})`,
                transition: 'transform 0.3s ease',
              }}
            >
              <div className="px-6 py-8 text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                     style={{
                      background: `rgba(${phase.color.replace('var(--', '').replace(')', '').split(',').map(Number)/*.7*/)}`,
                      color: phase.color,
                      fontSize: '2rem',
                    }}
                >
                  {phase.icon}
                </div>

                <h3 className="text-xl font-bold text-[var(--white)] mb-2">
                  {phase.title}
                </h3>
                <p className="text-[var(--muted-text)] text-sm leading-relaxed mb-6">
                  {phase.subtitle}
                </p>

                <p className="text-sm text-[var(--muted-text)]">
                  {phase.description}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Animated connector lines would go here in actual implementation */}
        <div className="mt-12 pt-8 text-center">
          <p className="text-sm text-[var(--muted-text)]">
            The governance model represents a commitment to evidence-based, accountable
            leadership that delivers tangible results for Kano citizens.
          </p>
        </div>
      </div>
    </section>
  );
}