import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, requirePerm, type SessionUser } from './auth-admin';
import { audit } from './audit';

export type ApiCtx = {
  req: NextRequest;
  user: SessionUser;
};

type Handler = (ctx: ApiCtx) => Promise<NextResponse | { error: string; status?: number } | Record<string, unknown>>;

function norm(res: NextResponse | { error: string; status?: number } | Record<string, unknown>): NextResponse {
  if (res instanceof NextResponse) return res;
  if (typeof res === 'object' && 'error' in res) {
    return NextResponse.json({ error: res.error }, { status: res.status ?? 400 });
  }
  return NextResponse.json(res as Record<string, unknown>);
}

/**
 * Single wrapper for every admin API route:
 * session check → permission check → handler → normalized JSON/errors.
 * All errors are sanitized; no stack traces or internals leak to the client.
 */
export function adminApi(permission: string, handler: Handler) {
  return async (req: NextRequest) => {
    try {
      const user = await getSessionUser();
      if (!user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });
      if (permission !== '*') {
        // reuse requirePerm's decision without its redirect side-effect
        const { hasPermission } = await import('./permissions');
        if (!hasPermission(user.role, permission)) {
          return NextResponse.json({ error: 'You do not have permission for this action.' }, { status: 403 });
        }
      }
      return norm(await handler({ req, user }));
    } catch (e) {
      if (e && typeof e === 'object' && 'digest' in e) throw e;
      console.error('[api]', e);
      return NextResponse.json({ error: 'Unable to complete the request. Please try again.' }, { status: 500 });
    }
  };
}

export { requirePerm };
export { audit };
