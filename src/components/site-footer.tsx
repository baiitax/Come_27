import type { ReactNode } from 'react';

const footerLinks: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'The Record', href: '/#record' },
  { label: 'Kano', href: '/kano' },
  { label: 'Vision', href: '/#vision' },
  { label: 'Media', href: '/#media' },
  { label: 'Facts', href: '/facts' },
  { label: 'Engage', href: '/#engage' },
];

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#D6B25E]">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-24 bg-[linear-gradient(160deg,#0E2A1F_0%,#081C13_100%)] text-[#F2F7F3]">
      {/* NDC tricolor accent */}
      <div
        aria-hidden
        className="h-1 w-full bg-[linear-gradient(90deg,#007A5E_0%,#F7F9F8_33%,#F7F9F8_66%,#C8102E_66%)]"
      />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(214,178,94,0.5)] bg-[linear-gradient(135deg,rgba(214,178,94,0.3),rgba(214,178,94,0.05))] font-display text-lg font-bold text-[#E8CE8F]">
                G27
              </div>
              <div>
                <p className="font-display text-lg font-bold tracking-tight text-white">
                  GWARZO 2027
                </p>
                <p className="text-xs text-[#9DB5A9]">For a Better Kano</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#9DB5A9]">
              The official digital home of Comrade Aminu Abdussalam Gwarzo, NDC candidate for
              Governor of Kano State 2027. A lifetime of service. A new responsibility to Kano.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#9DB5A9]">
              <span className="h-2 w-2 rounded-full bg-[#007A5E]" />
              NDC • Nigeria Democratic Congress
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <FooterColumn title="Explore">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-[#9DB5A9] transition-colors duration-300 hover:text-[#E8CE8F]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          {/* Campaign */}
          <div className="md:col-span-4">
            <FooterColumn title="The Campaign">
              <ul className="space-y-3 text-sm text-[#9DB5A9]">
                <li className="flex items-center gap-3">
                  <span aria-hidden className="text-[#D6B25E]">✉</span>
                  hello@gwarzo2027.ng
                </li>
                <li className="flex items-center gap-3">
                  <span aria-hidden className="text-[#D6B25E]">☎</span>
                  +234 800 GWARZO 1
                </li>
                <li className="flex items-center gap-3">
                  <span aria-hidden className="text-[#D6B25E]">⌖</span>
                  Gwarzo House, Kano City, Kano State
                </li>
              </ul>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.1)] pt-8 md:flex-row">
          <p className="text-xs text-[#7E958A]">
            © {new Date().getFullYear()} Gwarzo 2027 Campaign. All rights reserved.
          </p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#7E958A]">
            Powered by <span className="text-[#E8CE8F]">Kwankwasiya Twitter Guild</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
