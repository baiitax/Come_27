/* ============================================================
   KWANKWASIYYA MOVEMENT SECTION - Section 19
   Political history without making movement larger than candidate
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function KwankwasiyyaSection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Background pattern */}
        <div className="absolute inset-0 pattern-kano opacity-60 z-0"></div>

        {/* Section header */}
        <div className="relative z-10 mb-16" data-reveal>
          <span className="section-eyebrow">Kwankwasiya</span>

          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[var(--white)] mb-4">
            THE MOVEMENT
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Understanding the political tradition that shaped a generation of Kano leadership.
          </p>
        </div>

        {/* Timeline relationship visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16" data-reveal data-delay="120">
          {/* Kwankwasiyya Movement column */}
          <div className="glass-card premium p-6">
            <h3 className="text-xl font-bold text-[var(--white)] mb-4">
              KWANKWASIYYA MOVEMENT
            </h3>
            <ul className="space-y-3 text-[var(--muted-text)]">
              <li>
                <span className="font-medium">Founded:</span> 1991
              </li>
              <li>
                <span className="font-medium">Founder:</span> Rabiu Musa Kwankwaso
              </li>
              <li>
                <span className="font-medium">Core Philosophy:</span> 
                Grassroots development, infrastructure, education
              </li>
              <li>
                <span className="font-medium">Strength:</span> 
                Massive grassroots structure across Kano's 44 LGAs
              </li>
              <li>
                <span className="font-medium">Ideology:</span> 
                People-centered development, northern Nigerian interests
              </li>
            </ul>
          </div>

          {/* Gwarzo's Journey column */}
          <div className="glass-card premium p-6">
            <h3 className="text-xl font-bold text-[var(--white)] mb-4">
              GWARZO'S POLITICAL JOURNEY
            </h3>
            <ul className="space-y-3 text-[var(--muted-text)]">
              <li>
                <span className="font-medium">Association:</span> 
                Member/Kwankwasiyya structure
              </li>
              <li>
                <span className="font-medium">Deputy Governorship:</span> 
                Appointed 2023 under Kwankwasiyya framework
              </li>
              <li>
                <span className="font-medium">Realignment:</span> 
                2022 NNPP/Kwankwasiyya political realignment
              </li>
              <li>
                <span className="font-medium">Current Candidacy:</span> 
                NDC governorship candidate 2027
              </li>
              <li>
                <span className="font-medium">Principle:</span> 
                Movement heritage + Individual leadership
              </li>
            </ul>
          </div>

          {/* Relationship visual */}
          <div className="glass-card premium p-6">
            <h3 className="text-xl font-bold text-[var(--white)] mb-4">
              MOVEMENT → CANDIDACY
            </h3>
            <div className="space-y-4">
              <p className="text-[var(--muted-text)]">
                The Kwankwasiyya movement provided the foundation and grassroots structure that shaped
                Comarade Gwarzo's political development over two decades of service.
              </p>
              <p className="text-[var(--muted-text)]">
                His individual leadership identity is now charting a new responsibility to Kano through
                the Nigeria Democratic Congress platform.
              </p>
              <div className="pt-4 border-t border-[var(--glass-border)]">
                <p className="text-sm font-medium text-[var(--primary-green)]">
                  KWANKWASIYYA MOVEMENT ↓ GWARZO'S POLITICAL JOURNEY ↓ 2027 NDC CANDIDACY
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key disclaimer */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)] text-center">
          <p className="text-sm text-[var(--muted-text)]">
            Position Gwarzo within the movement without making the movement larger than the candidate.
            Every allegation must be clearly attributed. Do not imply that Kwankwaso personally controls
            every aspect of Gwarzo's leadership unless supported by an official statement.
          </p>
        </div>
      </div>
    </section>
  );
}