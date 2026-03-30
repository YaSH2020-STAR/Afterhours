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
   - Optional: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `EMAIL_SERVER`, `DEMO_LOGIN_*` (see `.env.example`)
4. **Deploy** (or **Clear cache and deploy** if you already failed once).
5. After a successful deploy, run **seed** once against production DB (from your machine with prod `DATABASE_URL`): `npx tsx prisma/seed.ts`
6. Optional: `AFTERHOURS_AUTO_SEED_DISCOVERY=false` on Netlify for production if you don’t want demo discovery auto-seed.

### Sign-in (what “anyone” means)

| Method | Who can use it |
|--------|----------------|
| **Google** | Any Google account, if `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` are set (creates user on first sign-in). |
| **Email magic link** | Any email address, if `EMAIL_SERVER` (and usually `EMAIL_FROM`) is set. |
| **Demo password** | Only emails in `DEMO_LOGIN_EMAILS` (or the single `ALLOWED_LOGIN_EMAIL`) with the shared demo password — **not** open to arbitrary emails. |

Copy `.env.example` to `.env` so demo sign-in is available locally. To allow **any** visitor to log in, add Google and/or email SMTP in `.env` (see comments in `.env.example`).
