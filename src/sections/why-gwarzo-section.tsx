/* ============================================================
   WHY GWARZO SECTION - Section 12
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { EvidenceBadge, EvidenceBadgeGroup } from '../components/evidence/evidence-badge';
import { cn } from '@/lib/utils';

export function WhyGwarzoSection() {
  const cards = [
    {
      id: 'experience',
      title: 'EXPERIENCE',
      headline: 'Long-standing exposure to public administration and government.',
      badgeStatus: 'verified' as const,
      animationDelay: '0ms',
    },
    {
      id: 'grassroots',
      title: 'GRASSROOTS',
      headline: 'Experience beginning from community and local-government leadership.',
      badgeStatus: 'verified' as const,
      animationDelay: '100ms',
    },
    {
      id: 'education',
      title: 'EDUCATION',
      headline: 'A professional journey connected to teaching, learning and higher education.',
      badgeStatus: 'reported' as const,
      animationDelay: '200ms',
    },
    {
      id: 'governance',
      title: 'GOVERNANCE',
      headline: 'Experience across local, state and federal institutions.',
      badgeStatus: 'official-record' as const,
      animationDelay: '300ms',
    },
    {
      id: 'executive',
      title: 'EXECUTIVE SERVICE',
      headline: 'Former Deputy Governor of Kano State.',
      badgeStatus: 'official-record' as const,
      animationDelay: '400ms',
    },
    {
      id: 'vision',
      title: 'VISION',
      headline: 'A development-oriented agenda for the future of Kano.',
      badgeStatus: 'proposed' as const,
      animationDelay: '500ms',
    },
  ];

  return (
    <section id="vision" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16" data-reveal>
          <span className="section-eyebrow">The Vision</span>

          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[var(--white)] mb-4">
            WHY AMINU GWARZO?
          </h2>
          <p className="text-[var(--muted-text)] text-lg max-w-2xl mx-auto">
            A leadership journey shaped by service, grassroots responsibility, institutional experience and executive government.
          </p>
        </div>

        {/* Glass cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6" data-reveal data-delay="120">
          {cards.map((card) => (
            <GlassCard
              key={card.id}
              premium={true}
              shadow="medium"
              hasHover={true}
              style={{
                marginBottom: '1rem',
                animationDelay: card.animationDelay,
                animation: 'fadeSlideUp 0.6s ease-out',
              }}
            >
              <div className="px-8 pt-8 pb-6">
                <div className="flex items-center gap-3 mb-6">
                  <EvidenceBadge
                    status={card.badgeStatus}
                    size="sm"
                    style={{ marginRight: '8px' }}
                  />
                  <span className="text-[var(--primary-green)] text-2xl font-bold">
                    {card.title}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-[var(--white)] mb-4">
                  {card.headline}
                </h3>

                {/* Evidence badge group at bottom */}
                <div className="mt-6 pt-6 border-t border-[var(--glass-border)]">
                  <EvidenceBadgeGroup
                    statuses={[card.badgeStatus]}
                  />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   KEYFRAMES (would normally be in CSS, but inline for this context)
   ============================================================ */
`
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`