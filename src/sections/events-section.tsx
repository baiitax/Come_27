/* ============================================================
   EVENTS - Section 40
   GWARZO ACROSS KANO event cards and calendar
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export interface EventCard {
  id: string;
  title: string;
  date: string;
  location: string;
  category: 'town-hall' | 'policy-dialogue' | 'community-visit' | 'education' | 'youth' | 'women' | 'professional' | 'religious';
  description: string;
  registrationUrl?: string;
  mapUrl?: string;
}

const mockEvents: EventCard[] = [
  {
    id: '1',
    title: 'Town Hall: Community Priorities',
    date: 'July 20, 2024',
    location: 'Kano Municipal',
    category: 'town-hall',
    description: 'Open forum for residents to discuss community development priorities with campaign team.',
  },
  {
    id: '2',
    title: 'Policy Dialogue: Education Reform',
    date: 'July 15, 2024',
    location: 'Kano State Government House',
    category: 'policy-dialogue',
    description: 'Stakeholder discussion on education policy and human capital development.',
  },
  {
    id: '3',
    title: 'Community Visit: Rano LGA',
    date: 'July 10, 2024',
    location: 'Rano LGA',
    category: 'community-visit',
    description: 'Grassroots engagement with Rano community members.',
  },
  {
    id: '4',
    title: 'Youth Empowerment Forum',
    date: 'July 5, 2024',
    location: 'Kano City',
    category: 'youth',
    description: 'Youth engagement and enterprise opportunities discussion.',
  },
  {
    id: '5',
    title: 'Women's Forum: Economic Empowerment',
    date: 'June 28, 2024',
    location: 'Kano Municipal',
    category: 'women',
    description: 'Women's economic empowerment and micro-enterprise support.',
  },
];

export function EventsSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            GWARZO ACROSS KANO
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Event cards with registration, locations, and map integration.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[ 'All', 'Town Hall', 'Policy Dialogue', 'Community Visit', 'Youth', 'Women', 'Professional', 'Religious' ].map((cat, i) => (
            <button
              key={cat}
              onClick={() => console.log(`Filter: ${cat}`)}
              className={cn(
                'px-4 py-2 text-sm font-medium uppercase tracking-wider',
                i === 0
                  ? 'bg-[var(--primary-green)] text-[var(--white)] border border-[var(--primary-green)]'
                  : 'text-[var(--muted-text)] hover:text-[var(--white)] hover:bg-transparent')
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <GlassCard
              key={event.id}
              premium={true}
              shadow="soft"
              style={{
                animation: `fadeSlideUp 0.6s ease-out ${event.id}-delay var(--transition-medium)`,
                border: '1px solid var(--glass-border)',
              }}
            >
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-[var(--muted-text)]">{event.date}</span>
                  <span className="text-sm ml-2 px-2 py-1 rounded"
                        style={{
                          background: 'rgba(11, 107, 69, 0.1)',
                          color: 'var(--primary-green)',
                        }}
                  >
                    {event.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--white)] mb-2">
                  {event.title}
                </h3>

                <p className="text-[var(--muted-text)] line-clamp-2">
                  {event.description}
                </p>

                {/* Action buttons */}
                <div className="mt-3 pt-3 border-t border-[var(--glass-border)] flex gap-3">
                  {event.registrationUrl && (
                    <button
                      className="flex-1 px-3 py-2 text-xs font-medium text-[var(--primary-green)] rounded"
                    >
                      Register
                    </button>
                  )}
                  <button
                    className="flex-1 px-3 py-2 text-xs font-medium text-[var(--muted-text)] rounded"
                  >
                    Map
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Load more */}
        <div className="mt-8 text-center">
          <a
            href="#"
            className="text-[var(--primary-green)] text-sm font-medium uppercase tracking-wider transition-colors hover:underline"
          >
            View all events →
          </a>
        </div>
      </div>
    </section>
  );
}