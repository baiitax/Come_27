"use client";

/* ============================================================
   LATEST SPEECHES/NEWS - Section 11/32
   Recent campaign activity and developments
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export interface LatestItem {
  id: string;
  title: string;
  date: string;
  category: 'speech' | 'news' | 'press-release' | 'event';
  location: string;
  excerpt: string;
  videoUrl?: string;
}

const mockLatest: LatestItem[] = [
  {
    id: '1',
    title: 'Gwarzo commissions 10 health centres across Kano',
    date: 'July 15, 2024',
    category: 'news',
    location: 'Kano State',
    excerpt: 'The NDC governorship candidate commissioned 10 primary health centres across 5 LGAs, expanding healthcare access.',
  },
  {
    id: '2',
    title: 'Town hall with women traders in Kano Municipal',
    date: 'July 10, 2024',
    category: 'event',
    location: 'Kano Municipal',
    excerpt: 'Engagement with women traders on market access, micro-finance, and enterprise support programmes.',
  },
  {
    id: '3',
    title: 'Education reform position statement',
    date: 'July 5, 2024',
    category: 'speech',
    location: 'Abuja',
    excerpt: 'Detailed position on education human capital development and Kano state university transformation.',
  },
  {
    id: '4',
    title: 'Press release: Campaign launches digital outreach',
    date: 'July 1, 2024',
    category: 'press-release',
    location: 'Kano',
    excerpt: 'New digital platforms for constituent engagement and campaign communication.',
  },
  {
    id: '5',
    title: 'Gwarzo at Arewa Consultative Forum',
    date: 'June 25, 2024',
    category: 'event',
    location: 'Kano',
    excerpt: 'Participation in ACF deliberations on northern Nigeria development and security.',
  },
];

export function LatestSpeechesSection() {
  return (
    <section id="media" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16" data-reveal>
          <span className="section-eyebrow">Media Center</span>

          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[var(--white)] mb-4">
            LATEST SPEECHES & NEWS
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Recent campaign activity and public addresses.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[ 'All', 'Speech', 'News', 'Press Release', 'Event' ].map((tab, i) => (
            <button
              key={tab}
              onClick={() => console.log(`Filter: ${tab}`)} // Would filter items
              className={cn(
                'px-4 py-2 text-sm font-medium uppercase tracking-wider',
                i === 0
                  ? 'bg-[var(--primary-green)] text-white border border-[var(--primary-green)]'
                  : 'text-[var(--muted-text)] hover:text-[var(--white)] hover:bg-transparent')
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Latest items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal data-delay="120">
          {mockLatest.map((item) => (
            <GlassCard
              key={item.id}
              premium={true}
              shadow="soft"
              style={{
                animation: `fadeSlideUp 0.6s ease-out ${item.id}-delay var(--transition-medium)`,
              }}
            >
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-[var(--muted-text)]">{item.date}</span>
                  <span className="text-sm ml-2 px-2 py-1 rounded text-[var(--primary-green)]">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--white)] mb-2">
                  {item.title}
                </h3>

                <p className="text-[var(--muted-text)] line-clamp-3">
                  {item.excerpt}
                </p>

                {/* Video indicator for speeches with video */}
                {item.videoUrl && (
                  <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                    <span className="text-xs px-2 py-1 rounded"
                          style={{
                            background: 'rgba(11, 107, 69, 0.1)',
                            color: 'var(--primary-green)',
                          }}
                    >
                      ▶ Video available
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-8 text-center">
          <a
            href="#"
            className="text-[var(--primary-green)] text-sm font-medium uppercase tracking-wider transition-colors hover:underline"
          >
            View all speeches and news →
          </a>
        </div>
      </div>
    </section>
  );
}