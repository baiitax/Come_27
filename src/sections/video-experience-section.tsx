/* ============================================================
   VIDEO EXPERIENCE - Section 32
   Cinematic video cards with featured video at top
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  source: 'youtube' | 'self-hosted';
  videoUrl: string;
  thumbnailUrl: string;
}

const mockVideos: VideoItem[] = [
  {
    id: '1',
    title: 'Inaugural Governorship Speech - Full',
    description: 'Comrade Gwarzo's inaugural address as NDC governorship candidate',
    source: 'youtube',
    videoUrl: '/videos/inaugural-speech.mp4',
    thumbnailUrl: '/images/thumbnails/inaugural.jpg',
  },
  {
    id: '2',
    title: 'Town Hall: Community Priorities',
    description: 'Kano town hall meeting on development priorities',
    source: 'self-hosted',
    videoUrl: '/videos/town-hall.mp4',
    thumbnailUrl: '/images/thumbnails/town-hall.jpg',
  },
  {
    id: '3',
    title: 'Kano Development Agenda',
    description: 'Policy position statement on Kano's future',
    source: 'youtube',
    videoUrl: '/videos/agenda.mp4',
    thumbnailUrl: '/images/thumbnails/agenda.jpg',
  },
];

export function VideoExperienceSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            VIDEO EXPERIENCE
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Campaign documentaries and speeches.
          </p>
        </div>

        {/* Featured video at top */}
        <GlassCard premium={true} shadow="soft">
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0"
                   style={{
                    background: 'var(--obsidian)',
                   }}
                >
                <img
                  src="/images/thumbnails/inaugural.jpg"
                  alt="Featured video thumbnail"
                  className="w-full h-full object-cover"
                />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--white)]">
                    {mockVideos[0].title}
                  </h3>
                  <p className="text-[var(--muted-text)] text-sm">
                    {mockVideos[0].description}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--glass-border)] flex justify-between">
                <span className="text-sm text-[var(--muted-text)]">
                  {mockVideos[0].source === 'youtube' ? 'YouTube' : 'Self-hosted'}
                </span>
                <svg
                  className="w-4 h-4 text-[var(--primary-green)]"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                >
                  <path d="M5 12h14M12 5v14" />
                </svg>
              </div>
            </div>
          </div>
        </GlassCard>

 {/* Video grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
  {mockVideos.map((video) => (
    <GlassCard
      key={video.id}
      premium={true}
      shadow="soft"
      style={{
        animation: `fadeSlideUp 0.6s ease-out ${video.id}-delay var(--transition-medium)`,
        border: '1px solid var(--glass-border)',
      }}
    >
      <div className="px-5 py-4 flex items-start gap-3">
        <div className="w-12 h-8 rounded-xl overflow-hidden flex-shrink-0"
             style={{
              background: 'var(--obsidian)',
              width: '120px',
              height: '80px',
             }}
        >
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[var(--white)] truncate">
            {video.title}
          </h3>
          <p className="text-[var(--muted-text)] text-sm line-clamp-2">
            {video.description}
          </p>
        </div>
        <div className="w-10 h-8 rounded-xl bg-[var(--primary-green)] flex items-center justify-center text-[var(--white)] text-xs uppercase ml-4">
          ▶
        </div>
      </div>
    </GlassCard>
  ))}
</div>

 {/* Video filtering */}
 <div className="mt-12 pt-8 border-t border-[var(--glass-border)] text-center">
  <p className="text-sm text-[var(--muted-text)]">
    Filter by: YouTube | Self-hosted | All
  </p>
</div>
</section>