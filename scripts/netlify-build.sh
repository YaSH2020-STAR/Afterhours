#!/usr/bin/env bash
# Netlify runs this before the Next build. Prisma migrations need a real DATABASE_URL.
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo ""
  echo "Netlify build error: DATABASE_URL is not set."
  echo ""
  echo "  1. Open Netlify → your site → Site configuration → Environment variables"
  echo "  2. Add DATABASE_URL with your PostgreSQL connection string (e.g. from https://neon.tech)"
  echo "  3. Save, then trigger Deploy → Clear cache and deploy site"
  echo ""
  exit 1
fi

npx prisma migrate deploy
npm run build
