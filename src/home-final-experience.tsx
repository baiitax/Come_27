/* ============================================================
   HOME PAGE FINAL EXPERIENCE - Section 62
   The complete visitor experience sequence (01-10)
   ============================================================ */
export function HomeFinalExperience() {
  const steps = [
    {
      id: 1,
      title: 'See the candidate.',
      description: 'Cinematic portrait of Comrade Aminu Abdussalam Gwarzo',
      icon: 'User',
    },
    {
      id: 2,
      title: 'Understand his story.',
      description: 'The Journey timeline from 1990s to 2027',
      icon: 'BookOpen',
    },
    {
      id: 3,
      title: 'Explore his public record.',
      description: 'Public Service Record database with filters and evidence',
      icon: 'FileText',
    },
    {
      id: 4,
      title: 'Understand Kano\'s challenges.',
      description: 'Kano Development Challenge - urban and rural',
      icon: 'Map',
    },
    {
      id: 5,
      title: 'Explore the proposed solutions.',
      description: 'Vision for Kano and 10 policy pillars',
      icon: 'Lightbulb',
    },
    {
      id: 6,
      title: 'Understand the candidate\'s political journey.',
      description: 'Kwankwasiyya Movement and political timeline',
      icon: 'History',
    },
    {
      id: 7,
      title: 'See the governance team.',
      description: 'Gwarzo + Mustapha complementary leadership',
      icon: 'Users',
    },
    {
      id: 8,
      title: 'Review evidence.',
      description: 'The Record Room with verified documents',
      icon: 'Shield',
    },
    {
      id: 9,
      title: 'Ask questions.',
      description: 'Talk to Gwarzo engagement form',
      icon: 'MessageCircle',
    },
    {
      id: 10,
      title: 'Stay engaged.',
      description: 'Volunteer system and citizen priority map',
      icon: 'Star',
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[var(--obsidian)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            HOME PAGE FINAL EXPERIENCE
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            The visitor should experience this sequence:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="glass-card premium p-6 text-center transform hover:translate-y-2 transition-all cursor-pointer"
              style={{
                border: '1px solid var(--glass-border)',
              }}
            >
              <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                   style={{
                    background: step.id <= 5 ? 'rgba(11, 107, 69, 0.1)' : 'rgba(218, 165, 32, 0.1)',
                    color: step.id <= 5 ? 'var(--primary-green)' : 'var(--gold)',
                    fontSize: '1.5rem',
                   }}
                >
                  {step.icon}
                </div>

                <h3 className="text-lg font-bold text-[var(--white)] mb-2">
                  {step.id}. {step.title}
                </h3>
                <p className="text-[var(--muted-text)] text-sm line-clamp-2">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--glass-border)] text-center">
          <p className="text-sm text-[var(--muted-text)]">
            This creates a complete public-leadership narrative.
          </p>
        </div>
      </div>
    </section>
  );
}