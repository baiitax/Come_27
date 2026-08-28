# Gwarzo 2027 — Supabase Production Cutover

The site's CMS database is a standard PostgreSQL schema managed by Prisma.
Production target: **Supabase**. This document is the exact cutover path.

## What the database contains

28 models covering: identity & access (users, roles, audit, sessions), site &
content (candidate, stats, navigation, sections), newsroom (articles incl.
press releases, speeches, events), media (DAM), verification (claims,
evidence, sources), Kano & engagement (LGAs, submissions, volunteers),
analytics & intelligence.

Migration history:

| Migration | Contents |
|---|---|
| `0001_init` | Full schema (all models above) |
| `0002_newsroom_category_index` | `Article(category, publishedAt)` index for newsroom/press-release queries |

## 1. Get the connection string

In the Supabase dashboard → **Project Settings → Database**:

- Use the **Transaction pooler** string ONLY if you also set
  `PRISMA_QUERY_ENGINE_BINARY` workarounds — do **not** for this project.
- Use the **Direct connection** string (port `5432`, "Session mode"). This is
  the one Prisma wants:

```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

> If you only see the `:6543` pooler string, switch the toggle to
> **Direct / Session mode** in the connection dialog — the host becomes
> `aws-0-[region].pooler.supabase.com:5432` and the user is `postgres`.

## 2. Test the connection (from anywhere with node + this repo)

```bash
# .env
DATABASE_URL="postgresql://postgres:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

```bash
npx prisma migrate status   # should say: all migrations up (on first run: not applied yet)
```

## 3. Rebuild the schema on Supabase (fresh)

If the Supabase `public` schema already contains tables from earlier attempts,
clear it first (SQL editor, as `postgres`):

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Then apply the committed migrations — this rebuilds the full schema exactly:

```bash
npx prisma migrate deploy
```

## 4. Seed the demo/campaign content

```bash
npm run db:seed
```

The seed is idempotent — it skips if the database already contains users.
Seeded admin logins:

- `admin@gwarzo2027.ng` / `Gwarzo@2027!` (super admin)
- second demo user (see `prisma/seed-core.js`)

## 5. Deploy

Set the same `DATABASE_URL` (direct/session string) as an environment
variable on Vercel and redeploy. No other changes are required — the app
reads `DATABASE_URL` via Prisma and nothing else is local-specific.

## 6. Post-cutover checklist

- [ ] `migrate status` → all migrations applied
- [ ] `/` renders hero + CMS content (not fallback text)
- [ ] `/newsroom` and `/newsroom/press-releases` list seeded releases
- [ ] Admin login works (`/admin`)
- [ ] A press release created in admin appears in `/newsroom` after revalidate
- [ ] Delete demo analytics if you want a clean live counter
      (`DELETE FROM "AnalyticsEvent" WHERE "isDemo" = false;` — or keep them
      as demo-deployment traffic until real traffic dominates)

## Notes

- **Supavisor/pooler caveat:** Prisma's library engine opens long-lived
  connections; use the direct (session) connection string, not the 6543
  transaction-mode pooler.
- If you later add models, commit the new migration and run `migrate deploy`
  before deploying the app.
- The local sandbox database (`127.0.0.1:5432/gwarzo2027`) is a throwaway
  dev stand-in with identical schema + seed.
