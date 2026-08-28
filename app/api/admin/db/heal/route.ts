import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import { runHealthCheck } from '@/lib/db-heal';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/db/heal — super-admin only.
 * Runs the database self-heal (migrate if needed, seed if empty) on demand
 * and returns a health report. Used by the Diagnostics "Self-heal now" button.
 */
export async function POST() {
  const store = await cookies();
  const token = store.get('gwarzo_admin_session')?.value;
  const verified = token ? await verifySessionToken(token) : null;
  if (!verified?.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (verified.payload.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden — super admin only' }, { status: 403 });
  }
  const report = await runHealthCheck();
  return NextResponse.json(report);
}
