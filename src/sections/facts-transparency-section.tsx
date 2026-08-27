/* ============================================================
   FACTS & TRANSPARENCY - Section 35
   Prominent section with fact-checking, public record, media claims
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';
import { EvidenceBadge } from '../components/evidence/evidence-badge';

export function FactsTransparencySection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fact Check Card */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                FACT CHECK
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[var(--muted-text)] uppercase tracking-wider mb-2">CLAIM</p>
                  <p className="text-[var(--white)] line-clamp-3">"Kano's literacy rate is 95%"</p>
                </div>
                <div>
                  <p className="text-[var(--muted-text)] uppercase tracking-wider mb-2">VERDICT</p>
                  <EvidenceBadge
                    status="under-review"
                    size="sm"
                    style={{
                      background: 'rgba(168, 181, 175, 0.2)',
                      color: '#A8B5AF',
                      border: '1px solid rgba(168, 181, 175, 0.4)',
                    }}
                  />
                  <p className="text-[var(--muted-text)] ml-2">Under review</p>
                </div>
              </div>
              <p className="mt-4 text-[var(--muted-text)] text-xs">
                Evidence: INEC 2023 data | Last verified: June 2024
              </p>
            </div>
          </GlassCard>

          {/* Public Record Card */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                PUBLIC RECORD
              </h3>
              <ul className="space-y-3 text-[var(--muted-text)]">
                <li className="flex items-start">
                  <EvidenceBadge
                    status="verified"
                    style={{ marginRight: '6px', top: '4px' }}
                  />
                  <span>Deputy Governorship service: 2023 - verified through Kano State Government records</span>
                </li>
                <li className="flex items-start">
                  <EvidenceBadge
                    status="official-record"
                    style={{ marginRight: '6px', top: '4px' }}
                  />
                  <span>Federal education governance: 2017-2019 - official ministry records</span>
                </li>
                <li className="flex items-start">
                  <EvidenceBadge
                    status="campaign-document"
                    style={{ marginRight: '6px', top: '4px' }}
                  />
                  <span>Grassroots programs: 1995-2000 - campaign documentation</span>
                </li>
              </ul>
            </div>
          </GlassCard>

          {/* Media Claims Card */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                MEDIA CLAIMS
              </h3>
              <p className="text-[var(--muted-text)] text-sm">
                Media reports and public statements requiring verification are categorized
                with evidence badges. Every claim links to source documentation.
              </p>
              <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                <p className="text-xs text-[var(--muted-text)]">
                  All media claims tagged with: VERIFIED | REPORTED | CAMPAIGN CLAIM |
                  PROPOSED | UNDER REVIEW
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Candidate Responses */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)]">
          <h3 className="text-xl font-bold text-[var(--white)] mb-6 text-center">
            CANDIDATE RESPONSES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              className="w-full px-6 py-4 text-left text-[var(--white)] text-sm font-medium glass-card premium hover:translate-y-[-2px] transition-transform"
              aria-label="Read candidate response to claim 1"
            >
              <div className="flex items-start gap-3">
                <EvidenceBadge
                  status="verified"
                  style={{ flexShrink: 0, marginRight: '6px' }}
                />
                <div>
                  <p className="font-medium">Response to literacy rate claim</p>
                  <p className="text-[var(--muted-text)] text-xs">View full response →</p>
                </div>
              </div>
            </button>
            <button
              className="w-full px-6 py-4 text-left text-[var(--white)] text-sm font-medium glass-card premium hover:translate-y-[-2px] transition-transform"
              aria-label="Read candidate response to claim 2"
            >
              <div className="flex items-start gap-3">
                <EvidenceBadge
                  status="under-review"
                  style={{ flexShrink: 0, marginRight: '6px' }}
                />
                <div>
                  <p className="font-medium">Response to security statistics</p>
                  <p className="text-[var(--muted-text)] text-xs">View full response →</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}