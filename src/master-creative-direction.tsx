/* ============================================================
   MASTER CREATIVE DIRECTION - Opening sequence
   The website's opening narrative experience
   ============================================================ */
export function MasterCreativeDirection() {
  return (
    <section className="py-32 bg-[var(--obsidian)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative z-10">
          {/* Step 1: Dark Kano-inspired environment */}
          <div className="absolute inset-0 bg-[var(--obsidian)]">
            {/* Subtle geometric Islamic/Hausa patterns */}
            <div className="absolute inset-0 opacity-50">
              <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
                   viewBox="0 0 100 100"
                   fill="none">
                <g stroke="rgba(11, 107, 69, 0.03)">
                  {/* Circular pattern */}
                  <circle cx="50" cy="50" r="45" />
                  {/* Islamic geometric pattern lines */}
                  <line x1="10" y1="30" x2="90" y2="70" />
                  <line x1="30" y1="10" x2="70" y2="90" />
                  <line x1="50" y1="10" x2="50" y2="90" />
                  <line x1="10" y1="90" x2="90" y2="10" />
                </g>
              </svg>
            </div>
          </div>

 {/* Step 2: Cinematic portrait emerges */}
          <div className="relative">
            <img
              src="/images/portraits/primary-portrait.jpg"
              alt="Comrade Aminu Abdussalam Gwarzo"
              className="relative w-full h-[600px] object-cover rounded-3xl border border-[var(--glass-border)] backdrop-blur-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] md:translate-y--[-60px] max-md:translate-y-0 md:duration-2000"
              loading="lazy"
            />
            {/* Gold accent line */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-[var(--gold)] rotate-6 rounded-full opacity-20 blur-sm"></div>
          </div>

 {/* Step 3: Translucent glass interface floats over image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-card premium p-8 md:p-12 backdrop-blur-[28px]"
                 style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  width: '80%',
                  maxWidth: '800px',
                 }}
            >
              {/* Step 4: Small gold line illuminates */}
              <div className="mb-6 flex justify-center">
                <div className="w-12 h-1/2 bg-[var(--gold)] rotate-6 rounded-full opacity-30 transition-all duration-2000"
                     style={{ boxShadow: '0 0 20px rgba(218, 165, 32, 0.4)' }}></div>
              </div>

 {/* Step 5: Text appears - AMINU ABDUSSALAM GWARZO */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[var(--white)] mb-4 leading-tight tracking-tight">
                <span className="block">AMINU ABDUSSALAM<br/>GWARZO</span>
              </h1>

 {/* Step 6: Then: A LIFETIME OF SERVICE. */}
              <p className="text-3xl md:text-4xl font-bold text-[var(--gold)] mb-6">
                A LIFETIME OF SERVICE.
              </p>

 {/* Step 7: Then: A NEW RESPONSIBILITY TO KANO. */}
              <p className="text-3xl md:text-4xl font-bold text-[var(--white)] mb-8">
                A NEW RESPONSIBILITY TO KANO.
              </p>

 {/* Interface transitions - photograph fades */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  fill="none"
                  animation:fadeOut 2s ease-forwards
                >
                  <rect width="100" height="100" fill="var(--obsidian)" />
                  <circle cx="50" cy="50" r="50" fill="rgba(0,0,0,0.8)" />
                </svg>
              </div>
            </div>
          </div>
        </div>

 {/* Timeline begins */}
        <div className="mt-24 pb-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-64 bg-[var(--primary-green)] md:top-20"></div>

 {/* Step 8: Timeline begins - 1990s */}
          <div className="text-center mb-16">
            <p className="text-[var(--muted-text)] text-sm uppercase tracking-wider mb-4">1990s</p>
            <p className="text-2xl font-bold text-[var(--white)]">Local government</p>
            <p className="text-[var(--muted-text)]">Early professional life in education</p>
          </div>

 {/* Step 9: Kano map emerges - 44 LGAs illuminate one by one */}
          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-16 bg-[var(--obsidian)]">
            <svg className="absolute inset-0 w-full h-full"
                 viewBox="0 0 100 100"
                 fill="none">
              <g stroke="rgba(11, 107, 69, 0.1)" strokeWidth={1}>
                {/* 44 LGA placeholder circles */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <circle
                    key={i}
                    cx={20 + Math.random() * 60}
                    cy={20 + Math.random() * 60}
                    r={2 + Math.random() * 5}
                    opacity={0.5}
                  />
                ))}
              </g>
            </svg>
          </div>

 {/* Step 10: THE FUTURE OF KANO */}
          <div className="text-center mb-16">
            <p className="text-[var(--gold)] text-3xl font-bold mb-4">THE FUTURE OF KANO</p>
            <p className="text-[var(--white)] text-lg">
              A safer, more educated, productive and accountable Kano.
            </p>
          </div>

 {/* Step 11: Ten policy pillars appear */}
          <div className="grid grid-cols-2 gap-4 mb-16">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <div
                key={num}
                className="glass-card premium p-4 text-center"
                style={{
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.05)',
                 }}
              >
                <span className="pillar-number">{num}</span>
                <p className="text-sm text-[var(--muted-text)] mt-2">
                  Policy {num}
                </p>
              </div>
            ))}
          </div>

 {/* Step 12: LISTEN. PLAN. DELIVER. MEASURE. REPORT. */}
          <div className="flex justify-center gap-8 mb-16">
            {[ 'LISTEN', 'PLAN', 'DELIVER', 'MEASURE', 'REPORT' ].map((principle) => (
              <div
                key={principle}
                className="glass-card premium p-6 text-center"
                style={{
                  border: '1px solid var(--glass-border)',
                  minWidth: '120px',
                 }}
              >
                <p className="text-[var(--primary-green)] text-xl font-bold mb-2">
                  {principle}
                </p>
              </div>
            ))}
          </div>

 {/* Step 13: Finally: KANO 2031 */}
          <div className="text-center mb-16">
            <p className="text-[var(--gold)] text-3xl font-bold mb-4">KANO 2031</p>
            <p className="text-[var(--white)] text-lg">
              What should Kano look like after four years of disciplined development?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Keyframes for the opening animation */
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}