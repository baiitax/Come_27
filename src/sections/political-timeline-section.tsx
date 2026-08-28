/* ============================================================
   INTERACTIVE POLITICAL TIMELINE - Section 14
   Vertical timeline with verified dates and descriptions
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export interface TimelineEvent {
  year: string;
  location: string;
  role: string;
  explanation: string;
  evidence?: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '1960',
    location: 'Gwarzo, Kano State',
    role: 'Born',
    explanation: 'Comarade Aminu Abdussalam Gwarzo born in Gwarzo, Kano State.',
  },
  {
    year: '1977',
    location: 'Kano State',
    role: 'Begins teaching/public-service journey',
    explanation: 'Starts teaching and public-service journey, beginning his connection to Kano communities.',
  },
  {
    year: '1980s',
    location: 'Kano State',
    role: 'Professional education and public-sector experience',
    explanation: 'Professional education and public-sector experience, building foundation for future leadership.',
  },
  {
    year: '1990s',
    location: 'Kano State',
    role: 'Early professional life',
    explanation: 'Early professional life in education, impacting young minds in Kano communities.',
  },
  {
    year: '1995',
    location: 'Kano Municipal',
    role: 'Community Leader',
    explanation: 'Youth and community engagement, organizing grassroots movements and student affairs.',
  },
  {
    year: '1996',
    location: 'Kano Local Government',
    role: 'Grassroots Administrator',
    explanation: 'Local government leadership, managing administrative functions and community development projects.',
  },
  {
    year: '1999–2003',
    location: 'Kano State',
    role: 'Institution Builder',
    explanation: 'Federal and state institutional responsibilities, building administrative capacity.',
  },
  {
    year: '2000s',
    location: 'Kano State',
    role: 'Further local-government and institutional responsibilities',
    explanation: 'Continued local-government and institutional responsibilities, expanding administrative experience.',
  },
  {
    year: '2011–2015',
    location: 'Kano State Government',
    role: 'Kano State Government responsibilities',
    explanation: 'Kano State Government responsibilities, overseeing state administration and development initiatives.',
  },
  {
    year: '2017–2019',
    location: 'Federal Capital Territory',
    role: 'Federal education-sector governance',
    explanation: 'Federal education-sector governance, overseeing federal educational institutions and policies.',
  },
  {
    year: '2019',
    location: 'Kano State',
    role: 'Kano governorship election experience',
    explanation: 'Participated in 2019 Kano governorship election, gaining electoral experience.',
  },
  {
    year: '2022',
    location: 'Kano State',
    role: 'NNPP/Kwankwasiyya political realignment',
    explanation: 'NNPP/Kwankwasiyya political realignment, reshaping political affiliations and alliances.',
  },
  {
    year: '2023',
    location: 'Kano State',
    role: 'Deputy Governor of Kano State',
    explanation: 'Appointed Deputy Governor of Kano State, serving as second-in-command of state administration.',
  },
  {
    year: '2026',
    location: 'Kano State',
    role: 'Resigns from Deputy Governorship',
    explanation: 'Resigns from Deputy Governorship following political realignment and impeachment proceedings.',
  },
  {
    year: 'May 2026',
    location: 'Kano State',
    role: 'Emerges as NDC Kano governorship candidate',
    explanation: 'Emerges as NDC Kano governorship candidate for 2027 election.',
  },
  {
    year: 'June 2026',
    location: 'Kano State',
    role: 'Mustapha Rabiu Musa Kwankwaso announced as running mate',
    explanation: 'Mustapha Rabiu Musa Kwankwaso announced as running mate for governorship ticket.',
  },
  {
    year: '2027',
    location: 'Kano State',
    role: 'Governorship election',
    explanation: '2027 Governorship election candidate, seeking to bring decades of experience to Kano development.',
  },
];

export function PoliticalTimelineSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            INTERACTIVE POLITICAL TIMELINE
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            From the classroom to state leadership.
          </p>
        </div>

        {/* Timeline line */}
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-[var(--primary-green)] opacity-50 top-0 bottom-0"></div>

 {/* Timeline events */}
 <div className="grid grid-cols-2 gap-6 md:grid-cols-4 pt-20">
  {timelineEvents.map((event) => (
    <div
      key={event.year}
      className="flex flex-col items-center text-center pt-4"
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
           style={{
            background: event.year.includes('202') ? 'var(--gold)' : 'var(--primary-green)',
            color: event.year.includes('202') ? 'var(--obsidian)' : 'var(--white)',
            fontWeight: 'bold',
            fontSize: '0.875rem',
           }}
      >
        {event.year}
      </div>

      <h3 className="text-lg font-medium text-[var(--white)] mb-1">
        {event.role}
      </h3>
      <p className="text-sm text-[var(--muted-text)] mb-2">
        {event.location}
      </p>
      <p className="text-xs text-[var(--muted-text)] line-clamp-2">
        {event.explanation}
      </p>
    </div>
  ))}
</div>

 {/* Visual relationship labels */}
 <div className="mt-12 text-center">
  <p className="text-sm text-[var(--muted-text)]">
    KWANKWASIYYA MOVEMENT ↓ GWARZO'S POLITICAL JOURNEY ↓ 2027 NDC CANDIDACY
  </p>
</div>
</div>
</section>