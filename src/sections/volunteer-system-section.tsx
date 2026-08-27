/* ============================================================
   VOLUNTEER SYSTEM - Section 39
   JOIN THE CAMPAIGN engagement module
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function VolunteerSystemSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            VOLUNTEER SYSTEM
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            JOIN THE CAMPAIGN
          </p>
        </div>

        <GlassCard premium={true} shadow="soft">
          <div className="px-8 pt-8 pb-6">
            <h3 className="text-2xl font-bold text-[var(--white)] mb-6">
              JOIN THE CAMPAIGN
            </h3>

            {/* Form steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Step 1: Personal */}
              <div className="glass-card premium p-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--primary-green)]/20 mx-auto mb-4">
                  <svg className="w-7 h-7 text-[var(--primary-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <line x1="18" y1="17" x2="18" y2="21" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-[var(--white)] mb-2">Personal Information</h4>
                <p className="text-[var(--muted-text)] text-sm">
                  Name, LGA, contact details
                </p>
              </div>

              {/* Step 2: Area */}
              <div className="glass-card premium p-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--gold)]/20 mx-auto mb-4">
                  <svg className="w-7 h-7 text-[var(--gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2v4M10 8l-4 4l8-8l-4 4" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-[var(--white)] mb-2">LGA &amp; Area</h4>
                <p className="text-[var(--muted-text)] text-sm">
                  General area/ward where appropriate
                </p>
              </div>

              {/* Step 3: Skills */}
              <div className="glass-card premium p-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--glass-border)]/50 mx-auto mb-4">
                  <svg className="w-7 h-7 text-[var(--muted-text)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M13 2L3 14h4l10 12h-4l-4-8h12l-4 8h-4z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-[var(--white)] mb-2">Skills &amp; Involvement</h4>
                <p className="text-[var(--muted-text)] text-sm">
                  Skills, preferred involvement type
                </p>
              </div>
            </div>
          </div>

          {/* Form fields */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Name */}
            <div>
              <label className="text-sm text-[var(--muted-text)] uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                placeholder="Full name (optional)"
                className="w-full glass-card premium p-3"
                style={{
                  background: 'var(--glass-surface)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--white)',
                }}
              />
            </div>

            {/* LGA */}
            <div>
              <label className="text-sm text-[var(--muted-text)] uppercase tracking-wider mb-2">LGA</label>
              <select
                className="w-full glass-card premium p-3"
                style={{
                  background: 'var(--glass-surface)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--white)',
                }}
              >
                <option value="">Select LGA</option>
                {/* LGAs would be populated */}
              </select>
            </div>

            {/* Skills */}
            <div>
              <label className="text-sm text-[var(--muted-text)] uppercase tracking-wider mb-2">Skills</label>
              <textarea
                rows={2}
                placeholder="e.g. organizing, digital media, logistics, teaching, community mobilization..."
                className="w-full glass-card premium p-3 resize-none"
                style={{
                  background: 'var(--glass-surface)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--white)',
                }}
              /></div>

              {/* Preferred involvement */}
              <div>
                <label className="text-sm text-[var(--muted-text)] uppercase tracking-wider mb-2">
                  Preferred involvement
                </label>
                <select
                  className="w-full glass-card premium p-3"
                  style={{
                    background: 'var(--glass-surface)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--white)',
                  }}
                >
                  <option value="">Select involvement type</option>
                  <option value="town-hall">Town Hall</option>
                  <option value="policy-dialogue">Policy Dialogue</option>
                  <option value="community-visit">Community Visit</option>
                  <option value="education">Education</option>
                  <option value="youth">Youth</option>
                  <option value="women">Women</option>
                  <option value="professional">Professional</option>
                  <option value="religious">Religious/Community Engagement</option>
                </select>
              </div>

              {/* Contact */}
              <div>
                <label className="text-sm text-[var(--muted-text)] uppercase tracking-wider mb-2">Email/Phone</label>
                <input
                  type="email"
                  placeholder="contact@email.com"
                  className="w-full glass-card premium p-3"
                  style={{
                    background: 'var(--glass-surface)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--white)',
                  }}
                />
              </div>

              {/* Consent */}
              <div>
                <label className="flex items-start text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[var(--glass-border)] margin-right-2"
                    required
                  />
                  <span className="text-[var(--muted-text)]">
                    I consent to receive campaign communications.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full btn-primary"
                  aria-label="Join the campaign as volunteer"
                >
                  JOIN THE CAMPAIGN
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}