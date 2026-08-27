import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';
import { prisma } from '@/lib/db';

const ALLOWED_TYPES = new Set([
  'page_view', 'content_view', 'cta_click', 'search', 'document_view',
  'submission_completed', 'volunteer_completed',
]);
const ALLOWED_PATHS = /^\/[a-z0-9\-_/]{0,140}$/i;

/**
 * Privacy-conscious analytics beacon.
 * Records only: event type, page path, coarse referrer domain, a random
 * session id (cookie, rotatable), no personal data, no individual profiling.
 *
 * Fire from the client:
 *   fetch('/api/track', { method: 'POST', body: JSON.stringify({ type: 'page_view', path: location.pathname, referrer: document.referrer }) })
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') return NextResponse.json({ ok: false }, { status: 400 });

    const type = String(body.type ?? '');
    const path = String(body.path ?? '/');
    const referrer = body.referrer ? String(body.referrer).slice(0, 200) : null;
    if (!ALLOWED_TYPES.has(type)) return NextResponse.json({ ok: false }, { status: 400 });
    if (!ALLOWED_PATHS.test(path)) return NextResponse.json({ ok: false }, { status: 400 });

    let sessionId: string | null = null;
    const store = await cookies();
    const existing = store.get('gw_session');
    if (existing?.value && /^[a-f0-9]{32}$/.test(existing.value)) {
      sessionId = existing.value;
    } else {
      sessionId = randomBytes(16).toString('hex');
      store.set('gw_session', sessionId, { maxAge: 60 * 60 * 24 * 30, httpOnly: true, sameSite: 'lax', path: '/' });
    }

    await prisma.analyticsEvent.create({
      data: {
        type,
        path,
        referrer: (() => {
          if (!referrer) return null;
          try {
            return new URL(referrer).host;
          } catch {
            return null;
          }
        })(),
        sessionId,
        isDemo: false,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
