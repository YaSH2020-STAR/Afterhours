# AfterHours

**Repository:** [github.com/YaSH2020-STAR/Afterhours](https://github.com/YaSH2020-STAR/Afterhours)

Small weekly pods, bounded seasons — Next.js, Prisma, **PostgreSQL** (Docker locally, Neon/Supabase in production).

**Run locally**

1. `docker compose up -d` (Postgres on port 5432)
2. `cp .env.example .env` — default `DATABASE_URL` matches `docker-compose.yml`
3. `npm install && npm run setup && npm run dev` → http://localhost:3000

### Netlify

1. Create a **Postgres** database (e.g. [Neon](https://neon.tech)) and copy the connection string.
2. In [Netlify](https://app.netlify.com): **Add new site** → Import from Git → pick this repo.  
   Build settings are in `netlify.toml` (migrations run before `next build`).
3. **Site configuration → Environment variables** (minimum):
   - `DATABASE_URL` — Postgres URL (with SSL for Neon)
   - `AUTH_SECRET` — long random string
   - `AUTH_URL` — `https://<your-site>.netlify.app`
   - `NEXT_PUBLIC_SITE_URL` — same as `AUTH_URL`
   - Optional: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `EMAIL_SERVER`, `DEMO_LOGIN_*` for sign-in (see `.env.example`)
4. Deploy. After first deploy, run **seed** once from your machine (or CI) with `DATABASE_URL` pointing at production:  
   `npx tsx prisma/seed.ts`  
   Or use Neon SQL editor / Prisma Studio against prod.
5. Set `AFTERHOURS_AUTO_SEED_DISCOVERY=false` on Netlify if you do not want demo discovery data auto-upserted in production.

### Sign-in (what “anyone” means)

| Method | Who can use it |
|--------|----------------|
| **Google** | Any Google account, if `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` are set (creates user on first sign-in). |
| **Email magic link** | Any email address, if `EMAIL_SERVER` (and usually `EMAIL_FROM`) is set. |
| **Demo password** | Only emails in `DEMO_LOGIN_EMAILS` (or the single `ALLOWED_LOGIN_EMAIL`) with the shared demo password — **not** open to arbitrary emails. |

Copy `.env.example` to `.env` so demo sign-in is available locally. To allow **any** visitor to log in, add Google and/or email SMTP in `.env` (see comments in `.env.example`).
