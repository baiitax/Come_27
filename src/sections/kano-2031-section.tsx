/* ============================================================
   KANO 2031 - Section 28
   Future vision: What Kano should look like after four years
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function Kano2031Section() {
  const visionDimensions = [
    { id: 'safer', title: 'SAFER KANO', subtitle: 'Reduced crime, improved security, community protection', icon: 'Shield' },
    { id: 'educated', title: 'EDUCATED KANO', subtitle: 'Accessible quality education for all children', icon: 'GraduationCap' },
    { id: 'healthier', title: 'HEALTHIER KANO', subtitle: 'Universal healthcare access, improved facilities', icon: 'Heart' },
    { id: 'productive', title: 'PRODUCTIVE KANO', subtitle: 'Economic productivity, jobs, enterprise growth', icon: 'Briefcase' },
    { id: 'industrial', title: 'INDUSTRIAL KANO', subtitle: 'Manufacturing, factories, industrial zones', icon: 'Zap' },
    { id: 'digital', title: 'DIGITAL KANO', subtitle: 'Tech hubs, innovation, digital economy', icon: 'Code' },
    { id: 'connected', title: 'CONNECTED KANO', subtitle: 'Infrastructure, transport, communication', icon: 'Map' },
    { id: 'inclusive', title: 'INCLUSIVE KANO', subtitle: 'All communities, marginalized groups empowered', icon: 'Users' },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            KANO 2031
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            What should Kano look like after four years of disciplined development?
          </p>
        </div>

        {/* Vision dimensions grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visionDimensions.map((dimension) => (
            <GlassCard
              key={dimension.id}
              premium={true}
              shadow="soft"
              style={{
                border: '1px solid var(--glass-border)',
                animation: `fadeSlideUp 0.6s ease-out ${dimension.id}-delay var(--transition-medium)`,
              }}
            >
              <div className="px-6 py-8 text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                     style={{
                      background: 'rgba(11, 107, 69, 0.1)',
                      color: 'var(--primary-green)',
                      fontSize: '2rem',
                    }}
                >
                  {dimension.icon}
                </div>

                <h3 className="text-xl font-bold text-[var(--white)] mb-2">
                  {dimension.title}
                </h3>
                <p className="text-[var(--muted-text)] text-sm">
                  {dimension.subtitle}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Methodology note */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)] text-center">
          <p className="text-sm text-[var(--muted-text)]">
            These possible dimensions will be refined and targets established once the
            official manifesto and fiscal feasibility analysis are completed. Do not publish
            specific targets until supported by official documentation.
          </p>
        </div>
      </div>
    </section>
  );
}