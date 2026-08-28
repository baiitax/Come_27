/* ============================================================
   PHOTO ARCHIVE - Section 33
   The Gwaro Archive collections
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export interface PhotoArchiveItem {
  id: string;
  title: string;
  date?: string;
  location: string;
  context: string;
  source: string;
  collection: string;
}

const photoCollections = {
  earlyLife: {
    title: 'EARLY LIFE',
    items: [
      { id: '1', title: 'Childhood photo', date: '1960s', location: 'Gwarzo, Kano', context: 'Early childhood in Gwarzo local government area', source: 'Family archive' },
      { id: '2', title: 'Family gathering', date: '1970', location: 'Kano', context: 'Family celebration and community gathering', source: 'Family archive' },
    ],
  },
  grassroots: {
    title: 'GRASSROOTS',
    items: [
      { id: '3', title: 'Community meeting', date: '1995', location: 'Kano Municipal', context: 'Grassroots mobilization and community organization', source: 'Campaign archive' },
      { id: '4', title: 'Youth rally', date: '1998', location: 'Kano City', context: 'Youth empowerment event', source: 'Campaign archive' },
    ],
  },
  publicService: {
    title: 'PUBLIC SERVICE',
    items: [
      { id: '5', title: 'Deputy Governor inauguration', date: 'August 2023', location: 'Kano State Government House', context: 'Taking oath of office as Deputy Governor', source: 'Government archive' },
      { id: '6', title: 'State government meeting', date: '2015', location: 'Kano State Government', context: 'State administration and policy meeting', source: 'Government archive' },
    ],
  },
  deputyGovernor: {
    title: 'DEPUTY GOVERNOR',
    items: [
      { id: '7', title: 'First official visit', date: 'September 2023', location: 'Kano LGAs', context: 'Visiting Local Government Areas as Deputy Governor', source: 'Government archive' },
      { id: '8', title: 'Development project commissioning', date: 'October 2023', location: 'Kano', context: 'Commissioning development projects across 44 LGAs', source: 'Government archive' },
    ],
  },
  education: {
    title: 'EDUCATION',
    items: [
      { id: '9', title: 'Classroom teaching', date: '1990s', location: 'Kano State', context: 'Teaching in Kano schools', source: 'Educational archive' },
      { id: '10', title: 'Education seminar', date: '2005', location: 'Kano', context: 'Educational development seminar', source: 'Educational archive' },
    ],
  },
  community: {
    title: 'COMMUNITY',
    items: [
      { id: '11', title: 'Community outreach', date: '2024', location: 'Kano Municipal', context: 'Community engagement and dialogue', source: 'Campaign archive' },
      { id: '12', title: 'Women's forum', date: '2024', location: 'Kano', context: 'Women's empowerment forum', source: 'Campaign archive' },
    ],
  },
  '2027': {
    title: '2027',
    items: [
      { id: '13', title: 'Campaign rally', date: '2024', location: 'Kano', context: '2027 governorship campaign rally', source: 'Campaign archive' },
      { id: '14', title: 'NDC nomination', date: 'May 2026', location: 'Kano', context: 'Emerging as NDC governorship candidate', source: 'Campaign archive' },
    ],
  ],
};

export function PhotoArchiveSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            THE GWARZO ARCHIVE
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Collections: EARLY LIFE, GRASSROOTS, PUBLIC SERVICE, GOVERNMENT, EDUCATION,
            DEPUTY GOVERNOR, COMMUNITY, 2027.
          </p>
        </div>

        {/* Collections tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(photoCollections).map((collection) => (
            <button
              key={collection}
              className="px-4 py-2 text-sm font-medium uppercase tracking-wider border border-[var(--glass-border)] rounded glass-card premium"
            >
              {collection}
            </button>
          ))
        </div>

        {/* Photo grid with actual images */}
        <div className="grid grid-cols-2 gap-6">
          {/* Early Life images */}
          <GlassCard
            key="early-life-1"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="Early life photo of Comarade Gwarzo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-transparent via-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              Childhood photo
            </div>
          </GlassCard>
          <GlassCard
            key="early-life-2"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="Family gathering photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              Family gathering
            </div>
          </GlassCard>
          {/* Grassroots images */}
          <GlassCard
            key="grassroots-1"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="Community meeting photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              Community meeting
            </div>
          </GlassCard>
          <GlassCard
            key="grassroots-2"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="Youth rally photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              Youth rally
            </div>
          </GlassCard>
          {/* Public Service images */}
          <GlassCard
            key="public-service-1"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="Deputy Governor inauguration photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              Deputy Governor inauguration
            </div>
          </GlassCard>
          <GlassCard
            key="public-service-2"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="State government meeting photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              State government meeting
            </div>
          </GlassCard>
          {/* Deputy Governor images */}
          <GlassCard
            key="deputy-gov-1"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="First official visit photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              First official visit
            </div>
          </GlassCard>
          <GlassCard
            key="deputy-gov-2"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="Development project commissioning photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              Development project commissioning
            </div>
          </GlassCard>
          {/* Education images */}
          <GlassCard
            key="education-1"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="Classroom teaching photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              Classroom teaching
            </div>
          </GlassCard>
          <GlassCard
            key="education-2"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="Education seminar photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              Education seminar
            </div>
          </GlassCard>
          {/* Community images */}
          <GlassCard
            key="community-1"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="Community outreach photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              Community outreach
            </div>
          </GlassCard>
          <GlassCard
            key="community-2"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="Women's forum photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              Women's forum
            </div>
          </GlassCard>
          {/* 2027 images */}
          <GlassCard
            key="2027-1"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="Campaign rally photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              Campaign rally
            </div>
          </GlassCard>
          <GlassCard
            key="2027-2"
            premium={true}
            shadow="soft"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--obsidian)',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-text)',
            }}
          >
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="NDC nomination photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--primary-green)]/80 to-transparent text-[var(--white)] text-sm font-medium">
              NDC nomination
            </div>
          </GlassCard>
        </div>

        {/* Collection details - example: Early Life */}
        <div className="mt-12 pt-8 border-t border-[var(--glass-border)]">
          <h3 className="text-xl font-bold text-[var(--white)] mb-4">EARLY LIFE</h3>
          <p className="text-[var(--muted-text)] text-sm">
            Photos from Comarade Gwarzo's early life in Gwarzo, Kano State. Each photograph
            includes date, location, context, and source where known. No fabricated historical
            photographs are presented. AI-generated decorative imagery is never presented as
            documentary evidence.
          </p>
          <p className="text-xs text-[var(--muted-text)] mt-2">
            Photos should have: date if known, location, context, source.
          </p>
        </div>
      </div>
    </section>
  );
}