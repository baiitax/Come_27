/* ============================================================
   PRESS CENTER - Professional press portal
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function PressCenterSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Candidate Biography */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                CANDIDATE BIOGRAPHY
              </h3>
              <ul className="space-y-3 text-[var(--muted-text)]">
                <li>
                  <span className="font-medium">Full Name:</span>
                  <span className="text-[var(--white)]">Comrade Aminu Abdussalam Gwarzo</span>
                </li>
                <li>
                  <span className="font-medium">Position:</span>
                  <span className="text-[var(--white)]">Candidate for Governor, Kano State</span>
                </li>
                <li>
                  <span className="font-medium">Party:</span>
                  <span className="text-[var(--white)]">Nigeria Democratic Congress (NDC)</span>
                </li>
                <li>
                  <span className="font-medium">Deputy Governor:</span>
                  <span className="text-[var(--white)]">Mustapha Rabiu Musa Kwankwaso</span>
                </li>
                <li>
                  <span className="font-medium">Education:</span>
                  <span className="text-[var(--muted-text)]">Professional education connected to teaching and learning</span>
                </li>
              </ul>
            </div>
          </GlassCard>

          {/* Official Portraits */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                OFFICIAL PORTRAITS
              </h3>
              <p className="text-[var(--muted-text)] text-sm mb-4">
                High-resolution images for media use.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <span className="text-[var(--muted-text)]">Primary Portrait</span>
                <span className="text-[var(--muted-text)]">Secondary Portrait</span>
              </div>
            </div>
          </GlassCard>

          {/* Campaign Logo */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                CAMPAIGN LOGO
              </h3>
              <div className="h-64 w-full rounded-3xl bg-[var(--obsidian)] flex items-center justify-center mb-4">
                <svg className="w-24 h-24 text-[var(--gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2v4M5 12h14M12 20v4" />
                </svg>
              </div>
              <p className="text-[var(--muted-text)] text-sm">
                Primary logo mark for campaign materials.
              </p>
            </div>
          </GlassCard>

          {/* Official Factsheet */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                OFFICIAL FACTSHEET
              </h3>
              <p className="text-[var(--muted-text)] text-sm mb-4">
                Key facts and figures about the candidate and campaign.
              </p>
              <ul className="space-y-3 text-[var(--muted-text)] text-sm">
                <li>Total LGAs: 44</li>
                <li>Population: ~15M</li>
                <li>Campaign: NDC governorship 2027</li>
                <li>Deputy: Mustapha Rabiu Musa Kwankwaso</li>
              </ul>
            </div>
          </GlassCard>

          {/* Timeline */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                TIMELINE
              </h3>
              <p className="text-[var(--muted-text)] text-sm">
                Key dates in the political journey.
              </p>
              <ul className="space-y-3 text-[var(--muted-text)] text-sm">
                <li>1990s: Early education career</li>
                <li>2023: Deputy Governorship</li>
                <li>2026: NDC candidacy emergence</li>
                <li>2027: Governorship election</li>
              </ul>
            </div>
          </GlassCard>

          {/* Press Releases */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                PRESS RELEASES
              </h3>
              <p className="text-[var(--muted-text)] text-sm">
                Latest campaign statements and announcements.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <span className="text-[var(--muted-text)]">2024-07-15</span>
                <span className="text-[var(--muted-text)]">2024-07-10</span>
                <span className="text-[var(--muted-text)]">2024-07-05</span>
                <span className="text-[var(--muted-text)]">2024-06-28</span>
              </div>
              <a
                href="#"
                className="mt-4 text-[var(--primary-green)] text-sm font-medium uppercase tracking-wider hover:underline"
              >
                View all press releases →
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}