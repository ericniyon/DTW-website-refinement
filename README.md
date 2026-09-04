# Digital Transformation Week — Website

Single deployable project containing the DTW main website, the DTW 2026
sponsorship section, and the content API that backs the sponsorship section.

## Layout

```
.
├── index.html              Single SPA entry point
├── src/                    Main website (TypeScript / TSX)
│   ├── App.tsx             All routes, including the /sponsor sub-tree
│   ├── index.css           Tailwind + main site + sponsorship styles
│   ├── components/         Main site components
│   ├── pages/              Main site pages
│   └── sponsor/            Sponsorship section (JavaScript / JSX)
│       ├── SponsorLayout.tsx   Theme scoping + CMS provider for /sponsor
│       ├── components/
│       ├── constants/routes.js Route prefix used by sponsorship links
│       ├── pages/              Sponsorship landing page
│       ├── pages/admin/        Sponsorship content admin
│       └── store/              CMS state, talks to the backend
└── backend/                Express + Prisma content API (own package.json)
```

The frontend is one Vite app producing one `dist/`. The `backend/` folder is a
separate Node service with its own dependencies and its own deployment.

## Routes

| Route                    | What it serves                                |
| ------------------------ | --------------------------------------------- |
| `/`                      | Main website landing page                     |
| `/register`              | Registration form                             |
| `/contact`               | Contact page                                  |
| `/partners`              | Partners page                                 |
| `/dbs`                   | Digital Business Summit page                   |
| `/previous-dtws`         | Previous editions                             |
| `/gallery/:year`         | Event gallery for a given year                |
| `/sponsor`               | DTW 2026 sponsorship landing page             |
| `/sponsor/admin`         | Sponsorship content admin (login required)    |
| `/sponsor/admin/:section`| Edit a sponsorship page section               |

To move the sponsorship section to a different path, change `SPONSOR_BASE` in
`src/sponsor/constants/routes.js` and the matching `path` in `src/App.tsx`.

## Theming

The main website is light themed; the sponsorship section is dark themed with
its own document-level styling. `SponsorLayout` puts a `sponsor-page` class on
`<html>` while a `/sponsor` route is mounted, and every sponsorship rule that
would otherwise leak site-wide is scoped under `html.sponsor-page` in
`src/index.css`. Keep new document-level sponsorship styles inside that scope.

## Frontend

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build  ->  dist/
npm run lint
npm run preview
```

`src/` is TypeScript and `src/sponsor/` is plain JSX. `allowJs` is enabled in
`tsconfig.app.json` so the TypeScript entry point can import the JSX modules;
the JSX is bundled but not type checked.

Copy `.env.example` to `.env` and fill in:

- `VITE_REGISTRATION_SCRIPT_URL` — Google Apps Script endpoint for the main
  site's registration form. See `docs/GOOGLE_SHEETS_REGISTRATION.md`.
- `VITE_API_BASE_URL` — content API for the sponsorship section. Defaults to
  the hosted backend when unset.

Deployment expects an SPA fallback so client-side routes resolve on refresh;
`vercel.json` provides this on Vercel. On other hosts, rewrite unknown paths to
`/index.html`.

## Deploy on Vercel

This repo is a monorepo. Create **two** Vercel projects from the same GitHub
repository ([sauverpro/dtw-platform](https://github.com/sauverpro/dtw-platform)):

### 1. PostgreSQL

The API needs a hosted Postgres database (Neon, Supabase, or Vercel Postgres).
Use a **pooled** connection string for `DATABASE_URL` (Neon: the URL with
`-pooler` in the host). After the first deploy, apply schema and seed from a
machine that has the production URL:

```bash
cd backend
npx prisma migrate deploy
npm run seed
```

### 2. Backend project

- **Root Directory:** `backend`
- **Framework:** Express (auto-detected from `src/server.ts`)
- Environment variables from `backend/.env.example`: `DATABASE_URL`,
  `JWT_SECRET` (16+ characters), `JWT_EXPIRES_IN`, `CORS_ORIGIN` (must include
  the frontend origin, e.g. `https://<frontend>.vercel.app`), `ADMIN_EMAIL`,
  `ADMIN_PASSWORD`, SendGrid values, and Cloudinary values.

Note the production URL, e.g. `https://dtw-platform-api.vercel.app`. Health
check: `https://<backend>.vercel.app/api/health`.

### 3. Frontend project

- **Root Directory:** `.` (repo root)
- **Framework:** Vite (auto-detected)
- Environment variables from `.env.example`:
  - `VITE_API_BASE_URL` = `https://<backend>.vercel.app/api`
  - `VITE_REGISTRATION_SCRIPT_URL` — Google Apps Script web app URL

SPA refreshes are handled by the root `vercel.json` rewrite to `index.html`.

After the frontend URL is known, add it to the backend `CORS_ORIGIN` and
redeploy the backend.

## Deploy frontend via FTP (dtw.ictchamber.rw)

Pushes to `main` that touch the frontend run
[`.github/workflows/deploy-frontend-ftp.yml`](.github/workflows/deploy-frontend-ftp.yml):
build Vite → upload `dist/` to the hosting FTP account.

Add these **environment secrets** on the environment named exactly
`Production – dtw-platform` (Settings → Environments):

| Secret | Value |
| --- | --- |
| `FTP_SERVER` | `ftp.ictchamber.rw` |
| `FTP_USERNAME` | FTP username for the subdomain |
| `FTP_PASSWORD` | FTP password |

The workflow job uses `environment: Production – dtw-platform` so those
secrets are available. Upload target:
`/home/ictchamber/dtw.ictchamber.rw/dtwictchamber/`.

Optional: `VITE_REGISTRATION_SCRIPT_URL` for the registration form.

You can also run the workflow manually under **Actions → Deploy frontend to FTP → Run workflow**.

Include `https://dtw.ictchamber.rw` in the API project's `CORS_ORIGIN`.

## Backend

Express + Prisma service providing sponsorship content, admin auth, and package
inquiries under `/api`. It has its own `package.json`, so install separately:

```bash
npm run backend:install
npm run backend:dev      # http://localhost:4000
npm run backend:build
npm run backend:start
```

Or run the equivalent scripts from inside `backend/`. Copy
`backend/.env.example` to `backend/.env` and set `DATABASE_URL`, `JWT_SECRET`,
`CORS_ORIGIN`, the admin credentials, and the SendGrid values.

Because the frontend now serves the sponsorship section from the main site's
origin, `CORS_ORIGIN` must include that origin.

```bash
cd backend
npx prisma generate
npx prisma migrate deploy   # or: npm run prisma:migrate
npm run seed
npm test
```

A `Dockerfile` is included for container deployments. For Vercel, see
**Deploy on Vercel** above.
