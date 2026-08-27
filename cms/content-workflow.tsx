/* ============================================================
   CONTENT WORKFLOW - Verification pipeline for political claims
   DRAFT → RESEARCH REVIEW → FACT CHECK → EDITORIAL APPROVAL →
   CANDIDATE APPROVAL → PUBLISH
   ============================================================ */
import { cn } from '@/lib/utils';

export type ContentStatus = 
  | 'draft'
  | 'research-review'
  | 'fact-check'
  | 'editorial-approval'
  | 'candidate-approval'
  | 'published';

export type ClaimClassification = 
  | 'verified'
  | 'reported'
  | 'campaign-claim'
  | 'proposed'
  | 'under-review';

export interface ContentItem {
  id: string;
  title: string;
  status: ContentStatus;
  classification: ClaimClassification;
  source?: string;
  year?: string;
  lastUpdated?: string;
  content: string;
  approvedBy?: string;
  approvedAt?: string;
  requiresCampaignApproval: boolean;
}

export const initialStatuses: ContentStatus[] = [
  'draft',
  'research-review',
  'fact-check',
  'editorial-approval',
  'candidate-approval',
  'published',
];

export const statusTransitions: Record<ContentStatus, ContentStatus[]> = {
  draft: ['research-review'],
  'research-review': ['draft', 'fact-check'],
  'fact-check': ['research-review', 'editorial-approval'],
  'editorial-approval': ['fact-check', 'candidate-approval'],
  'candidate-approval': ['editorial-approval', 'published'],
  published: [], // terminal state
};

export function ContentWorkflowSection() {
  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-6">
        <GlassCard premium={true} shadow="soft">
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold text-[var(--white)] mb-6">
              CONTENT WORKFLOW
            </h2>

            {/* Status indicator */}
            <div className="mb-8">
              <p className="text-sm text-[var(--muted-text)] uppercase tracking-wider mb-4">
                Content item progression
              </p>
              <div className="space-x-3">
                {initialStatuses.map((status, index) => (
                  <div
                    key={status}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded text-sm',
                      status === 'published'
                        ? 'bg-[var(--primary-green)] text-[var(--white)]'
                        : status === 'candidate-approval'
                          ? 'bg-[var(--gold)] text-[var(--obsidian)]'
                          : 'text-[var(--muted-text)]')
                  }
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span className="text-xs">{status}</span>
                </div>
              </div>
              {index < initialStatuses.length - 1 && (
                <svg className="w-3 h-3 text-[var(--muted-text)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5v14" />
                </svg>
              )}
            </div>

            {/* Workflow steps */}
            <div className="grid grid-cols-3 gap-4">
              {/* Draft Step */}
              <div className="col-span-3 glass-card premium p-6">
                <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted-text)] mb-4">DRAFT</h3>
                <p className="text-[var(--muted-text)] text-sm">
                  Content author creates initial draft. All political claims, achievements,
                  statistics, and allegations are marked as unverified. No public-facing
                  content should be published from this stage.
                </p>
                <p className="mt-4 text-xs text-[var(--muted-text)]">
                  Shortcut: ⌘D or Ctrl + D to duplicate
                </p>
              </div>

              {/* Research Review Step */}
              <div className="glass-card premium p-6">
                <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted-text)] mb-4">RESEARCH REVIEW</h3>
                <p className="text-[var(--muted-text)] text-sm">
                  Research team verifies sources, checks primary documents, and assesses
                  claim feasibility. Claims are tagged with classification:
                  VERIFIED, REPORTED, CAMPAIGN CLAIM, PROPOSED, or UNDER REVIEW.
                </p>
                <p className="mt-4 text-xs text-[var(--muted-text)]">
                  Shortcut: ⌘R or Ctrl + R
                </p>
              </div>

              {/* Fact Check Step */}
              <div className="glass-card premium p-6">
                <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted-text)] mb-4">FACT CHECK</h3>
                <p className="text-[var(--muted-text)] text-sm">
                  Independent fact-checking against official records, INEC data, government
                  reports, and verified sources. Every statistic must display: Source,
                  Publication Year, Last Updated. No unverified claims pass this stage.
                </p>
                <p className="mt-4 text-xs text-[var(--muted-text)]">
                  Shortcut: ⌘F or Ctrl + F
                </p>
              </div>

              {/* Editorial Approval Step */}
              <div className="glass-card premium p-6">
                <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted-text)] mb-4">EDITORIAL APPROVAL</h3>
                <p className="text-[var(--muted-text)] text-sm">
                  Editorial team reviews for tone, consistency, clarity, and alignment with
                  brand voice: confident but not arrogant, patriotic but not inflammatory,
                  inspirational but evidence-driven, political but statesmanlike.
                </p>
                <p className="mt-4 text-xs text-[var(--muted-text)]">
                  Shortcut: ⌘E or Ctrl + E
                </p>
              </div>

              {/* Candidate Approval Step */}
              <div className="glass-card premium p-6">
                <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted-text)] mb-4">CANDIDATE/ CAMPAIGN APPROVAL</h3>
                <p className="text-[var(--muted-text)] text-sm">
                  Final approval by campaign team or candidate. Only verified achievements,
                  officially documented statistics, and approved policy positions proceed.
                  Unverified claims are explicitly labeled: "CONTENT REQUIRES CAMPAIGN
                  VERIFICATION."
                </p>
                <p className="mt-4 text-xs text-[var(--muted-text)]">
                  This is especially important for: achievements, statistics, allegations,
                  election results, legal matters, policy promises.
                </p>
              </div>

              {/* Published Step */}
              <div className="glass-card premium p-6 bg-[var(--primary-green)] text-[var(--white)]">
                <h3 className="text-sm font-medium uppercase tracking-wider mb-4">PUBLISH</h3>
                <p className="text-[var(--white)]">
                  Content is published to the website. All statistics display provenance.
                  Evidence badges show verification status. Content becomes part of the
                  living archive, updateable throughout 2026-2027 election cycle.
                </p>
              </div>
            </div>
          </div>

          {/* Workflow rules */}
          <div className="mt-8 pt-8 border-t border-[var(--glass-border)]">
            <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted-text)] mb-4">WORKFLOW RULES</h3>
            <ul className="space-y-3 text-sm text-[var(--muted-text)]">
              <li>
                <span className="font-medium text-[var(--white)]">Every political claim</span>
                <span className="ml-2 bg-[var(--gold)] text-[var(--obsidian)] px-2 py-0.5 rounded text-xs">PROPOSED</span>
              </li>
              <li>
                <span className="font-medium text-[var(--white)]">Every statistic</span>
                <span className="ml-2 bg-[var(--primary-green)] text-[var(--white)] px-2 py-0.5 rounded text-xs">SOURCE REQUIRED</span>
              </li>
              <li>
                <span className="font-medium text-[var(--white)]">Unverified claims</span>
                <span className="ml-2 bg-[var(--glass-border)] text-[var(--muted-text)] px-2 py-0.5 rounded text-xs">LABELED</span>
              </li>
              <li>
                <span className="font-medium text-[var(--white)]">Before election</span>
                <span className="ml-2 bg-[var(--gold)] text-[var(--obsidian)] px-2 py-0.5 rounded text-xs">PROPOSED</span>
              </li>
              <li>
                <span className="font-medium text-[var(--white)]">After election</span>
                <span className="ml-2 bg-[var(--primary-green)] text-[var(--white)] px-2 py-0.5 rounded text-xs">TRACKED</span>
              </li>
            </ul>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}