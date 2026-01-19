# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NASA.cam is a React web application for browsing NASA Perseverance rover images from Mars. Users can filter images by Earth date, Sol (Mars day), and camera type. Live at https://nasa.cam/

## Development Commands

### Frontend
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run test suite (Jest)

### Backend/Database
- `npm run db:push` - Push Prisma schema to database
- `npm run db:generate` - Generate Prisma client
- `npm run scrape` - Run incremental scraper (fetch new sols)
- `npm run backfill` - Backfill all historical data
- `vercel dev` - Run full stack locally (frontend + API)

## Architecture

### Frontend (src/)
All application state lives in `src/App.js`. Key state includes:
- `manifestData` - Mission data from API
- `fetchedPhotos` / `filteredPhotos` - Photos before and after camera filtering
- `datePicked` / `solPicked` - User-selected date or sol
- `activeCamera` - Current camera filter
- `selectedImage` - Image open in modal

### Backend API (api/)
Vercel serverless functions that serve the photo data:
- `GET /api/v1/manifests/perseverance` - Mission manifest with photo stats per sol
- `GET /api/v1/rovers/perseverance/photos?sol=N` - Photos by sol
- `GET /api/v1/rovers/perseverance/photos?earth_date=YYYY-MM-DD` - Photos by date
- `GET /api/cron/scrape` - Cron endpoint for daily data sync

### Database (prisma/)
PostgreSQL with Prisma ORM:
- `Camera` - 17 Perseverance cameras (name, fullName)
- `Photo` - Image records (imgSrc, sol, earthDate, cameraId)

### Data Ingestion (scripts/)
- `scrape.ts` - Incremental scraper for new sols
- `backfill.ts` - One-time backfill of all historical data

NASA data source: `https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json`

### Component Structure
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

### Styling
- Component-scoped CSS files in `src/css/`
- MUI dark theme defined in `src/utils/Pallete.js` (primary: #519591, background: #101824)
- Custom font: Jura

### Tech Stack
- Frontend: React 18, Material-UI 5, Framer Motion, Moment.js
- Backend: Vercel serverless functions, Prisma, PostgreSQL
- Build: Create React App (react-scripts 5)

## Setup

1. Copy `.env.example` to `.env` and configure DATABASE_URL
2. Run `npm install`
3. Run `npm run db:push` to create tables
4. Run `npm run backfill` to populate historical data
5. Run `vercel dev` to start locally

## Key Patterns

- Refs prevent redundant API fetches on mount
- Images use multiple resolutions (320px, 800px, 1200px) for optimization
- Infinite scroll loads 25 images at a time
- Framer Motion handles modal and gallery animations
- Vercel cron runs daily at 6 AM UTC to fetch new images
