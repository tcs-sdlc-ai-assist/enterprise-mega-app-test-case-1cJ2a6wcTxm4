# 🚀 Deployment Guide — Enterprise Mega App

This document describes how to deploy the **Enterprise Mega App** to production, including environment variables, Vercel configuration, and CI/CD notes.

---

## 1. Prerequisites

- Node.js 18+ (for local builds)
- Vercel account (recommended) or any static hosting provider
- Access to the repository and environment variables

---

## 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```
cp .env.example .env
```

**Variables:**

- `VITE_ENABLE_DEMO_DATA` — Set to `true` to enable local demo data (default: true)
- `VITE_API_BASE_URL` — (Optional) API base URL if connecting to a backend
- `VITE_ANALYTICS_KEY` — (Optional) Analytics integration key

**Vercel:**  
Set these variables in the Vercel dashboard under **Project Settings → Environment Variables**.

---

## 3. Build & Preview Locally

```sh
npm install
npm run build
npm run preview
```

Open [http://localhost:4173](http://localhost:4173) to preview the production build.

---

## 4. Deploy to Vercel

Vercel is recommended for zero-config deployment.

### Steps:

1. Push your code to GitHub/GitLab/Bitbucket.
2. Import the repo into Vercel.
3. Set environment variables in the Vercel dashboard.
4. Vercel auto-detects Vite + React and builds with:

   ```
   npm install
   npm run build
   ```

5. The app is deployed as a static site.

**Vercel Routing:**  
The included `vercel.json` ensures all routes are rewritten to `/` for SPA support.

---

## 5. Custom Domains

- Add your custom domain in Vercel dashboard.
- Vercel will guide you through DNS setup.

---

## 6. CI/CD Notes

- All pushes to `main` (or your default branch) trigger a build and deploy.
- Pull requests get preview deployments.
- All tests (`npm run test`) must pass before deployment (see Vercel's Git Integration settings).
- Linting and formatting are enforced via `npm run lint` and `npm run format`.

---

## 7. Other Hosting Providers

You can deploy the static `dist/` folder to Netlify, GitHub Pages, or any static host.

**Netlify Example:**

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: Add `_redirects` file with `/*    /index.html   200`

---

## 8. Troubleshooting

- **Blank screen after deploy:**  
  Ensure all environment variables are set and the SPA rewrite is configured.
- **API requests fail:**  
  Check `VITE_API_BASE_URL` and CORS settings on your backend.
- **Demo data not persisting:**  
  Demo data uses browser `localStorage`. In production, ensure cookies/localStorage are not blocked.

---

## 9. Security & Production Notes

- This app is a **demo** — do not use for real user data.
- No authentication backend is included; all "login" is local and for demonstration only.
- For real apps, integrate a secure backend and authentication provider.

---

**© 2024 Enterprise Mega App Team**