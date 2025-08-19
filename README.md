# AfroGenstas - Music Meets Finance (PWA)

## Overview
Single-file mobile-first PWA front-end in `public/index.html` plus a Vercel serverless function `api/summarize.js` for Gemini summarization.

## Repo structure

afrogenstas/
├─ api/
│  └─ summarize.js
├─ public/
│  └─ index.html
│  └─ assets/
├─ vercel.json
├─ download-assets.sh
├─ README.md
└─ .gitignore

## Environment variables (Vercel)
Set these in Vercel Project → Settings → Environment Variables:
- `GEMINI_KEY` — your Google AI Studio API key (server-only)
- `CLIENT_KEY` — a short token your front-end will send in header `x-client-key` (convenience token)

## Deploy (quick)
1. Initialize repo locally and push to GitHub (example below).
2. Import repo into Vercel (https://vercel.com/new)
3. Add the required environment variables in the Vercel project settings.
4. Deploy.

## Local dev (Vercel CLI)
```bash
npm i -g vercel
vercel login
vercel dev
