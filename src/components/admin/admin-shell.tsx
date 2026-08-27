'use client';

import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar, TopBar } from './shell';

export function AdminShell({ user, children }: { user: { name: string; email: string; role: string }; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <Sidebar user={user} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-[248px]">
        <TopBar user={user} onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </>
  );
}
