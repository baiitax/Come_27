import './globals.css';
import type { ReactNode } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="glass-card premium w-full p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--primary-green)] flex items-center justify-center text-[var(--white)] text-xl font-bold">
                AG
              </div>
              <span className="text-2xl font-bold tracking-tight">Gwarzo2027</span>
            </div>
            <button
              aria-label="Menu"
              className="lg:hidden p-2"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--white)',
                cursor: 'pointer',
              }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Mobile navigation */}
          <div className="hidden md:hidden mt-6">
            <div className="space-y-3">
              {[ 'HOME', 'ABOUT', 'RECORD', 'KANO', 'VISION', 'MEDIA', 'FACTS', 'ENGAGE' ].map((label) => (
                <button
                  key={label}
                  className="w-full text-left px-3 py-2 rounded glass-card premium text-[var(--muted-text)] hover:text-[var(--white)] transition-colors text-sm uppercase tracking-wider"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 md:pt-32">
        {children}
      </main>
    </div>
  );
}