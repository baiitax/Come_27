'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Privacy-conscious page-view beacon (aggregate only). */
export function Track() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'page_view', path: pathname }),
      }).catch(() => {});
    } catch { /* non-critical */ }
  }, [pathname]);
  return null;
}

export function trackEvent(type: string, path?: string) {
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, path: path ?? (typeof window !== 'undefined' ? window.location.pathname : '/') }),
    }).catch(() => {});
  } catch { /* non-critical */ }
}
