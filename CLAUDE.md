# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NASA.cam is a React web application for browsing NASA Perseverance rover images from Mars. Users can filter images by Earth date, Sol (Mars day), and camera type.

## Development Commands

### Frontend
- `npm start` - Start React dev server only (no API)
- `npm run build` - Create production build
- `npm test` - Run test suite (Jest)

### Full Stack (Frontend + API)
- `vercel dev` - Run full stack locally (recommended for development)

### Backend/Database
- `npm run db:push` - Push Prisma schema to database
- `npm run db:generate` - Generate Prisma client
- `npm run scrape` - Run incremental scraper (fetch new sols)
- `npm run backfill` - Backfill historical data from NASA
- `npm run backfill -- 100 500` - Backfill specific sol range
- `npm run backfill -- 0 1730 3` - Backfill with custom concurrency

### Utility Scripts
- `npx ts-node scripts/check-db.ts` - Check database contents

## Architecture

### Frontend (src/)
React app with state managed in `src/App.js`:
- `manifestData` - Mission data from API
- `fetchedPhotos` / `filteredPhotos` - Photos before and after camera filtering
- `datePicked` / `solPicked` - User-selected date or sol
- `activeCamera` - Current camera filter
- `selectedImage` - Image open in modal

### Backend API (api/)
Vercel serverless functions:
- `GET /api/v1/manifests/perseverance` - Mission manifest with photo stats per sol
- `GET /api/v1/rovers/perseverance/photos?sol=N` - Photos by sol
- `GET /api/v1/rovers/perseverance/photos?earth_date=YYYY-MM-DD` - Photos by date
- `GET /api/cron/scrape` - Cron endpoint for daily data sync (Vercel cron)

### Database (prisma/)
PostgreSQL (Neon) with Prisma ORM:
- `Camera` - Perseverance cameras (name, fullName)
- `Photo` - Image records (imgSrc, sol, earthDate, cameraId)

### Data Ingestion (scripts/)
- `scrape.ts` - Incremental scraper for new sols
- `backfill.ts` - Bulk backfill with parallel fetching and retry logic
- `check-db.ts` - Database status check

**NASA Data Source:**
```
https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&sol={sol}
```
Note: NASA rate limits this endpoint (~30 req/min). Backfill uses concurrency=1 with 2s delays by default.

## Component Structure
```
App.js (state manager)
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
- **Build**: Create React App (react-scripts 5)

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

3. Initialize database:
   ```bash
   npm run db:push
   ```

4. Backfill data (takes ~1-2 hours due to NASA rate limits):
   ```bash
   npm run backfill
   ```

5. Run locally:
   ```bash
   vercel dev
   ```

## Environment Variables

Required (auto-populated by Vercel + Neon integration):
- `DATABASE_URL` - Neon pooled connection string
- `DATABASE_URL_UNPOOLED` - Neon direct connection string

Optional:
- `CRON_SECRET` - Auth token for cron endpoint

## Deployment

Deployed on Vercel with:
- Automatic builds on push
- Daily cron job at 6 AM UTC to fetch new images
- Neon PostgreSQL for serverless-optimized database
