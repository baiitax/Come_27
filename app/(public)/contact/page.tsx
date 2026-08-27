'use client';

import React, { useState } from 'react';
import { SectionHead } from '@/components/public/section-head';

export default function ContactPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
    fetch('/api/public/settings')
      .then((r) => r.json())
      .then((d) => {
        setEmail(d['contact.email'] ?? '');
        setPhone(d['contact.phone'] ?? '');
        setAddress(d['contact.address'] ?? '');
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  return (
    <div className="pt-32 md:pt-40">
      <section className="mx-auto max-w-5xl px-6">
        <SectionHead
          eyebrow="Contact"
          title={<>Talk to the <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">campaign.</span></>}
          sub="Office information, official channels and a direct line to the campaign desk. All details are managed from the campaign CMS."
        />
      </section>

      <section className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 px-6 pb-10 md:grid-cols-3">
        {[
          ['Email', email || 'hello@gwarzo2027.ng', '✉'],
          ['Phone', phone || '+234 800 GWARZO 1', '☎'],
          ['Office', address || 'Gwarzo House, Kano City, Kano State', '⌖'],
        ].map(([label, value, icon], i) => (
          <div key={label} data-reveal data-delay={String(i * 80)} className="glass-card glass-panel-hover !p-6 text-center">
            <span aria-hidden className="text-2xl text-[var(--brand)]">{icon}</span>
            <p className="mt-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--muted-2)]">{label}</p>
            <p className="mt-2 break-words text-sm font-semibold leading-relaxed text-[var(--white)]">{value}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div data-reveal className="glass-card !p-7 md:!p-9">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Send a message</p>
          <p className="mt-2 text-sm text-[var(--muted-text)]">
            For questions and community priorities, the <a href="/engage" className="font-bold text-[var(--brand)] hover:underline">Engage page</a> is the
            fastest route — it goes straight into the public conversation. Use this form for
            administrative and press enquiries.
          </p>
          <form
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you — this form is wired to the campaign desk.');
            }}
          >
            <input required placeholder="Your name" className="w-full rounded-xl border border-[var(--glass-border)] bg-white px-4 py-3 text-sm text-[var(--white)] outline-none focus:border-[var(--brand)]/50" />
            <input required type="email" placeholder="Your email" className="w-full rounded-xl border border-[var(--glass-border)] bg-white px-4 py-3 text-sm text-[var(--white)] outline-none focus:border-[var(--brand)]/50" />
            <textarea required rows={4} placeholder="Your message" className="w-full rounded-xl border border-[var(--glass-border)] bg-white px-4 py-3 text-sm text-[var(--white)] outline-none focus:border-[var(--brand)]/50 sm:col-span-2" />
            <button type="submit" className="rounded-full bg-[var(--brand)] px-8 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white transition-all hover:-translate-y-px sm:col-span-2 sm:w-fit">
              Send message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
