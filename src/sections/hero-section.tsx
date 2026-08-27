/* ============================================================
   HERO SECTION - Comrade Aminu Abdussalam Gwarzo 2027
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { GoldAccent } from '../styles/design-system.css';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-kano z-10"></div>
      
      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[var(--obsidian)] to-[var(--obsidian)] opacity-95 z-10"></div>
      
      {/* Green glow */}
      <div className="absolute top-1/4 left-1/4 rotate-6 w-96 h-96 bg-green-500/10 rounded-full blur-3xl z-10 hero-green-glow"></div>
      
      {/* Gold glow */}
      <div className="absolute bottom-1/4 right-1/4 rotate--6 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl z-10 hero-gold-glow"></div>
      
      {/* Subtle animated particles */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <ParticleGrid size={3} color="rgba(11, 107, 69, 0.03)" />
      </div>
      
      {/* Candidate portrait */}
      <div className="relative flex-col md:flex-row items-center justify-center px-6 pt-20 gap-8 max-w-7xl mx-auto">
        {/* Portrait side - positioned left on mobile, right on desktop */}
        <div className="order-2 order-first-md flex-shrink-0 w-full max-w-md">
          <img 
            src="/images/portraits/primary-portrait.jpg" 
            alt="Comrade Aminu Abdussalam Gwarzo - NDC Candidate for Governor of Kano State 2027"
            className="relative w-full h-[520px] object-cover rounded-3xl border border-[var(--glass-border)] backdrop-blur-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            loading="lazy"
          />
          {/* Gold accent line passing over portrait */}
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-[var(--gold)] rotate-6 rounded-full opacity-30 blur-sm"></div>
        </div>
        
        {/* Text side - positioned right on mobile, left on desktop */}
        <div className="order-1 order-last-md text-center md:text-left max-w-2xl">
          {/* Dark cinematic header */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass-surface)] border border-[var(--glass-border)] mb-8">
            <span className="text-xs text-[var(--gold)] uppercase tracking-wider">2027 KANO GOVERNORSHIP</span>
            <span className="w-px h-6 bg-[var(--gold)] opacity-50"></span>
          </div>
          
          {/* Main name typography */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight mb-4">
            <span className="block">
              COMRADE<br />
              AMINU ABDUSSALAM<br />
              GWARZO
            </span>
          </h1>
          
          {/* Primary positioning tagline */}
          <p className="text-xl md:text-2xl text-[var(--muted-text)] leading-relaxed mb-8">
            A LIFETIME OF SERVICE.
          </p>
          
          <p className="text-xl md:text-2xl text-[var(--muted-text)] leading-relaxed">
            A NEW RESPONSIBILITY TO KANO.
          </p>
          
          {/* Supporting copy */}
          <p className="text-base md:text-lg text-[var(--muted-text)] max-w-xl mb-12 line-height-relaque">
            A public servant, grassroots leader and former Deputy Governor of Kano State seeking to bring decades of institutional and community experience to the next chapter of Kano's development.
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button 
              className="btn-primary"
              aria-label="Explore Comrade Gwarzo's record"
            >
              EXPLORE THE RECORD
            </button>
            <button 
              className="btn-secondary"
              aria-label="Discover Gwarzo's vision"
            >
              DISCOVER THE VISION
            </button>
          </div>
          
          {/* Secondary micro-interaction */}
          <p className="text-sm mt-8 text-[var(--muted-text)]">
            Scroll to explore ↓
          </p>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--muted-text)]">
        <svg 
          width={24} 
          height={24} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
    </section>
  );
}

/* ============================================================
   PARTICLE GRID SUB-COMPONENT
   ============================================================ */
function ParticleGrid({ size, color }: { size: number; color: string }) {
  const gridSize = 20;
  const rows = Math.ceil(size / gridSize) + 2;
  const cols = Math.ceil(size / gridSize) + 2;
  
  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        display: 'grid', 
        gridTemplateColumns: `repeat(${cols}, 1fr)`, 
        gridTemplateRows: `repeat(${rows}, 1fr)`, 
        gap: '2px' 
      }}
    >
      {[...Array(rows * cols)].map((_, i) => (
        <div 
          key={i}
          style={{
            background: color,
            opacity: Math.random() * 0.5,
            animation: `float-${Math.random() > 0.5 ? 'up' : 'down'} 20s infinite ease-in-out`,
            animationDelay: `${Math.random() * 20}s`,
          }}
        />
      ))}
    </div>
  );
}