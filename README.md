# Journt

Journt is a modern, minimalist travel planner built with Next.js 14, App Router, Tailwind CSS, Framer Motion, and Google Fonts (Inter/Poppins).

## Features
- Landing page with city/days search and AI itinerary generator
- Blog with markdown posts (`/src/content/blog`)
- Store for digital downloads
- PDF/DOCX export for itineraries
- Mobile responsive, sticky header, smooth animations

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Folder Structure
- `/src/app` — Main app pages
- `/src/content/blog` — Blog markdown posts
- `/store` — Store page

## Customization
- Update blog posts in `/src/content/blog`
- Update store products in `/src/app/store/page.tsx`

---

© Journt. All rights reserved.
