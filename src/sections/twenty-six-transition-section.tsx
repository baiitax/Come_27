/* ============================================================
   2026 POLITICAL TRANSITION SECTION - Section 18
   Neutral, documentary page without inflammatory language
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function TwentySixTransitionSection() {
  const timelineItems = [
    {
      title: 'Political Realignment',
      description: 'Officially documented political realignment within Kano state politics',
      attribution: 'The Kano State Government',
      verified: true,
    },
    {
      title: 'Differences in Political Direction',
      description: 'Reported differences in political direction and approach',
      attribution: 'Various political stakeholders',
      verified: true,
    },
    {
      title: 'Impeachment Proceedings',
      description: 'The Kano State House of Assembly alleged impeachment proceedings',
      attribution: 'Kano State House of Assembly',
      verified: true,
    },
    {
      title: "Candidate's Response",
      description: 'Comrade Gwarzo\'s formal response to the allegations',
      attribution: 'Comrade Aminu Abdussalam Gwarzo campaign',
      verified: true,
    },
    {
      title: 'Resignation',
      description: 'Official resignation from Deputy Governorship position',
      attribution: 'Comrade Aminu Abdussalam Gwarzo',
      verified: true,
    },
    {
      title: 'Withdrawal of Proceedings',
      description: 'Withdrawal of impeachment proceedings',
      attribution: 'Kano State House of Assembly',
      verified: true,
    },
    {
      title: 'NDC Candidacy',
      description: 'Emergence as NDC Kano governorship candidate',
      attribution: 'Nigeria Democratic Congress (NDC)',
      verified: true,
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            THE 2026 POLITICAL TRANSITION
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Documentary timeline of political events.
          </p>
        </div>

        <div className="space-y-6">
          {timelineItems.map((item, index) => (
            <GlassCard
              key={index}
              premium={true}
              shadow="soft"
              style={{
                border: '1px solid var(--glass-border)',
              }}
            >
              <div className="px-6 pt-6">
                <div className="flex items-start gap-4">
                  {/* Number/step */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{
                        background: 'var(--primary-green)',
                        color: 'var(--white)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                       }}
                  >
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[var(--white)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[var(--muted-text)] text-sm">
                      {item.description}
                    </p>
                    <p className="text-xs text-[var(--muted-text)]">
                      {item.attribution}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}