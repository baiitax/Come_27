'use client';

import React from 'react';
import Image from 'next/image';
import { useParallax } from '@/hooks/use-parallax';

const moments = [
  {
    src: '/images/gallery/moment-poster.jpg',
    alt: 'AMINTACE 2027 campaign poster',
    tag: 'The Campaign',
    caption: 'AMINTACE 2027 — For a Better Kano',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    src: '/images/gallery/moment-address.jpg',
    alt: 'Comrade Gwarzo addressing party members',
    tag: 'On the Ground',
    caption: 'Addressing the membership',
    span: '',
  },
  {
    src: '/images/gallery/moment-front.jpg',
    alt: 'Comrade Gwarzo at the campaign front',
    tag: 'Grassroots',
    caption: 'Always at the front with the people',
    span: '',
  },
  {
    src: '/images/gallery/moment-service.jpg',
    alt: 'Comrade Gwarzo in traditional attire',
    tag: 'Service',
    caption: 'A lifetime in the service of Kano',
    span: '',
  },
  {
    src: '/images/gallery/moment-rally.jpg',
    alt: 'Comrade Gwarzo speaking at the Madugu 2025 rally',
    tag: 'In His Words',
    caption: 'Madugu 2025 — speaking to the people',
    span: 'md:col-span-2',
  },
];

function MomentCard({
  moment,
  delay,
  speed,
}: {
  moment: (typeof moments)[number];
  delay: number;
  speed: number;
}) {
  const ref = useParallax<HTMLDivElement>(speed);
  return (
    <figure ref={ref} data-reveal="zoom" data-delay={String(delay)} className={moment.span}>
      <div className="photo-frame h-full">
        <Image
          src={moment.src}
          alt={moment.alt}
          width={864}
          height={1080}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ minHeight: '100%' }}
        />
        <figcaption className="absolute inset-x-0 bottom-0 z-10 p-5">
          <span className="text-[0.58rem] font-bold uppercase tracking-[0.24em] text-[var(--gold)]">
            {moment.tag}
          </span>
          <p className="mt-1 font-display text-sm font-semibold text-[var(--white)]">
            {moment.caption}
          </p>
        </figcaption>
      </div>
    </figure>
  );
}

export function MomentsGallerySection() {
  return (
    <section id="moments" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-14 text-center" data-reveal>
          <span className="section-eyebrow">In Pictures</span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-[var(--white)] md:text-5xl">
            MOMENTS OF <span className="text-gold-gradient">SERVICE</span>
          </h2>
          <div className="gold-rule mx-auto mt-6 w-40" />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted-text)] md:text-lg">
            From town halls to village squares — a leader you can meet, hear, and hold accountable.
          </p>
        </div>

        {/* Mosaic grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3" style={{ gridAutoRows: '16rem' }}>
          {moments.map((m, i) => (
            <MomentCard key={m.src} moment={m} delay={i * 90} speed={i % 2 === 0 ? 0.045 : -0.035} />
          ))}
        </div>
      </div>
    </section>
  );
}
