# AfterHours

**Repository:** [github.com/YaSH2020-STAR/Afterhours](https://github.com/YaSH2020-STAR/Afterhours)

Small weekly pods, bounded seasons — Next.js, Prisma, **PostgreSQL** (Docker locally, Neon/Supabase in production).

**Run locally**

1. `docker compose up -d` (Postgres on port 5432)
2. `cp .env.example .env` — default `DATABASE_URL` matches `docker-compose.yml`
3. `npm install && npm run setup && npm run dev` → http://localhost:3000

### Netlify

**`DATABASE_URL` is required for the build.** The build runs `prisma migrate deploy`; without `DATABASE_URL` in Netlify’s environment, the build fails with `P1012` / “Environment variable not found: DATABASE_URL”.

1. Create a **Postgres** database (e.g. [Neon](https://neon.tech)) and copy the connection string (include `?sslmode=require` if your provider expects it).
2. In [Netlify](https://app.netlify.com): **Add new site** → Import from Git → this repo.
3. **Before** triggering a deploy: **Site configuration → Environment variables** → add at least:
   - **`DATABASE_URL`** — your Postgres URL (required for build)
   - `AUTH_SECRET` — long random string (`openssl rand -base64 32`)
   - `AUTH_URL` — `https://<your-site>.netlify.app` (use your real Netlify URL after first deploy, or set after you know it)
   - `NEXT_PUBLIC_SITE_URL` — same as `AUTH_URL`
   - **Sign-in:** email + password works for everyone (`/auth/signup` → `/auth/signin`). Optionally add:
     - **Google:** `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` (OAuth redirect `https://<site>/api/auth/callback/google`)
     - **Magic link:** `EMAIL_SERVER` + `EMAIL_FROM`
4. **Deploy** (or **Clear cache and deploy** if you already failed once).
5. After a successful deploy, run **seed** once against production DB (from your machine with prod `DATABASE_URL`): `npx tsx prisma/seed.ts`
6. Optional: `AFTERHOURS_AUTO_SEED_DISCOVERY=false` on Netlify for production if you don’t want demo discovery auto-seed.

### Sign-in

| Method | Who can use it |
|--------|----------------|
| **Email + password** | Anyone: sign up at `/auth/signup`, then sign in (no extra env vars). |
| **Google** | Any Google account, if `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` are set. |
| **Email magic link** | Any email address, if `EMAIL_SERVER` (and usually `EMAIL_FROM`) is set. |

Local `npm run setup` seeds demo users at `@demo.afterhours.local`; sign in with that email and the password from `SEED_DEMO_LOGIN_PASSWORD` (default `afterhours-demo` — see `.env.example`).
