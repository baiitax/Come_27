"use client";

/* ============================================================
   PRELOADER - Website loading animation
   ============================================================ */
import React, { useEffect, useState } from 'react';

// Preloader component - shows during page load
export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate page load - in production, this would detect actual page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--obsidian)]">
        <div className="relative w-64 h-64">
          {/* Gold circle orbit */}
          <div className="absolute inset-0 rounded-full border-4 border-[var(--gold)] opacity-20 animate-spin"></div>

          {/* Rotating gold ring (counter-clockwise, 3s — see globals.css) */}
          <div className="absolute inset-0 rounded-full border-4 border-[var(--gold)] opacity-30 anti-clockwise"></div>

          {/* Glowing orb */}
          <div
            className="absolute rounded-full bg-[var(--gold)]/20 opacity-75 animate-pulse"
            style={{
              width: '200px',
              height: '200px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          ></div>

          {/* Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--white)] text-2xl font-bold tracking-wider">
            LOADING
          </div>
        </div>
      </div>
    );
  }

  return null;
}
