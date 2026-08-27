/* ============================================================
   GWARZO + MUSTAPHA GOVERNANCE TEAM - Section 29
   Premium two-person leadership section
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function GwarzoMustaphaSection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative mb-16">
          {/* Decorative gold line */}
          <div className="h-px w-full bg-[var(--gold)] opacity-50 mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Gwarzo Profile */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
                THE GOVERNANCE TEAM
              </h2>
              <p className="text-[var(--muted-text)] text-lg mb-8">
                Complementary leadership for Kano's future.
              </p>
            </div>

            {/* Gwarzo Card */}
            <GlassCard premium={true} shadow="medium">
              <div className="px-6 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--primary-green)] flex items-center justify-center">
                    <span className="text-[var(--white)] text-xl font-bold">AG</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--white)]">
                      AMINU ABDUSSALAM GWARZO
                    </h3>
                    <p className="text-[var(--muted-text)] text-sm">
                      Candidate for Governor
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-[var(--muted-text)] uppercase tracking-wider">Experience</dt>
                    <dd className="text-[var(--white)]">Deputy Governor of Kano State</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted-text)] uppercase tracking-wider">Grassroots</dt>
                    <dd className="text-[var(--white)]">Decades of community leadership</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted-text)] uppercase tracking-wider</dt>
                    <dd className="text-[var(--white)]">Ideology</dt>
                    <dd className="text-[var(--white)]">Kwankwasiyya tradition</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted-text)] uppercase tracking-wider">Role</dt>
                    <dd className="text-[var(--white)]">Governor of Kano State</dd>
                  </div>
                </dl>

                <EvidenceBadge
                  status="official-record"
                  size="sm"
                  className="mt-4"
                />
              </div>
            </GlassCard>

            {/* Mustapha Card */}
            <GlassCard premium={true} shadow="medium">
              <div className="px-6 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--gold)] flex items-center justify-center">
                    <span className="text-[var(--obsidian)] text-xl font-bold">MK</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--white)]">
                      MUSTAPHA RABIU MUSA KWANKWASO
                    </h3>
                    <p className="text-[var(--muted-text)] text-sm">
                      Candidate for Deputy Governor
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-[var(--muted-text)] uppercase tracking-wider">Experience</dt>
                    <dd className="text-[var(--white)]}">Former Governor of Kano State</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted-text)] uppercase tracking-wider">Youth Engagement</dt>
                    <dd className="text-[var(--white)]">Next generation connection</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted-text)] uppercase tracking-wider">Ideology</dt>
                    <dd className="text-[var(--white)]">Kwankwasiyya tradition</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted-text)] uppercase tracking-wider">Role</dt>
                    <dd className="text-[var(--white)]">Deputy Governor</dd>
                  </div>
                </dl>

                <EvidenceBadge
                  status="official-record"
                  size="sm"
                  className="mt-4"
                />
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Complementary strengths */}
        <div className="grid grid-cols-2 gap-6 mt-12">
          <div>
            <h3 className="text-xl font-bold text-[var(--white)] mb-4">
              Experience + Youth
            </h3>
            <ul className="space-y-3 text-[var(--muted-text)]">
              <li>Gwarzo: Decades of executive experience</li>
              <li>Mustapha: Youth engagement and innovation</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--white)] mb-4">
              Institution + Innovation
            </h3>
            <ul className="space-y-3 text-[var(--muted-text)]">
              <li>Gwarzo: Institutional governance</li>
              <li>Mustapha: New ideas and approaches</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}