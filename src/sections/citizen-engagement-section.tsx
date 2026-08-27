/* ============================================================
   CITIZEN ENGAGEMENT - Sections 37-38
   Talk to Gwarzo form and Community Priority Map
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function CitizenEngagementSection() {
  return (
    <section id="voice" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14 text-center" data-reveal>
          <span className="section-eyebrow">Your Voice</span>
          <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold tracking-tight text-[var(--white)]">
            ENGAGE THE CAMPAIGN
          </h2>
          <div className="gold-rule mx-auto mt-6 w-40"></div>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted-text)]">
            Ask a question, raise a community priority, or flag a fact for review. Every submission is public.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-reveal data-delay="120">

          {/* Talk to Gwarzo form */}
          <div>
            <div className="glass-card premium p-6">
              <h2 className="text-2xl font-bold text-[var(--white)] mb-6">
                TALK TO GWARZO
              </h2>
              <p className="text-[var(--muted-text)] text-sm mb-8">
                Visitors can submit questions, community priorities, development ideas,
                and policy feedback.
              </p>

              <form className="space-y-4">
                {/* Name field - optional */}
                <div>
                  <label className="text-sm text-[var(--muted-text)] uppercase tracking-wider mb-2">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full glass-card premium p-3 mb-4"
                    style={{
                      background: 'var(--glass-surface)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--white)',
                    }}
                  />
                </div>

                {/* LGA field */}
                <div>
                  <label className="text-sm text-[var(--muted-text)] uppercase tracking-wider mb-2">
                    LGA
                  </label>
                  <select
                    className="w-full glass-card premium p-3 mb-4"
                    style={{
                      background: 'var(--glass-surface)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--white)',
                    }}
                  >
                    <option value="">Select LGA</option>
                    {/* LGAs would be populated here */}
                  </select>
                </div>

                {/* Topic field */}
                <div>
                  <label className="text-sm text-[var(--muted-text)] uppercase tracking-wider mb-2">
                    Topic
                  </label>
                  <select
                    className="w-full glass-card premium p-3 mb-4"
                    style={{
                      background: 'var(--glass-surface)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--white)',
                    }}
                  >
                    <option value="">Select topic</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="jobs">Jobs & Enterprise</option>
                    <option value="water">Water & Sanitation</option>
                    <option value="roads">Roads & Infrastructure</option>
                    <option value="security">Security & Community</option>
                    <option value="housing">Housing</option>
                    <option value="digital">Digital Economy</option>
                  </select>
                </div>

                {/* Message field */}
                <div>
                  <label className="text-sm text-[var(--muted-text)] uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share your thoughts, priorities, or ideas for Kano's development..."
                    className="w-full glass-card premium p-3 mb-6 resize-none"
                    style={{
                      background: 'var(--glass-surface)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--white)',
                    }}
                  /></div>

                  {/* Consent */}
                  <div>
                    <label className="flex items-start text-sm">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-[var(--glass-border)] margin-right-2"
                        required
                      />
                      <span className="text-[var(--muted-text)]">
                        I consent to my submission being used to improve public dialogue.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary"
                  >
                    SUBMIT
                  </button>
                </form>
              </div>
          </div>

          {/* Community Priority Map */}
          <div>
            <div className="glass-card premium p-6">
              <h2 className="text-2xl font-bold text-[var(--white)] mb-6">
                COMMUNITY PRIORITY MAP
              </h2>
              <p className="text-[var(--muted-text)] text-sm mb-8">
                Aggregate citizen submissions by LGA. Display: Top Issues by LGA.
                These numbers should only appear after actual data is collected.
              </p>

              {/* Priority cards - empty state until data collected */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="glass-card premium p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--primary-green)] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--white)]">Education</p>
                      <p className="text-[var(--muted-text)]">0%</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card premium p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--gold)] flex items-center justify-center">
                      <svg className="w-4 h-4 text-[var(--obsidian)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--white)]">Water</p>
                      <p className="text-[var(--muted-text)]">0%</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card premium p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--danger)] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--white)]">Roads</p>
                      <p className="text-[var(--muted-text)]">0%</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card premium p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--primary-green)] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--white)]">Healthcare</p>
                      <p className="text-[var(--muted-text)]">0%</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-[var(--muted-text)]">
                Data will appear here as citizen submissions are collected. Your voice matters.
              </p>
          </div>
        </div>
      </div>
      </div>
</section>
  );
}