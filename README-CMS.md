## Production deployment (Vercel) — current flow (PostgreSQL)

1. **Database**: attach **Vercel Postgres** (Project → Storage). This sets `DATABASE_URL` automatically.
2. **Secrets**: set `AUTH_SECRET` in Vercel project env (any strong random string, ≥32 chars — e.g. `openssl rand -hex 48`).
3. **Build Command**: set the project Build Command to:
   ```
   prisma migrate deploy && npm run db:seed && next build
   ```
   - `prisma migrate deploy` applies committed migrations (`prisma/migrations/`).
   - `npm run db:seed` is **idempotent** — it seeds only an empty database (first deploy), then no-ops.
   - `postinstall` runs `prisma generate` automatically.
4. Deploy. Public site reads from Postgres; admin at `/admin` (login: seeded admin, change password immediately in Settings → Users).

Re-seeding a dev/empty DB manually: `npm run db:seed`.
Creating new migrations locally: `npx prisma migrate dev --name <name>`.

## Environment variables
# Gwarzo 2027 — CMS, Content Operations & Intelligence Platform

The public website is now the **presentation layer**; the CMS/database is the **authoritative source of truth**.

```
CONTENT → EVIDENCE → PUBLICATION → ENGAGEMENT → ANALYTICS → INSIGHT → ACTION → CONTENT
```

## Login

| Role | Email | Password |
|---|---|---|
| Super Administrator | `admin@gwarzo2027.ng` | `Gwarzo@2027!` |
| Editor (sample) | `editor@gwarzo2027.ng` | `Editor@2027!` |

> **Change these before any real deployment** (`/admin/users` → deactivate, create fresh users).

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4
- **Prisma ORM** — SQLite in this sandbox; **PostgreSQL in production** (see below)
- **API-based authentication** (plain HTTP endpoints — deliberately not Next server actions, which are unreliable across some runtimes): POST /api/admin/login · /logout · /forgot · /reset
- bcrypt (cost 12) password hashing + HMAC-SHA256 signed session cookie (12h / 30d remember-me)
- **Server-side session table (revocable)**: logout truly destroys the session; expired sessions are lazily purged
- Rate-limited login (5 attempts / 15 min per IP+email), MFA-ready architecture
- RBAC enforced **server-side** on every endpoint + middleware zone gates; audit log on every action
- **Automated session suite**: `npm run test:auth` (10 end-to-end HTTP tests: login, invalid, persistence, protected routes, no-loop, expired, RBAC, logout, no secret leaks, rate limit)

## Admin map

- `/admin` — login → `/admin/dashboard` (KPIs, intelligence summary, attention queue, live activity)
- **Content** — `/admin/content` (sections & navigation manager), `/admin/content/news`, `/admin/speeches`, `/admin/events`, `/admin/timeline`, `/admin/record`, `/admin/policies`
- **Verification** — `/admin/facts` (claims → verdicts → evidence trail → sources registry)
- **Engagement** — `/admin/engagement` (submissions workflow), `/priorities` (topic + LGA pulse), `/lgas` (44 LGAs), `/volunteers`
- **Media** — `/admin/media` (DAM: upload, albums, alt/copyright/tags, usage flags)
- **Analytics** — `/admin/analytics` (traffic / content health / engagement, 1–90d)
- **Intelligence** — `/admin/intelligence` (summary, issue pulse, LGA engagement, alerts)
- **Operations** — `/admin/reports` (daily/weekly/monthly), `/admin/audit` (searchable full audit trail)
- **System** — `/admin/users`, `/admin/roles` (permission matrix), `/admin/seo`, `/admin/settings`

## Authentication lifecycle (verified)

```
Login form → POST /api/admin/login
  → zod validation → rate-limit check → bcrypt compare (constant-shape)
  → session row created (revocable) → HttpOnly SameSite=Lax cookie (Secure in prod)
  → 303 redirect to target
Every /admin request:
  → Edge middleware: signature + expiry (+ zone gates) → /admin/login?reason=expired
  → Server: session row lookup (revocation) + user active check → /admin/unauthorized on RBAC fail
Logout → session row deleted + cookie cleared → next request 401/redirect
```

Run the acceptance suite against any running production build:

```
npm run test:auth        # node tests/auth-tests.mjs [baseUrl]
```

## Environment variables

| Variable | Where | Notes |
|---|---|---|
| `DATABASE_URL` | local + Vercel | local: `file:./dev.db` · Vercel: Postgres connection string |
| `AUTH_SECRET` | local + Vercel | ≥ 32 chars. Generate: `openssl rand -hex 48`. **The app refuses to run in production without it.** |

## Production deployment (Vercel)

1. **Database**: provision **Vercel Postgres (Neon)** or any Postgres.
2. **Schema port**: in `prisma/schema.prisma` change `provider = "sqlite"` → `"postgresql"` and run:
   ```
   npx prisma migrate dev --name prod_init   # generates SQL migrations
   npx prisma migrate deploy                  # on Vercel (build step or CLI)
   npx prisma db seed                          # optional: initial content
   ```
   (Add `"seed": "node prisma/seed.js"` to `package.json` scripts if not present.)
3. **Env on Vercel**: set `DATABASE_URL` + `AUTH_SECRET` (strong value).
4. **Build**: Vercel runs `next build`. Add a pre-build `npx prisma generate` if your project needs it explicitly.
5. **Media storage**: local `public/uploads` works while the instance is writable; for durable production media switch the upload action to **S3 / Vercel Blob / R2** (only `app/admin/actions/media.ts` needs changing).
6. **Backups**: enable Postgres PITR/automated backups; media bucket versioning. Restore = restore DB + restore bucket + redeploy.

## What is NOT hardcoded

Candidate name/bio/image, hero stats, journey timeline, service record, policy sectors,
navigation, footer/contact (Settings), news/speeches/events (public `/news`), LGAs,
issue categories, community form → all read from the database with graceful fallbacks.

## Integrity rules enforced by design

- **No fake percentages** — with no data the UI shows “Insufficient data”.
- **Demo data** (seeded analytics/engagement samples) is flagged `isDemo` and **always excluded** from public-facing statistics and analytics.
- **Evidence status is color-coded and public** — unverified claims can never display as verified (verdict changes are permission-gated to Fact Checker / Reviewer).
- **Privacy-conscious analytics** — page path + coarse referrer domain + random session id only. No individual profiling, no political inference, no targeting.
- **Soft deletes** for all public-record content; permanent deletion is super-admin only.
- **Audit log** records user, action, entity, old/new values, IP, timestamp for every mutation, login and failed login.

## Roadmap (deliberately deferred)

- Rich-text/WYSIWYG editor (currently structured plain-text fields)
- MFA enrollment flow (architecture is ready: session + user model)
- PDF/Excel export for reports (reports are JSON snapshots + print view)
- Drag-and-drop section ordering (up/down controls shipped)
- Full-text search index (currently SQL `contains` across all collections)
- S3/Blob media backend
