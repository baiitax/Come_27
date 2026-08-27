/* ============================================================
   POLICY DETAIL PAGE - Section 25/26
   Each policy contains: PROBLEM, EVIDENCE, VISION, APPROACH,
   PROGRAMMES, DELIVERY MODEL, METRICS, TIMELINE, ACCOUNTABILITY
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';
import { EvidenceBadge } from '../components/evidence/evidence-badge';

/* Sample policy data - structure only, content would be verified */
const samplePolicy = {
  id: 'security',
  title: 'Security & Community Protection',
  number: 1,
  problem: {
    title: 'THE PROBLEM',
    question: 'What is wrong?',
    content: 'Kano state faces security challenges including communal clashes, crime, and public safety concerns that require comprehensive and coordinated government response.',
    evidence: {
      title: 'THE EVIDENCE',
      question: 'What does the data show?',
      content: 'Statistical data on security incidents, crime rates, and community safety indicators across Kano\'s 44 LGAs. All data sourced from verified police reports and security agency publications.',
      badge: 'verified' as const,
    },
    vision: {
      title: 'THE VISION',
      question: 'What should Kano become?',
      content: 'A safer Kano where communities can live, work, and thrive without fear of violence or insecurity. A state where citizens feel protected and can go about their daily activities.',
    },
  },
  approach: {
    title: 'THE APPROACH',
    question: 'How will government respond?',
    content: 'A multi-layered approach involving community policing, intelligence-led operations, youth engagement, and partnership with traditional and religious institutions. Focus on root cause prevention rather than reactive measures.',
    programmes: [
      'Community policing initiatives across all 44 LGAs',
      'Youth empowerment and mentorship programmes',
      'Traditional institution partnership for conflict resolution',
      'Intelligence sharing and modern security technology',
    ],
    deliveryModel: {
      title: 'THE DELIVERY MODEL',
      question: 'Which ministry/institution?',
      content: 'Ministry of Internal Security and Home Affairs, working in coordination with the Ministry of Justice, Ministry of Youth and Sport Development, and State Security Services. Coordination with local government areas for grassroots implementation.',
    },
    metrics: {
      title: 'THE METRICS',
      question: 'How will success be measured?',
      content: 'Reduction in security incident rates by 50% within 2 years. Improved community perception of safety. Increased youth engagement in peacebuilding. Response time to security incidents.',
      indicators: [
        { name: 'Incident rate', target: '50% reduction', baseline: '2023 data' },
        { name: 'Community confidence', target: '80% positive', baseline: '2023 survey' },
        { name: 'Youth participation', target: '30% increase', baseline: '2023 data' },
      ],
    },
    timeline: {
      title: 'THE TIMELINE',
      question: 'Immediate / medium / long-term?',
      content: 'IMMEDIATE (0-6 months): Establish community policing structures, deploy intelligence resources. MEDIUM (6-24 months): Youth programmes, institution building, infrastructure. LONG-TERM (2-4 years): Sustainable security culture, institutionalized prevention.',
      phases: [
        { name: 'Immediate', period: '0-6 months', focus: 'Rapid response and structure setup' },
        { name: 'Medium', period: '6-24 months', focus: 'Programme implementation and expansion' },
        { name: 'Long-term', period: '2-4 years', focus: 'Sustainable culture and institutionalization' },
      ],
    },
    accountability: {
      title: 'THE ACCOUNTABILITY',
      question: 'How citizens will track progress?',
      content: 'Public dashboard with real-time incident data. Community feedback mechanisms. Quarterly public reports. Independent monitoring by civil society. Citizen complaint portal.',
    },
  },
};

/* ============================================================
   POLICY CARD COMPONENT (for the 10 pillars overview)
   ============================================================ */
interface PolicyCardProps {
  id: string;
  title: string;
  number: number;
  onDetail?: () => void;
}

export function PolicyCard({ id, title, number, onDetail }: PolicyCardProps) {
  return (
    <GlassCard premium={true} shadow="soft" onClick={onDetail}>
      <div className="px-6 py-5 flex items-start justify-between">
        <div>
          <span className="pillar-number">{number}</span>
          <h3 className="text-xl font-bold text-[var(--white)]">{title}</h3>
        </div>
        <EvidenceBadge
          status="proposed"
          size="sm"
          style={{ background: 'rgba(168, 181, 175, 0.2)', color: '#A8B5AF' }}
        />
      </div>
    </GlassCard>
  );
}

/* ============================================================
   POLICY DETAIL MODAL/SECTION
   ============================================================ */
export function PolicyDetailSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            2027 VISION FOR KANO
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Ten proposed policy pillars for Kano's future.
          </p>
        </div>

        {/* Policy pillars overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const titles = [
              'Security & Community Protection',
              'Education & Human Capital',
              'Healthcare',
              'Agriculture & Food Security',
              'Jobs & Enterprise',
              'Water & Sanitation',
              'Infrastructure & Urban Development',
              'Industrialization',
              'Local Government Reform',
              'Digital Government',
            ];
            return (
              <PolicyCard
                key={num}
                id=`policy-${num}`
                title={titles[num - 1]}
                number={num}
                onDetail={() => {
                  // Would navigate to detailed policy page
                }}
              />
            );
          })}
        </div>

        {/* Note about manifesto */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)] text-center">
          <p className="text-sm text-[var(--muted-text)]">
            These are a proposed information architecture and must be replaced or adapted to
            the official manifesto once released. Policy details subject to campaign verification.
          </p>
        </div>
      </div>
    </section>
  );
}