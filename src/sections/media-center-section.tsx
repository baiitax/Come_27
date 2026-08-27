/* ============================================================
   MEDIA CENTER - Section 31
   Professional newsroom with filtering
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export interface MediaItem {
  id: string;
  title: string;
  date: string;
  category: 'news' | 'press-release' | 'speech' | 'interview' | 'video' | 'photograph' | 'documentary';
  location: string;
  language: 'english' | 'hausa';
  excerpt: string;
  videoUrl?: string;
  imageUrl?: string;
}

const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    title: 'Comrade Gwarzo outlines Kano development agenda',
    date: 'July 2024',
    category: 'news',
    location: 'Kano',
    language: 'english',
    excerpt: 'The NDC governorship candidate detailed his 10-pillar vision for Kano\'s future at a press briefing.',
  },
  {
    id: '2',
    title: 'Press release: Gwarzo appoints campaign team',
    date: 'June 2024',
    category: 'press-release',
    location: 'Kano',
    language: 'english',
    excerpt: 'Campaign announces new strategic appointments for 2027 governorship run.',
  },
  {
    id: '3',
    title: 'Gwarzo at Kwankwasiyya solidarity rally',
    date: 'May 2024',
    category: 'photograph',
    location: 'Kano',
    language: 'english',
    excerpt: 'Photos from the Kwankwasiyya movement solidarity event.',
  },
  {
    id: '4',
    title: 'Gwarzo on Arewa Radio',
    date: 'April 2024',
    category: 'interview',
    location: 'Kano',
    language: 'hausa',
    excerpt: 'Radio interview in Hausa about grassroots engagement and development.',
  },
  {
    id: '5',
    title: 'Kano education policy statement',
    date: 'March 2024',
    category: 'speech',
    location: 'Kano State',
    language: 'english',
    excerpt: 'Position paper on education reform and human capital development.',
  },
  {
    id: '6',
    title: 'Town hall: Community priorities',
    date: 'February 2024',
    category: 'video',
    location: 'Kano Municipal',
    language: 'english',
    excerpt: 'Video recording from community town hall meeting.',
    videoUrl: '/videos/town-hall-feb2024.mp4',
  },
];

export function MediaCenterSection() {
  const [categoryFilter, setCategoryFilter] = React.useState<'all' | MediaItem['category']>('all');
  const [languageFilter, setLanguageFilter] = React.useState<'all' | MediaItem['language']>('all');

  const filteredItems = mockMediaItems.filter((item) => {
    const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;
    const languageMatch = languageFilter === 'all' || item.language === languageFilter;
    return categoryMatch && languageMatch;
  });

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            MEDIA CENTER
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Professional newsroom and press portal.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {/* Category filters */}
          <div>
            <button
              onClick={() => setCategoryFilter('all')}
              className={cn(
                'px-4 py-2 text-sm font-medium uppercase tracking-wider',
                categoryFilter === 'all'
                  ? 'bg-[var(--primary-green)] text-[var(--white)] border border-[var(--primary-green)]'
                  : 'text-[var(--muted-text)] hover:text-[var(--white)] hover:bg-transparent')
              }}
            >
              All
            </button>
          </div>

          {[ 'news', 'press-release', 'speech', 'interview', 'video', 'photograph', 'documentary' ].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat as MediaItem['category'])}
              className={cn(
                'px-4 py-2 text-sm font-medium uppercase tracking-wider',
                categoryFilter === cat
                  ? 'bg-[var(--glass-surface)] text-[var(--white)] border border-[var(--glass-border)]'
                  : 'text-[var(--muted-text)] hover:text-[var(--white)] hover:bg-[var(--glass-surface)]')
              }}
            >
              {cat}
            </button>
          ))}

          {/* Language filters */}
          <div className="ml-8">
            <button
              onClick={() => setLanguageFilter('all')}
              className={cn(
                'px-4 py-2 text-sm font-medium uppercase tracking-wider',
                languageFilter === 'all'
                  ? 'bg-[var(--primary-green)] text-[var(--white)] border border-[var(--primary-green)]'
                  : 'text-[var(--muted-text)] hover:text-[var(--white)] hover:bg-transparent')
              }}
            >
              All
            </button>
            <button
              onClick={() => setLanguageFilter('hausa')}
              className={cn(
                'px-4 py-2 text-sm font-medium uppercase tracking-wider',
                languageFilter === 'hausa'
                  ? 'bg-[var(--gold)] text-[var(--obsidian)] border border-[var(--gold)]'
                  : 'text-[var(--muted-text)] hover:text-[var(--white)] hover:bg-transparent')
              }}
            >
              Hausa
            </button>
          </div>
        </div>

        {/* Media items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <GlassCard
              key={item.id}
              premium={true}
              shadow="soft"
              style={{
                animation: `fadeSlideUp 0.6s ease-out ${item.id}-delay var(--transition-medium)`,
              }}
            >
              <div className="px-6 pt-6 pb-4">
                {/* Label badges */}
                <div className="flex flex-col md:flex-row mb-4">
                  <span className="text-xs text-[var(--muted-text)] uppercase tracking-wider">{item.date}</span>
                  {item.language === 'hausa' && (
                    <span className="ml-2 text-xs bg-[var(--gold)] text-[var(--obsidian)] px-2 py-0.5 rounded">
                      HAS
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[var(--white)] mb-3">
                  {item.title}
                </h3>

                <p className="text-[var(--muted-text)] line-clamp-3">
                  {item.excerpt}
                </p>

                {/* Category badge */}
                <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                  <span className="text-xs px-2 py-1 rounded ml-2"
                        style={{
                          background: 'rgba(11, 107, 69, 0.1)',
                          color: 'var(--primary-green)',
                        }}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="mt-3 flex gap-2">
                  {item.videoUrl && (
                    <button
                      className="flex-1 px-3 py-2 text-xs font-medium text-[var(--primary-green)] rounded"
                    >
                      ▶
                    </button>
                  )}
                  <button
                    className="flex-1 px-3 py-2 text-xs font-medium text-[var(--muted-text)] rounded"
                  >
                    Read
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <p className="text-center text-sm text-[var(--muted-text)] mt-8">
            No items found with selected filters.
          </p>
        )}
      </div>
    </section>
  );
}