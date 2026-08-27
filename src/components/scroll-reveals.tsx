'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Observes every [data-reveal] element on the page and adds `.reveal-in`
 * when it enters the viewport. Re-runs on client navigation so elements
 * on newly rendered pages are picked up.
 */
export function ScrollReveals() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (prefersReduced || !('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('reveal-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add('reveal-in');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((el) => {
      const delay = el.dataset.delay;
      if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
