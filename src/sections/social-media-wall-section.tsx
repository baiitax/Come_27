/* ============================================================
   SOCIAL MEDIA WALL - Section 41
   Verified official posts only from candidate platforms
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function SocialMediaWallSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            SOCIAL MEDIA WALL
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Verified official posts only.
          </p>
        </div>

        {/* Platform filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[ 'X', 'Facebook', 'Instagram', 'YouTube' ].map((platform) => (
            <button
              key={platform}
              className="px-4 py-2 text-sm font-medium uppercase tracking-wider border border-[var(--glass-border)] rounded glass-card premium"
            >
              {platform}
            </button>
          ))}
        </div>

        {/* Social posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample post cards */}
          {[1, 2, 3].map((index) => (
            <GlassCard
              key={index}
              premium={true}
              shadow="soft"
              style={{
                animation: `fadeSlideUp 0.6s ease-out ${index}-delay var(--transition-medium)`,
                border: '1px solid var(--glass-border)',
              }}
            >
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  {/* Platform badge */}
                  <div className="w-8 h-8 rounded bg-[var(--primary-green)] flex items-center justify-center text-[var(--white)] text-sm">
                    X
                  </div>
                  <div>
                    <p className="font-medium text-[var(--white)]">@GwarzoOfficia</p>
                    <p className="text-[var(--muted-text)] text-sm">Verified</p>
                  </div>
                </div>

                <p className="text-[var(--muted-text)] line-clamp-3">
                  "Kano's future depends on our collective commitment to education, health,
                  and opportunity for every citizen. #Kano2031 #NDC"
                </p>

                {/* Platform icon */}
                <div className="mt-3 text-xs text-[var(--muted-text)]">
                  • {index === 1 ? 'Facebook' : index === 2 ? 'Instagram' : 'YouTube'}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Note about moderation */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)] text-center">
          <p className="text-sm text-[var(--muted-text)]">
            Display verified official posts only. Do not allow unmoderated supporter content
            to appear as official candidate communication.
          </p>
        </div>
      </div>
    </section>
  );
}