# DTW2026 Backend

TypeScript + Express + Prisma + PostgreSQL backend for CMS content and admin auth.

## Setup

1. Copy env file:
   - `cp .env.example .env` (or create `.env` manually on Windows).
2. Install dependencies:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Seed first admin and default content:
   - `npm run seed`
6. Start dev server:
   - `npm run dev`

## Scripts

- `npm run dev` - Run server with watch mode
- `npm run build` - Compile TypeScript
- `npm run start` - Start compiled server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Apply dev migrations
- `npm run prisma:deploy` - Apply production migrations
- `npm run seed` - Seed admin + default site content
- `npm run test` - Run API tests

## Deploy on Vercel

This package is the **backend** Vercel project. In the Vercel dashboard, import
the GitHub repo and set **Root Directory** to `backend`. Express is detected
from `src/server.ts`. Set the variables in `.env.example` (use a pooled
Postgres `DATABASE_URL`). Then run `npx prisma migrate deploy` and `npm run seed`
against that database.

See the root README for creating the matching frontend project.

## API

- `POST /api/auth/login`
- `GET /api/site-content`
- `PUT /api/site-content` (Bearer token)
- `GET /api/health`