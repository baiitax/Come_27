/* ============================================================
   PUBLIC SERVICE RECORD SECTION - Section 15
   Database-style interface with filters
   ============================================================ */
import { cn } from '@/lib/utils';
import { EvidenceBadge } from '../components/evidence/evidence-badge';

export interface ServiceRecord {
  id: string;
  year: string;
  role: string;
  institution: string;
  location: string;
  responsibility: string;
  impact: string;
  evidence: string[];
  filters: string[];
}

const mockRecords: ServiceRecord[] = [
  {
    id: '1',
    year: '2023',
    role: 'Deputy Governor of Kano State',
    institution: 'Kano State Government',
    location: 'Kano State',
    responsibility: 'Overseeing state administration and development initiatives',
    impact: 'Coordinated 44 LGAs development projects',
    evidence: ['official-record', 'campaign-document'],
    filters: ['executive', 'state-government'],
  },
  {
    id: '2',
    year: '2017–2019',
    role: 'Federal Education Sector Governance',
    institution: 'Federal Ministry of Education',
    location: 'Abuja, FCT',
    responsibility: 'Overseeing federal educational institutions and policies',
    impact: 'Reform of 25+ federal education agencies',
    evidence: ['official-record', 'media-report'],
    filters: ['federal', 'education'],
  },
  {
    id: '3',
    year: '2011–2015',
    role: 'State Government Official',
    institution: 'Kano State Government',
    location: 'Kano State',
    responsibility: 'State administration and policy implementation',
    impact: 'Development across 15 LGAs',
    evidence: ['official-record'],
    filters: ['state-government'],
  },
  {
    id: '4',
    year: '1996',
    role: 'Local Government Administrator',
    institution: 'Kano Municipal Government',
    location: 'Kano Municipal',
    responsibility: 'Local government administration and community development',
    impact: 'Grassroots project implementation across 7 LGAs',
    evidence: ['official-record', 'media-report'],
    filters: ['local-government'],
  },
  {
    id: '5',
    year: '1995',
    role: 'Community Leader',
    institution: 'Kano Youth Forum',
    location: 'Kano State',
    responsibility: 'Youth empowerment and grassroots mobilization',
    impact: '30+ youth programs established',
    evidence: ['campaign-document'],
    filters: ['community', 'youth'],
  },
  {
    id: '6',
    year: '1990s',
    role: 'Teacher',
    institution: 'Kano State Education Board',
    location: 'Kano State',
    responsibility: 'Classroom instruction and educational development',
    impact: 'Teaching generations of Kano students',
    evidence: ['official-record'],
    filters: ['education'],
  },
];

export function PublicServiceRecordSection() {
  const [filter, setFilter] = React.useState<'all' | keyof typeof mockRecords['filters'>]('all');
  const [sort, setSort] = React.useState<'newest' | 'oldest'>('newest');

  const filteredRecords = mockRecords.filter((record) => {
    if (filter === 'all') return true;
    return record.filters.includes(filter);
  });

  const sortedRecords = sort === 'newest'
    ? filteredRecords.sort((a, b) => parseInt(b.year) - parseInt(a.year))
    : filteredRecords.sort((a, b) => parseInt(a.year) - parseInt(b.year));

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            THE RECORD
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            A public-service journey measured by responsibility, not rhetoric.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-2 text-sm font-medium uppercase tracking-wider',
              filter === 'all' 
                ? 'bg-[var(--primary-green)] text-[var(--white)]'
                : 'text-[var(--muted-text)] hover:text-[var(--white)] hover:bg-transparent')
            }}
          >
            All
          </button>
          {['education', 'local-government', 'state-government', 'federal', 'executive', 'youth', 'community'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 text-sm font-medium uppercase tracking-wider',
                filter === f
                  ? 'bg-[var(--glass-surface)] text-[var(--white)] border border-[var(--glass-border)]'
                  : 'text-[var(--muted-text)] hover:text-[var(--white)] hover:bg-[var(--glass-surface)]')
              }}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Records grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {sortedRecords.map((record) => (
            <div
              key={record.id}
              className="glass-card premium pb-8"
              style={{
                animation: `fadeSlideUp 0.6s ease-out ${record.id}-delay var(--transition-medium)`,
              }}
            >
              <div className="px-6 pt-6">
                {/* Year header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-[var(--muted-text)] uppercase tracking-wider">{record.year}</p>
                    <h3 className="text-xl font-bold text-[var(--white)]">{record.role}</h3>
                  </div>
                  <EvidenceBadge
                    status={record.evidence.includes('official-record') ? 'official-record' : 'verified'}
                    size="sm"
                  />
                </div>

                {/* Key details grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-[var(--muted-text)] uppercase tracking-wider">INSTITUTION</p>
                    <p className="text-[var(--white)] font-medium">{record.institution}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-text)] uppercase tracking-wider">LOCATION</p>
                    <p className="text-[var(--white)] font-medium">{record.location}</p>
                  </div>
                </div>

                {/* Responsibility */}
                <p className="text-[var(--muted-text)] mb-4 line-clamp-3">
                  {record.responsibility}
                </p>

                {/* Impact */}
                <p className="text-sm text-[var(--primary-green)] mb-6">
                  Impact: {record.impact}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    className="flex-1 px-4 py-2 text-sm font-medium text-[var(--primary-green)] rounded"
                    aria-label="View document for {record.role}"
                  >
                    VIEW DOCUMENT
                  </button>
                  <button
                    className="flex-1 px-4 py-2 text-sm font-medium text-[var(--muted-text)] rounded"
                  >
                    MORE DETAILS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}