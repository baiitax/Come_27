/* ============================================================
   THE JOURNEY SECTION - Section 13
   Horizontal/Vertical Cinematic Storytelling Timeline
   ============================================================ */
import { cn } from '@/lib/utils';

export interface TimelineChapter {
  id: string;
  year: string;
  location: string;
  role: string;
  explanation: string;
  image?: string;
  evidence?: string;
}

export const chapters: TimelineChapter[] = [
  {
    id: 'teacher',
    year: '1990s',
    location: 'Kano State',
    role: 'Teacher',
    explanation: 'Early professional life in education, impacting young minds in Kano communities.',
  },
  {
    id: 'community',
    year: '1995',
    location: 'Kano Municipal',
    role: 'Community Leader',
    explanation: 'Youth and community engagement, organizing grassroots movements and student affairs.',
  },
  {
    id: 'administrator',
    year: '1996',
    location: 'Kano Local Government',
    role: 'Grassroots Administrator',
    explanation: 'Local government leadership, managing administrative functions and community development projects.',
  },
  {
    id: 'builder',
    year: '1999–2003',
    location: 'Kano State',
    role: 'Institution Builder',
    explanation: 'Federal and state institutional responsibilities, building administrative capacity.',
  },
  {
    id: 'executive',
    year: '2011–2015',
    location: 'Kano State Government',
    role: 'State Executive',
    explanation: 'Kano State Government responsibilities, overseeing state administration and development initiatives.',
  },
  {
    id: 'federal',
    year: '2017–2019',
    location: 'Federal Capital Territory',
    role: 'Federal Governance',
    explanation: 'Federal education-sector governance, overseeing federal educational institutions and policies.',
  },
  {
    id: 'deputy',
    year: '2023',
    location: 'Kano State',
    role: 'Deputy Governor of Kano State',
    explanation: 'Deputy Governor of Kano State, serving as second-in-command of state administration.',
  },
  {
    id: 'realignment',
    year: '2022',
    location: 'Kano State',
    role: 'Political Realignment',
    explanation: 'NNPP/Kwankwasiyya political realignment, reshaping political affiliations and alliances.',
  },
  {
    id: 'candidate',
    year: 'May 2026',
    location: 'Kano State',
    role: 'NDC Governorship Candidate',
    explanation: 'Emerges as NDC Kano governorship candidate for 2027 election.',
  },
  {
    id: 'running-mate',
    year: 'June 2026',
    location: 'Kano State',
    role: 'Running Mate Announcement',
    explanation: 'Mustapha Rabiu Musa Kwankwaso announced as running mate for governorship ticket.',
  },
  {
    id: 'election',
    year: '2027',
    location: 'Kano State',
    role: 'Governorship Candidate',
    explanation: '2027 Governorship election candidate, seeking to bring decades of experience to Kano development.',
  },
];

export function JourneySection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16" data-reveal>
          <span className="section-eyebrow">The Journey</span>

          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[var(--white)] mb-4">
            THE JOURNEY
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            From the classroom to state leadership.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative" data-reveal data-delay="120">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-[var(--primary-green)] opacity-50 top-0 bottom-0"></div>

          {/* Timeline chapters */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 pt-20">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex flex-col items-center text-center pt-4"
              >
                {/* Year chip */}
                <div className="mb-2">
                  <span 
                    className="timeline-chip"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: 'var(--primary-green)',
                    }}
                  >
                    {chapter.year}
                  </span>
                </div>

                {/* Chapter content */}
                <div className="w-full">
                  <h3 className="text-lg font-medium text-[var(--white)] mb-1">
                    {chapter.role}
                  </h3>
                  <p className="text-sm text-[var(--muted-text)]">
                    {chapter.location}
                  </p>
                  <p className="text-xs text-[var(--muted-text)] mt-1 line-clamp-2">
                    {chapter.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chapter images placeholder - would be above the line on desktop */}
          {/* These would be absolute positioned with glass treatment on larger screens */}
        </div>
      </div>
    </section>
  );
}