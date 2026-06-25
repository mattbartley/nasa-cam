# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NASA.cam is a React web application for browsing NASA Perseverance rover images from Mars. Users can filter images by Earth date, Sol (Mars day), and camera type.

This repo is the **public app**: the React frontend and the read-only API. The
data that the app serves is produced separately by a **private ingestion repo**
(`nasa-cam-ingest`), which scrapes NASA's feed into the shared Neon database. This
repo only reads from that database — it does not scrape.

## Development Commands

### Frontend
- `npm run dev` (or `npm start`) - Start the Vite dev server (frontend only, no API)
- `npm run build` - Create production build (`build/`)
- `npm run preview` - Serve the production build locally

### Full Stack (Frontend + API)
- `vercel dev` - Run full stack locally (recommended for development)

### Backend/Database
- `npm run db:push` - Push Prisma schema to database
- `npm run db:generate` - Generate Prisma client

## Architecture

### Frontend (src/)
React app with state managed in `src/App.jsx`:
- `manifestData` - Mission data from API
- `fetchedPhotos` / `filteredPhotos` - Photos before and after camera filtering
- `datePicked` / `solPicked` - User-selected date or sol
- `activeCamera` - Current camera filter
- `selectedImage` - Image open in modal

### Backend API (api/)
Vercel serverless functions (read-only):
- `GET /api/v1/manifests/perseverance` - Mission stats (total photos, latest sol/date)
- `GET /api/v1/rovers/perseverance/photos?sol=N` - Photos by sol
- `GET /api/v1/rovers/perseverance/photos?earth_date=YYYY-MM-DD` - Photos by date
- `GET /api/v1/rovers/perseverance/activity?from=YYYY-MM-DD&to=YYYY-MM-DD` - Days with photos in a range (drives the DatePicker, fetched one month at a time)

### Database (prisma/)
PostgreSQL (Neon) with Prisma ORM:
- `Camera` - Perseverance cameras (name, fullName)
- `Photo` - Image records (imgSrc, sol, earthDate, cameraId)
- `ScrapeProgress` - Per-sol ingestion state, **written by the private
  `nasa-cam-ingest` repo**, not this app. Modeled here only so `prisma db push`
  doesn't drop the table.

### Data ingestion (separate, private)
Scraping the NASA feed (incremental + backfill) lives in the **private
`nasa-cam-ingest` repo**, which writes to the same Neon database. It is not part
of this repo. If you need to add/refresh data, work there.

## Component Structure
```
App.jsx (state manager)
├── HomeScreen (Nav + Banner)
├── Stats (mission statistics)
├── DatePicker / SolPicker (filter controls)
├── GalleryFilter (camera selector)
├── DateSummary (current filter display)
├── PhotoGallery → ImageModal (gallery with full-screen viewer)
├── Footer
└── ScrollToTop
```

## Tech Stack
- **Frontend**: React 18, Material-UI 5, Framer Motion, Moment.js
- **Backend**: Vercel serverless functions, Prisma ORM
- **Database**: PostgreSQL (Neon serverless)
- **Build**: Vite 7 (`@vitejs/plugin-react`)

## Setup

1. Clone and install:
   ```bash
   npm install
   ```

2. Set up Vercel + Neon database:
   ```bash
   vercel link
   vercel env pull .env.local
   cp .env.local .env
   ```

3. Generate the Prisma client:
   ```bash
   npm run db:generate
   ```

4. Run locally (data is populated separately via the `nasa-cam-ingest` repo):
   ```bash
   vercel dev
   ```

## Environment Variables

Required (auto-populated by Vercel + Neon integration):
- `DATABASE_URL` - Neon pooled connection string
- `DATABASE_URL_UNPOOLED` - Neon direct connection string

## Deployment

Deployed on Vercel with:
- Automatic builds on push
- Neon PostgreSQL for serverless-optimized database

Data ingestion (and any scheduled scraping) runs out of the private
`nasa-cam-ingest` repo, not this deployment.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`mattbartley/nasa-cam`) via the `gh` CLI; external PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical label vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
