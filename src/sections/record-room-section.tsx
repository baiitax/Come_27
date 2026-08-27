/* ============================================================
   THE RECORD ROOM - Section 17
   Documents. Decisions. Evidence. Public record.
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function RecordRoomSection() {
  const documentCategories = [
    { id: 'education', title: 'EDUCATION', count: 12 },
    { id: 'public-service', title: 'PUBLIC SERVICE', count: 8 },
    { id: 'elections', title: 'ELECTIONS', count: 5 },
    { id: 'appointments', title: 'APPOINTMENTS', count: 3 },
    { id: 'speeches', title: 'SPEECHES', count: 15 },
    { id: 'policy', title: 'POLICY', count: 8 },
    { id: 'legal', title: 'LEGAL/PUBLIC MATTERS', count: 4 },
  ];

  const educationDocuments = [
    { id: '1', title: 'Teacher Certification', date: '1990s', type: 'Government Document', issuing: 'Kano State Education Board', description: 'Teaching certification and qualifications', verification: 'verified' },
    { id: '2', title: 'Higher Education Credentials', date: '1995', type: 'University Document', issuing: 'University of Nigeria', description: 'University degree and transcripts', verification: 'verified' },
  ];

  const publicServiceDocuments = [
    { id: '1', title: 'Deputy Governorship Oath', date: 'August 2023', type: 'Government Appointment', issuing: 'Kano State Government', description: 'Oath of office as Deputy Governor', verification: 'official-record' },
    { id: '2', title: 'State Government Service Record', date: '2011-2015', type: 'Employment Record', issuing: 'Kano State Government', description: 'Service record from state government appointment', verification: 'official-record' },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            THE RECORD ROOM
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Documents. Decisions. Evidence. Public record.
          </p>
        </div>

        {/* Document categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {documentCategories.map((category) => (
            <GlassCard
              key={category.id}
              premium={true}
              shadow="soft"
              style={{
                border: '1px solid var(--glass-border)',
              }}
            >
              <div className="px-6 py-4 text-center">
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                     style={{
                      background: 'rgba(11, 107, 69, 0.1)',
                      color: 'var(--primary-green)',
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                    }}
                >
                  {category.id === 'speeches' ? '📜' : category.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-[var(--white)] mb-2">
                  {category.title}
                </h3>
                <p className="text-[var(--muted-text)] text-sm">
                  {category.count} documents
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Sample document cards - Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Education documents */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                EDUCATION DOCUMENTS
              </h3>
              <div className="space-y-4">
                {educationDocuments.map((doc) => (
                  <div key={doc.id} className="glass-card premium p-4">
                    <div className="flex items-between justify-between">
                      <div>
                        <h4 className="font-bold text-[var(--white)]">{doc.title}</h4>
                        <p className="text-[var(--muted-text)] text-sm">{doc.date}</p>
                      </div>
                      <EvidenceBadge
                        status={doc.verification as any}
                        size="sm"
                      />
                    </div>
                    <p className="text-[var(--muted-text)] text-sm mt-2">
                      {doc.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                      <button className="text-[var(--primary-green)] text-sm hover:underline">
                        View Document
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Public Service documents */}
          <GlassCard premium={true} shadow="soft">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-[var(--white)] mb-4">
                PUBLIC SERVICE DOCUMENTS
              </h3>
              <div className="space-y-4">
                {publicServiceDocuments.map((doc) => (
                  <div key={doc.id} className="glass-card premium p-4">
                    <div className="flex items-between justify-between">
                      <div>
                        <h4 className="font-bold text-[var(--white)]">{doc.title}</h4>
                        <p className="text-[var(--muted-text)] text-sm">{doc.date}</p>
                      </div>
                      <EvidenceBadge
                        status={doc.verification as any}
                        size="sm"
                      />
                    </div>
                    <p className="text-[var(--muted-text)] text-sm mt-2">
                      {doc.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                      <button className="text-[var(--primary-green)] text-sm hover:underline">
                        View Document
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Call to action */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)] text-center">
          <p className="text-sm text-[var(--muted-text)]">
            All documents display title, date, document type, issuing institution,
            description, and verification status. Verified documents available for
            download or viewing.
          </p>
        </div>
      </div>
    </section>
  );
}