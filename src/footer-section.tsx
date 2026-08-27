/* ============================================================
   FOOTER - Premium dark footer
   ============================================================ */
import { cn } from '@/lib/utils';

export function FooterSection() {
  return (
    <footer className="py-12 bg-[var(--obsidian)] border-t border-[var(--glass-border)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Left column - Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[var(--primary-green)] flex items-center justify-center text-[var(--white)] text-xl font-bold">
                AG
              </div>
              <span className="text-2xl font-bold text-[var(--white)]">
                AMINU ABDUSSALAM GWARZO
              </span>
            </div>
            <p className="text-[var(--muted-text)] text-sm mt-4">
              NDC Governorship Candidate - Kano State 2027
            </p>
          </div>

 {/* Navigation columns */}
 {[ 'About', 'Record', 'Kano', 'Vision', 'Media', 'Facts', 'Engage' ].map((label) => (
            <div>
              <h4 className="text-sm font-medium text-[var(--muted-text)] uppercase tracking-wider mb-4">
                {label}
              </h4>
              <ul className="space-y-3 text-sm text-[var(--muted-text)]">
                <li>
                  <a
                    href={`/#${label.toLowerCase()}`
                    }
                    className="hover:text-[var(--white)] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              </ul>
            </div>
          ))}

 {/* Social media */}
 <div>
  <h4 className="text-sm font-medium text-[var(--muted-text)] uppercase tracking-wider mb-4">
    Social media
  </h4>
  <div className="flex gap-3">
    {[ 'X', 'Facebook', 'Instagram', 'YouTube' ].map((platform) => (
      <button
        key={platform}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--glass-border)] hover:bg-[var(--glass-surface)] transition-colors"
        aria-label={platform}
      >
        <svg
          className="w-5 h-5 text-[var(--muted-text)]"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
        >
          {platform === 'X' && (
            <path d="M16 8a6 6 0 0 1-12 0v4h12V8z" />
          )}
          {platform === 'Facebook' && (
            <path d="M18 2h-3a7 7 0 0 0-7 7v1H8a7 7 0 0 0-7 7v1h1c3-5 3-9.5 3-9.5v-2C6 5.25 6.5 5 7 5h9.34l-4.86 9H1v2h2z" />
          )}
          {platform === 'Instagram' && (
            <path d="M12 0h4v2h13v20h-13v20h-13v2h-13v2H5v2H2v20h2l3.03-6h6.97l-3.02 6h1c-.58 3.93-2.07 7.52-5.32 10.3L8.59 23h7.91l-.37-7.02H5v-2h13c2.21 0 3.38-1.05 4.13-2.43l.55-2.37 4.06 11.55.04.02H23v-2h-6.9l-.53-7.08h1.47l-.08-6.5 2.15 1.85.02.07h1v-2h-13v-2h-13v-2h-13v-2h-2v-2h-5v-2h-4v-2h-2v-2h-3v-2z" />
          )}
          {platform === 'YouTube' && (
            <path d="M12 0l-1.47 21.5 21.5 1.47L12 24l-11.97-4.93L12 0zm1.34 17.32l1.83-5.78L10.05 8.06 8.7 9.38l5.66 1.45a1 1 0 0 0 1.25 0l5.66-1.45L13.34 17.32l3.35-2.85a1 1 0 0 0-.28-1.23L11.98 9.93 7.72 15.95l5.86 3.08L12 17.32z" />
          )}
        </svg>
      </button>
    ))}
  </div>
</hdiv>
</div>

 {/* Bottom section */}
 <div className="pt-8 border-t border-[var(--glass-border)] flex flex-col md:flex-row justify-between items-start">
  <p className="text-[var(--muted-text)] text-sm">
    © 2027 Aminu Abdussalam Gwarzo Campaign.
  </p>
  <div className="flex gap-8 mt-4 md:mt-0">
    <a
      href="#"
      className="text-[var(--muted-text)] text-sm hover:text-[var(--white)] transition-colors"
    >
      About
    </a>
    <a
      href="#"
      className="text-[var(--muted-text)] text-sm hover:text-[var(--white)] transition-colors"
    >
      Record
    </a>
    <a
      href="#"
      className="text-[var(--muted-text)] text-sm hover:text-[var(--white)] transition-colors"
    >
      Kano
    </a>
    <a
      href="#"
      className="text-[var(--muted-text)] text-sm hover:text-[var(--white)] transition-colors"
    >
      Vision
    </a>
    <a
      href="#"
      className="text-[var(--muted-text)] text-sm hover:text-[var(--white)] transition-colors"
    >
      Media
    </a>
    <a
      href="#"
      className="text-[var(--muted-text)] text-sm hover:text-[var(--white)] transition-colors"
    >
      Facts
    </a>
    <a
      href="#"
      className="text-[var(--muted-text)] text-sm hover:text-[var(--white)] transition-colors"
    >
      Engage
    </a>
  </div>
</div>

 {/* Disclaimer link */}
 <div className="mt-6 text-center text-xs text-[var(--muted-text)]">
  <a
    href="#"
    className="hover:text-[var(--white)] transition-colors"
  >
    Disclaimer
  </a>
</div>
</div>
</footer>