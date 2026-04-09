# AfterHours

**Repository:** [github.com/YaSH2020-STAR/Afterhours](https://github.com/YaSH2020-STAR/Afterhours)

Next.js, Prisma, **PostgreSQL** (Docker locally, Neon/Supabase in production).

## Run locally

1. `docker compose up -d` (Postgres on port 5432), or use a hosted DB URL in `.env`.
2. `cp .env.example .env` — set `DATABASE_URL` and `AUTH_SECRET`.
3. `npm install && npm run setup && npm run dev` → http://localhost:3000

---

## Deploy on Vercel

Vercel runs **`npm run build:ci`** (see `vercel.json`): `prisma migrate deploy` → `prisma generate` → `next build`.  
Local quick builds use **`npm run build`** (no migrate).

### 1. Push to GitHub

Ensure the **AfterHours** app is at the repo root **or** set the Vercel **Root Directory** to `afterhours` if this app lives in a monorepo subfolder.

### 2. Import in Vercel

[Vercel Dashboard](https://vercel.com) → **Add New** → **Project** → import the Git repository.  
Framework preset: **Next.js** (auto-detected from `vercel.json`). **Node.js** version follows **`engines.node`** in `package.json` (≥20.9); locally you can use `nvm use` with `.nvmrc`.

### 3. Environment variables (Production)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | **Yes** | PostgreSQL URL for Prisma (use Neon’s pooled string on serverless). Required at build and runtime. |
| `AUTH_SECRET` | **Yes** | `openssl rand -base64 32` — signs sessions; must match between deploys. |
| `AUTH_URL` | **Yes** | Canonical site URL, e.g. `https://your-project.vercel.app` or `https://yourdomain.com` |
| `NEXT_PUBLIC_SITE_URL` | **Recommended** | Public URL for metadata and sitemap (use your custom domain when you have one). If omitted on Vercel, `VERCEL_URL` is used automatically for previews and default deployments. |

**Optional**

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_SECRET` | Same value as `AUTH_SECRET` if you prefer the legacy name. |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth |
| `EMAIL_SERVER` / `EMAIL_FROM` | Magic-link email |
| `AFTERHOURS_AUTO_SEED_DISCOVERY` | `true` only to auto-seed discovery demo data (default off in production). |
| `SEED_DEMO_LOGIN_PASSWORD` | Only for `npm run db:seed` local/demo users |

### Database & Prisma (Vercel)

- **Build:** `npm run build:ci` runs `prisma migrate deploy` (uses **`DATABASE_URL`**), then `prisma generate`, then `next build`. The build must reach Postgres from Vercel’s network (allow Neon/Supabase public access or IP rules as needed).
- **Runtime:** Same **`DATABASE_URL`** for Prisma Client (prefer a **pooled** string on Neon for serverless).
- **Singleton:** `src/lib/prisma.ts` keeps one `PrismaClient` per serverless isolate to limit open connections.
- **Demo seed:** Discovery auto-seed is **off** in production unless `AFTERHOURS_AUTO_SEED_DISCOVERY=true`.

### 4. Deploy

Trigger deploy. The first successful build applies pending migrations.

### 5. Post-deploy checks

- `https://<your-domain>/api/auth/providers` includes **`credentials`**.
- `https://<your-domain>/auth-build.txt` → `credentials-v1` (deploy marker).
- Sign up → onboarding (if new user) → dashboard → **Host** (`/create`) for a meetup.

### 6. Optional: seed production once

From your machine (with production `DATABASE_URL` in env): `npx tsx prisma/seed.ts`

---

## Auth

| Method | Notes |
|--------|--------|
| **Email + password** | `/auth/signup`, `/auth/signin` — default; no OAuth env required. |
| **Google** | If `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` are set. |
| **Magic link** | If `EMAIL_SERVER` (+ `EMAIL_FROM`) is set. |

Local seed users (`@demo.afterhours.local`): run `npm run setup`; password from `SEED_DEMO_LOGIN_PASSWORD` (default `afterhours-demo`).

---

## Production builds locally

`npm run build` runs with `NODE_ENV=production`. You need **`AUTH_SECRET`** (or **`NEXTAUTH_SECRET`**) in `.env`, same as on Vercel, or the build will fail with a clear error.

### Prisma

`DATABASE_URL` must be set in `.env` locally (Prisma CLI reads `.env`, not only `.env.local`) and on Vercel for **`build:ci`**.
