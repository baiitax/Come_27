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
      <h3 className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[var(--gold)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-[var(--glass-border)]">
      {/* NDC tricolor accent */}
      <div
        aria-hidden
        className="h-1 w-full bg-[linear-gradient(90deg,var(--ndc-green)_0%,var(--ndc-green)_33%,#F7F9F8_33%,#F7F9F8_66%,var(--ndc-red)_66%)]"
      />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(214,178,94,0.4)] bg-[linear-gradient(135deg,rgba(214,178,94,0.25),rgba(214,178,94,0.05))] font-display text-lg font-bold text-[var(--gold)]">
                G27
              </div>
              <div>
                <p className="font-display text-lg font-bold tracking-tight">GWARZO 2027</p>
                <p className="text-xs text-[var(--muted-text)]">For a Better Kano</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[var(--muted-text)]">
              The official digital home of Comrade Aminu Abdussalam Gwarzo, NDC candidate for
              Governor of Kano State 2027. A lifetime of service. A new responsibility to Kano.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-text)]">
              <span className="h-2 w-2 rounded-full bg-[var(--ndc-green)]" />
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
                      className="text-sm text-[var(--muted-text)] transition-colors duration-300 hover:text-[var(--gold)]"
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
              <ul className="space-y-3 text-sm text-[var(--muted-text)]">
                <li className="flex items-center gap-3">
                  <span aria-hidden className="text-[var(--gold)]">✉</span>
                  hello@gwarzo2027.ng
                </li>
                <li className="flex items-center gap-3">
                  <span aria-hidden className="text-[var(--gold)]">☎</span>
                  +234 800 GWARZO 1
                </li>
                <li className="flex items-center gap-3">
                  <span aria-hidden className="text-[var(--gold)]">⌖</span>
                  Gwarzo House, Kano City, Kano State
                </li>
              </ul>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[var(--glass-border)] pt-8 md:flex-row">
          <p className="text-xs text-[var(--muted-text)]">
            © {new Date().getFullYear()} Gwarzo 2027 Campaign. All rights reserved.
          </p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted-text)]">
            Powered by <span className="text-[var(--gold)]">Kwankwasiya Twitter Guild</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
