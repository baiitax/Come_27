/* ============================================================
   FINAL CTA - Section 15/62
   The complete visitor experience sequence closer
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function FinalCTASection() {
  return (
    <section className="py-24 md:py-32 bg-[var(--obsidian)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative z-10">
          {/* Gold decorative line */}
          <div className="h-px w-full bg-[var(--gold)] opacity-50 mb-8"></div>

          <div className="glass-card premium p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text content */}
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
                  This is not simply a candidate's website.
                </h2>
                <p className="text-[var(--muted-text)] text-lg mb-6">
                  This is a documented leadership journey and a proposed governance platform
                  for Kano.
                </p>

                {/* The brand tagline */}
                <div className="mt-8 pt-8 border-t border-[var(--glass-border)]">
                  <h3 className="text-3xl md:text-4xl font-bold text-[var(--white)] mb-2">
                    AMINU ABDUSSALAM GWARZO
                  </h3>
                  <p className="text-[var(--gold)] text-2xl md:text-lg">
                    A LIFETIME OF SERVICE.
                  </p>
                  <p className="text-[var(--muted-text)] text-sm">
                    A NEW RESPONSIBILITY TO KANO.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div>
                <button
                  className="btn-primary w-full md:w-auto mb-4"
                  aria-label="Explore Comrade Gwarzo's record"
                >
                  EXPLORE THE RECORD
                </button>
                <button
                  className="btn-secondary w-full md:w-auto"
                  aria-label="Discover Kano's future vision"
                >
                  DISCOVER THE VISION
                </button>
              </div>
            </div>

            {/* Visual element - simplified */}
            <div className="lg:hidden hidden">
              <p className="text-[var(--muted-text)] text-center mt-8">
                Scroll to explore more
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}