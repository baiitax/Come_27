/* ============================================================
   GOVERNMENT PERFORMANCE SCORECARD - Section 29
   Before/after election accountability dashboard
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function GovernmentPerformanceScorecard() {
  const commitments = [
    { id: 'education', title: 'Education', target: 'Defined target', status: 'pending', evidence: '—' },
    { id: 'healthcare', title: 'Healthcare', target: 'Defined target', status: 'pending', evidence: '—' },
    { id: 'water', title: 'Water', target: 'Defined target', status: 'pending', evidence: '—' },
    { id: 'roads', title: 'Roads', target: 'Defined target', status: 'pending', evidence: '—' },
    { id: 'security', title: 'Security', target: 'Defined target', status: 'pending', evidence: '—' },
  ];

  const beforeElection = [
    { id: 'education', statusLabel: 'PROPOSED', statusColor: 'var(--gold)' },
    { id: 'healthcare', statusLabel: 'PROPOSED', statusColor: 'var(--gold)' },
    { id: 'water', statusLabel: 'PROPOSED', statusColor: 'var(--gold)' },
    { id: 'roads', statusLabel: 'PROPOSED', statusColor: 'var(--gold)' },
    { id: 'security', statusLabel: 'PROPOSED', statusColor: 'var(--gold)' },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            GOVERNMENT PERFORMANCE SCORECARD
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Establishing accountability from day one.
          </p>
        </div>

        {/* Before election section */}
        <div className="glass-card premium p-8 mb-12">
          <h3 className="text-2xl font-bold text-[var(--white)] mb-6">
            BEFORE ELECTION
          </h3>
          <p className="text-[var(--muted-text)] text-sm mb-8">
            Proposed commitments for Kano's future development.
          </p>

          {/* Scorecard table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--glass-border)]">
                  <th className="text-left text-[var(--muted-text)] uppercase tracking-wider p-2">Commitment</th>
                  <th className="text-left text-[var(--muted-text)] uppercase tracking-wider p-2">Target</th>
                  <th className="text-left text-[var(--muted-text)] uppercase tracking-wider p-2">Status</th>
                  <th className="text-left text-[var(--muted-text)] uppercase tracking-wider p-2">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {commitments.map((commitment) => (
                  <tr key={commitment.id} className="border-b border-[var(--glass-border)]">
                    <td className="p-2 font-medium text-[var(--white)]">{commitment.title}</td>
                    <td className="p-2 text-[var(--muted-text)]">{commitment.target}</td>
                    <td className="p-2">
                      <span className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        beforeElection[commitment.id as keyof typeof beforeElection].statusColor === 'var(--gold)'
                          ? 'bg-[var(--gold)] text-[var(--obsidian)]'
                          : ''
                      )}>
                        {beforeElection[commitment.id as keyof typeof beforeElection].statusLabel}
                      </span>
                    </td>
                    <td className="p-2 text-[var(--muted-text)]">{commitment.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* After election conversion note */}
        <div className="pt-8 border-t border-[var(--glass-border)]">
          <p className="text-sm text-[var(--muted-text)]">
            After election: Convert to DELIVERED / IN PROGRESS / DELAYED / COMPLETED
          </p>
          <p className="text-xs text-[var(--muted-text)] mt-2">
            This establishes accountability from day one. Citizens can track progress
            against the commitments made during the campaign.
          </p>
        </div>
      </div>
    </section>
  );
}