"use client";

/* ============================================================
   KANO SECTION - Section 20
   Full digital Kano portal with hero and modules
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function KanoSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            KANO
          </h2>
          <p className="text-2xl md:text-3xl text-[var(--muted-text)] max-w-2xl mx-auto">
            KANO IS MORE THAN A CITY.
          </p>
          <p className="text-2xl md:text-3xl font-bold text-[var(--gold)]">
            KANO IS 44 COMMUNITIES OF POSSIBILITY.
          </p>
        </div>

        {/* Hero subsection */}
        <div className="glass-card premium p-6 mb-12 text-center">
          <p className="text-[var(--muted-text)] text-sm uppercase tracking-wider mb-4">
            Interactive Kano portal
          </p>
          <h3 className="text-2xl font-bold text-[var(--white)]">
            Explore 44 LGAs
          </h3>
          <p className="text-[var(--muted-text)] text-sm">
            Click any Local Government Area for detailed development information.
          </p>
        </div>

        {/* Key stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[

            { label: '44', value: 'LGAs', icon: 'Map' },
            { label: '~15M', value: 'Population', icon: 'Users' },
            { label: '~56%', value: 'Literacy Rate', icon: 'GraduationCap' },
            { label: '4,521', value: 'PHCs', icon: 'Heart' },

          ].map((stat) => (
            <div
              key={stat.icon}
              className="glass-card premium p-6 text-center"
              style={{
                border: '1px solid var(--glass-border)',
              }}
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                   style={{
                    background: 'rgba(11, 107, 69, 0.1)',
                    color: 'var(--primary-green)',
                    fontSize: '2rem',
                   }}
                >
                {stat.icon}
                </div>
                <p className="text-3xl md:text-4xl font-bold text-[var(--white)]">{stat.label}</p>
                <p className="text-[var(--muted-text)] text-sm">{stat.value}</p>
              </div>
          ))}
        </div>

        {/* Modules overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[

            { title: 'METROPOLITAN KANO', description: 'Transport, traffic, drainage, sanitation, waste, housing, markets, security, digital economy, employment', icon: 'City' },
            { title: 'RURAL KANO', description: 'Agriculture, irrigation, rural roads, water, health, education, livestock, market access, rural enterprise', icon: 'Leaf' },
            { title: '44-LGA MAP', description: 'Interactive map of all 44 Local Government Areas', icon: 'Map' },
            { title: 'KANO DEVELOPMENT OBSERVATORY', description: '10-data dashboard: Education, Healthcare, Agriculture, Water, Security, Roads, Jobs, Industry, Housing, Digital Economy', icon: 'BarChart2' },

          ].map((module) => (
            <GlassCard
              key={module.icon}
              premium={true}
              shadow="soft"
              style={{
                border: '1px solid var(--glass-border)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
              onClick={() => {
                // Would navigate to module
              }}
            >
              <div className="px-6 py-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{
                      background: 'rgba(11, 107, 69, 0.1)',
                      color: 'var(--primary-green)',
                      fontSize: '1.25rem',
                     }}
                >
                  {module.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[var(--white)]">{module.title}</h3>
                  <p className="text-[var(--muted-text)] text-sm">{module.description}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}