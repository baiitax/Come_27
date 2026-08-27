'use client';

import { useEffect, useRef } from 'react';

/**
 * GPU-friendly parallax: translates the element vertically based on its
 * distance from the viewport centre. Respects prefers-reduced-motion.
 *
 * speed 0.05 → very subtle drift, 0.2 → pronounced parallax.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.1) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      const y = -centerOffset * speed;
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}
