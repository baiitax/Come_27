/* ============================================================
   HAUSA + ENGLISH - Section 44
   Language selector and proper localization
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function HausaEnglishSection() {
  const [language, setLanguage] = React.useState<'english' | 'hausa'>('english');

  const translations = {
    english: {
      heroTitle: 'COMRADE AMINU ABDUSSALAM GWARZO',
      heroSubtitle: 'A Lifetime of Service. A New Responsibility to Kano.',
      heroLabel: '2027 Kano Governorship',
      ctaExplore: 'EXPLORE THE RECORD',
      ctaVision: 'DISCOVER THE VISION',
      whyTitle: 'WHY AMINU GWARZO?',
      journeyTitle: 'THE JOURNEY',
      recordTitle: 'THE RECORD',
      visionTitle: 'VISION FOR KANO',
    },
    hausa: {
      heroTitle: 'JARUMUN AMINU ABDUSSALAM GWARZO',
      heroSubtitle: 'SODA GIDA NTA. SHAWARA DA KEBBA A KANO.',
      heroLabel: '2027 GUBBEN KANO',
      ctaExplore: 'UBA RABO',
      ctaVision: 'DISCOVER VISION',
      whyTitle: 'BA ƘARAF AMINU GWARZO?',
      journeyTitle: 'ƘARƘARAFAR',
      recordTitle: 'RABO-RABO',
      visionTitle: 'SHAWARA DA KANO',
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'hausa' : 'english');
  };

  return (
    <section className="py-8">
      <div className="max-w-xl mx-auto px-6">
        <GlassCard premium={true} shadow="soft" style={{ maxWidth: '450px' }}>
          <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            {/* Language selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('english')}
                className={cn(
                  'px-3 py-1.5 rounded text-sm font-medium',
                  language === 'english'
                    ? 'bg-[var(--primary-green)] text-[var(--white)]'
                    : 'text-[var(--muted-text)] hover:bg-[var(--glass-surface)]')
                }
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hausa')}
                className={cn(
                  'px-3 py-1.5 rounded text-sm font-medium',
                  language === 'hausa'
                    ? 'bg-[var(--gold)] text-[var(--obsidian)]'
                    : 'text-[var(--muted-text)] hover:bg-[var(--glass-surface)]')
                }
              >
                HA
              </button>
            </div>

            {/* Language name */}
            <span className="text-sm font-medium text-[var(--white)]">
              {language === 'english' ? 'English' : 'Hausa'}
            </span>

            {/* Direction indicator */}
            <svg
              className="w-4 h-4 ml-2 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              style={{ transform: language === 'hausa' ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <path d="M5 12h14M12 5v14" />
            </svg>
          </div>

          {/* Content in selected language */}
          <div className="mt-6 sm:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--white)] mb-4">
              {translations[language].heroTitle}
            </h2>
            <p className="text-lg text-[var(--muted-text)] mb-6">
              {translations[language].heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="btn-primary flex-1 sm:flex-none"
                aria-label="Explore {language === 'english' ? 'record' : 'rabi'}"
              >
                {translations[language].ctaExplore}
              </button>
              <button
                className="btn-secondary flex-1 sm:flex-none"
                aria-label="Discover {language === 'english' ? 'vision' : 'shawara'}"
              >
                {translations[language].ctaVision}
              </button>
            </div>

            {/* Section headers multilingual */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div>
                <h3 className="text-xl font-bold text-[var(--white)] mb-3">
                  {translations[language].whyTitle}
                </h3>
                <p className="text-[var(--muted-text)] text-sm">
                  {language === 'english'
                    ? 'A leadership journey shaped by service, grassroots responsibility, institutional experience and executive government.'
                    : 'Jarida da akawo da akafi, jihaifikar gwargaren lokaci, masu imaha insashrin insashe, sannan cinan executive government.'}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--white)] mb-3">
                  {translations[language].journeyTitle}
                </h3>
                <p className="text-[var(--muted-text)] text-sm">
                  {language === 'english' ? 'From the classroom to state leadership.' : 'Mina wa ranjin ƙasa da shirye-da ranar domin karu.'}
                </p>
              </div>
            </div>

            {/* Language-specific note */}
            <div className="mt-8 pt-8 border-t border-[var(--glass-border)] text-center">
              <p className="text-xs text-[var(--muted-text)]">
                Hausa text maintains LTR (left-to-right) direction. Political meaning,
                cultural context, and respectful terminology are preserved. RTL only where
                necessary for future Arabic content.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}