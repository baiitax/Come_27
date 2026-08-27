"use client";

/* ============================================================
   FLOATING GLASS NAVIGATION COMPONENT
   ============================================================ */
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const GlassNavbar = ({
  items,
  onScroll,
  shrinkOnScroll = false,
  variant = 'desktop', // 'desktop' or 'mobile'
}: {
  items: NavItem[];
  onScroll?: (progress: number) => void;
  shrinkOnScroll?: boolean;
  variant?: 'desktop' | 'mobile';
}) => {
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setScrolled(scrollY);
      onScroll?.(progress);
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [onScroll]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4">
      <div
        className={cn(
          'glass-card premium flex items-center justify-center gap-4 md:gap-8',
          variant === 'mobile' && 'bottom-0 top-auto left-1/2 -translate-x-1/2 w-full max-w-md',
          shrinkOnScroll && scrolled > 100 && 'transform transition-transform duration-300 scale-95'
        )}
        style={{
          background: 'rgba(255,255,255,0.11)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: variant === 'desktop' ? '28px' : '20px',
          padding: variant === 'desktop' ? '16px 32px' : '12px 24px',
          margin: variant === 'desktop' ? '24px auto 0' : '0 0 20px',
        }}
      >
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={cn(
              'text-[var(--muted-text)] text-sm font-medium uppercase tracking-wider relative',
              variant === 'desktop'
                ? 'hover:text-[var(--white)] transition-colors'
                : 'hover:text-[var(--gold)] transition-colors'
            )}
            style={{
              ...(variant === 'desktop' && {
                fontSize: '0.875rem',
                padding: '8px 16px',
              }),
              ...(variant === 'mobile' && {
                fontSize: '0.75rem',
                padding: '6px 12px',
              }),
            }}
          >
            {item.label}
            {item.external && (
              <svg
                className="inline-block w-4 h-4 ml-2"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M5 12h14M12 5v14" />
              </svg>
            )}
          </a>
        ))}
      </div>
    </nav>
  );
};

// Backwards-compatible alias
export const FloatingNavbar = GlassNavbar;
