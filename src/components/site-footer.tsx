import Link from 'next/link';
import { prisma } from '@/lib/db';

async function setting(key: string): Promise<string> {
  try {
    const s = await prisma.siteSetting.findUnique({ where: { key } });
    return s?.value ?? '';
  } catch {
    return '';
  }
}

export async function SiteFooter() {
  const [email, phone, address] = await Promise.all([
    setting('contact.email'),
    setting('contact.phone'),
    setting('contact.address'),
  ]);

  return (
    <footer className="relative mt-28 border-t border-[rgba(23,32,51,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(240,242,245,0.9))]">
      {/* crimson hairline */}
      <div aria-hidden className="h-px w-full bg-[linear-gradient(90deg,transparent,var(--brand)_50%,transparent)] opacity-40" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(166,27,27,0.3)] bg-[linear-gradient(135deg,rgba(166,27,27,0.1),rgba(198,146,50,0.12))] font-display text-sm font-extrabold text-[var(--brand)]">
                G27
              </span>
              <div>
                <p className="font-display text-base font-extrabold tracking-[0.12em] text-[var(--white)]">
                  GWARZO <span className="text-[var(--brand)]">2027</span>
                </p>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted-2)]">
                  For a Better Kano
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--muted-text)]">
              The official digital home of Comarade Aminu Abdussalam Gwarzo — NDC candidate for
              Governor of Kano State 2027.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--brand)]">Explore</h3>
            <ul className="space-y-2.5">
              {[
                ['About', '/about'],
                ['The Record', '/record'],
                ['Kano', '/kano'],
                ['Vision', '/vision'],
                ['Media', '/media'],
                ['Facts', '/facts'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[var(--muted-text)] transition-colors hover:text-[var(--white)]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Engage */}
          <div>
            <h3 className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--brand)]">Engage</h3>
            <ul className="space-y-2.5">
              {[
                ['Ask a Question', '/engage'],
                ['Community Priority', '/engage'],
                ['Volunteer', '/join'],
                ['Contact', '/contact'],
              ].map(([label, href], i) => (
                <li key={i}>
                  <Link href={href} className="text-sm text-[var(--muted-text)] transition-colors hover:text-[var(--white)]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Campaign */}
          <div>
            <h3 className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--brand)]">Campaign</h3>
            <ul className="space-y-2.5 text-sm text-[var(--muted-text)]">
              <li>NDC — Nigeria Democratic Congress</li>
              <li>2027 Kano Governorship</li>
              {email && <li className="break-all">{email}</li>}
              {phone && <li>{phone}</li>}
              {address && <li>{address}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[rgba(23,32,51,0.08)] pt-8 md:flex-row">
          <p className="text-xs text-[var(--muted-2)]">© 2026 Gwarzo 2027 Campaign. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs text-[var(--muted-2)]">
            <Link href="/engage" className="transition-colors hover:text-[var(--white)]">Privacy</Link>
            <Link href="/facts" className="transition-colors hover:text-[var(--white)]">Transparency</Link>
            <a href="#main-content" className="transition-colors hover:text-[var(--white)]">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
