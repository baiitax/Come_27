'use client';

import React from 'react';
import Image from 'next/image';
import { WhyGwarzoSection } from '@/sections/why-gwarzo-section';
import { JourneySection } from '@/sections/journey-section';

const highlights = [
  { title: 'Former Deputy Governor', sub: 'Kano State' },
  { title: 'Federal Education Governance', sub: '2017 – 2019' },
  { title: 'Grassroots Leadership', sub: 'Two decades on the ground' },
];

export default function AboutPage() {
  return (
    <div className="relative pt-36 md:pt-44">
      {/* Intro */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-24 lg:grid-cols-12">
          {/* Portrait */}
          <div className="lg:col-span-5" data-reveal="left">
            <div className="relative mx-auto w-full max-w-sm">
              <div aria-hidden className="spin-slow absolute -inset-5 rounded-[2.5rem] border border-dashed border-[rgba(214,178,94,0.22)]" />
              <div className="float-slow">
                <div className="portrait-frame">
                  <Image
                    src="/images/about/gwarzo-speaking.jpg"
                    alt="Comrade Aminu Abdussalam Gwarzo addressing the public"
                    width={832}
                    height={1216}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="lg:col-span-7" data-reveal="right" data-delay="150">
            <span className="section-eyebrow">About the Candidate</span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-[var(--white)] md:text-6xl">
              THE MAN BEHIND
              <span className="text-gold-gradient block">THE MOVEMENT</span>
            </h1>
            <div className="gold-rule mt-8 max-w-sm" />

            <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-[var(--muted-text)] md:text-lg">
              <p>
                Comrade Aminu Abdussalam Gwarzo is a public servant and grassroots leader who has
                spent his life in the service of Kano State. From the classroom to the federal
                ministry to the governor&apos;s chamber, his career has been defined by one
                constant: responsibility delivered quietly, one institution at a time.
              </p>
              <p>
                As former Deputy Governor of Kano State he coordinated development across all 44
                Local Government Areas. As a federal education official he restructured institutions
                that shape millions of Nigerians. And long before either, he built his name the hard
                way — among the people.
              </p>
              <p>
                In 2027, he brings that lifetime of service to a new responsibility: the leadership
                of Kano State.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {highlights.map((h, i) => (
                <div
                  key={h.title}
                  data-reveal
                  data-delay={String(200 + i * 100)}
                  className="glass-card !p-5 hover:!translate-y-0"
                >
                  <span aria-hidden className="mb-3 block h-1 w-8 rounded-full bg-[var(--gold)]" />
                  <p className="font-display text-sm font-bold text-[var(--white)]">{h.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted-text)]">{h.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhyGwarzoSection />
      <JourneySection />
    </div>
  );
}
