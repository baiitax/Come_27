import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, getSecret } from '@/lib/session';

/**
 * Single authoritative authentication middleware for /admin.
 *
 *   request
 *     ├── public route (login / forgot / reset) → continue
 *     ├── no valid session → /admin/login?next=... (&reason=expired)
 *     ├── role denied for route → /admin/unauthorized
 *     └── otherwise → continue (fine-grained RBAC is re-checked server-side
 *         in the (app) layout + every server action: defense in depth)
 */

const PUBLIC_PATHS = ['/admin/login', '/admin/forgot', '/admin/reset'];

/** Coarse zone gates; fine permissions live in the layout & actions. */
function zoneDenied(role: string, pathname: string): boolean {
  if (role === 'super_admin') return false;
  const superZones = ['^/admin/(settings|roles|audit|diagnostics)(/|$)'];
  if (superZones.some((re) => new RegExp(re).test(pathname))) return true;
  if (pathname.startsWith('/admin/users') && !['content_admin'].includes(role)) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || (p === '/admin/reset' && pathname.startsWith('/admin/reset/')))) {
    return NextResponse.next();
  }

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    // Secret misconfigured: fail closed at the server layer (layout guard),
    // but don't hard-block rendering during local dev.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Authentication service is temporarily unavailable.' }, { status: 503 });
    }
    return NextResponse.next();
  }

  const res = await verifySessionToken(req.cookies.get('gwarzo_admin_session')?.value);

  if (!res.ok) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    url.searchParams.set('next', pathname);
    if (res.reason === 'expired') url.searchParams.set('reason', 'expired');
    return NextResponse.redirect(url);
  }

  if (zoneDenied(res.payload.role, pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/unauthorized';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Forward identity to the server layer (optional, server re-verifies).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-admin-sub', res.payload.sub);
  requestHeaders.set('x-admin-role', res.payload.role);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/admin/:path*'],
};
