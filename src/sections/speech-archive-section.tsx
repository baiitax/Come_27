/* ============================================================
   SPEECH ARCHIVE - Section 34
   Searchable speeches with full text, video, audio, PDF
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export interface SpeechArchiveEntry {
  id: string;
  title: string;
  date: string;
  location: string;
  event: string;
  fullText: string;
  videoUrl?: string;
  audioUrl?: string;
  pdfUrl?: string;
  category: 'speech' | 'interview' | 'press-conference';
}

const mockSpeeches: SpeechArchiveEntry[] = [
  {
    id: '1',
    title: 'Inaugural Governorship Speech',
    date: 'June 2026',
    location: 'Kano State Government House',
    event: ' swearing-in ceremony',
    category: 'speech',
    fullText: '...full text would be placed here...',
    videoUrl: '/videos/inaugural-speech.mp4',
    audioUrl: '/audio/inaugural-speech.mp3',
    pdfUrl: '/documents/inaugural-speech.pdf',
  },
  {
    id: '2',
    title: 'Kano Development Town Hall',
    date: 'March 2026',
    location: 'Kano City Hall',
    event: 'Town hall meeting',
    category: 'speech',
    fullText: '...full text would be placed here...',
    videoUrl: '/videos/town-hall.mp4',
    audioUrl: '/audio/town-hall.mp3',
  },
  {
    id: '3',
    title: 'Interview with Arewa 24',
    date: 'February 2026',
    location: 'Abuja',
    event: 'Media interview',
    category: 'interview',
    fullText: '...full text would be placed here...',
    videoUrl: '/videos/arewa24-interview.mp4',
  },
  {
    id: '4',
    title: 'Deputy Governor Inauguration',
    date: 'August 2023',
    location: 'Kano State Government House',
    event: 'inauguration ceremony',
    category: 'speech',
    fullText: '...full text would be placed here...',
    videoUrl: '/videos/deputy-inaugural.mp4',
  },
];

export function SpeechArchiveSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            SPEECH ARCHIVE
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Searchable collection of Comrade Gwarzo's public addresses.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="px-4 py-2 text-sm font-medium uppercase tracking-wider border border-[var(--glass-border)] rounded glass-card premium">
            All
          </button>
          <button className="px-4 py-2 text-sm font-medium uppercase tracking-wider border border-[var(--glass-border)] rounded glass-card premium">
            Speeches
          </button>
          <button className="px-4 py-2 text-sm font-medium uppercase tracking-wider border border-[var(--glass-border)] rounded glass-card premium">
            Interviews
          </button>
        </div>

        {/* Speech cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSpeeches.map((speech) => (
            <GlassCard
              key={speech.id}
              premium={true}
              shadow="soft"
              style={{
                animation: `fadeSlideUp 0.6s ease-out ${speech.id}-delay var(--transition-medium)`,
              }}
            >
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-[var(--muted-text)]">{speech.date}</span>
                  <span className="text-sm text-[var(--primary-green)]">•</span>
                  <span className="text-sm text-[var(--muted-text)]">{speech.location}</span>
                </div>

                <h3 className="text-xl font-bold text-[var(--white)] mb-2">
                  {speech.title}
                </h3>

                <p className="text-[var(--muted-text)] line-clamp-2">
                  {speech.event}
                </p>

                {/* Action buttons */}
                <div className="mt-4 flex gap-3">
                  <button
                    className="flex-1 px-3 py-2 text-xs font-medium text-[var(--primary-green)] rounded"
                    aria-label="View full text of {speech.title}"
                  >
                    READ
                  </button>
                  <button
                    className="flex-1 px-3 py-2 text-xs font-medium text-[var(--muted-text)] rounded"
                    aria-label="Watch video of {speech.title}"
                  >
                    VIDEO
                  </button>
                  {speech.pdfUrl && (
                    <button
                      className="flex-1 px-3 py-2 text-xs font-medium text-[var(--muted-text)] rounded"
                      aria-label="Download PDF of {speech.title}"
                    >
                      PDF
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}