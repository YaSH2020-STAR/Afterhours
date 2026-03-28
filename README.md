# AfterHours

Production-ready marketing site and waitlist for **AfterHours** — focused on **young working professionals (~20–30) who recently moved to a new city**; small pods, recurring rituals, bounded seasons (Next.js App Router, Prisma, Zod).

## Local development

```bash
npm install
# .env is created from .env.example — SQLite by default
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Prisma connection string. Default `file:./dev.db` (SQLite under `prisma/`). |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata, sitemap, and robots (e.g. `https://your-domain.com`). |

## Database

- **Development:** SQLite (`file:./dev.db`) — zero setup.
- **Production (recommended):** Use **PostgreSQL** (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or Docker via `docker-compose.yml`). Update `prisma/schema.prisma` `provider` to `postgresql`, set `DATABASE_URL`, then run `npx prisma migrate dev` (or `db push` for prototyping).

SQLite on serverless hosts (e.g. Vercel) is **not** suitable for persistent writes — use Postgres.

## Scripts

| Script | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Start production | `npm start` |
| Lint | `npm run lint` |
| Prisma Studio | `npm run db:studio` |
| Push schema (dev) | `npm run db:push` |

## Deploy (e.g. Vercel)

1. Connect the repo; set `NEXT_PUBLIC_SITE_URL` and Postgres `DATABASE_URL`.
2. Build command: `npm run build` (runs `prisma generate` automatically).
3. Ensure the Prisma client is generated on each build (`postinstall` + build script).

## API

- `POST /api/waitlist` — JSON body validated with Zod; stores intake in `WaitlistSubmission`. Duplicate emails return a friendly success message (no error leak).

## Hackathon / judge demo (Phoenix, AZ)

- **Browse sample rows:** [http://localhost:3000/demo/phoenix](http://localhost:3000/demo/phoenix) (or your deployed URL + `/demo/phoenix`).
- **Data file:** `src/data/phoenix-demo-samples.ts` — 10 fictional Greater Phoenix profiles (emails `@demo.afterhours.example`).
- **Load into SQLite:** `npm run db:seed` — inserts those rows via Prisma (deletes prior demo emails first). Then use **Prisma Studio** (`npm run db:studio`) to show the table live.

## License

Private / your team — adjust as needed.
