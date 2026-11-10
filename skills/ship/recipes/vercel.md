# Vercel recipe

## Fits when
- Websites and front-end apps: Next.js, Vite/React, Astro, SvelteKit, Nuxt, static sites. Full-stack JavaScript apps whose back end is API routes or functions (it also runs Express, FastAPI and similar back ends as functions).
- Fast global delivery, and preview URLs for every change.
- Not a fit when the app keeps data in **local files** (SQLite, uploads to disk): files written at runtime don't persist. Use a hosted database from the Vercel Marketplace (e.g. Postgres from Neon or Supabase) and Vercel Blob for files, or choose Railway.
- Pricing: https://vercel.com/pricing. A free Hobby plan for personal, non-commercial use; check current pricing and terms before deciding.

## Prerequisites
- A Vercel account (https://vercel.com), ideally signed in with GitHub.
- The Vercel CLI: `npm i -g vercel`, then `vercel login`.
- The code in a GitHub repository is recommended (automatic preview and production deploys).

## Prepare
- Vercel detects the framework and its build command. Check that `npm run build` works locally.
- **Environment variables:** dashboard **Project → Settings → Environment Variables**, or `vercel env add NAME production`. Pull them locally with `vercel env pull`. Keep `.env.example` with the names only.
- **Database:** add one from the **Marketplace** (Storage tab). It injects its connection variables into the project.
- Request and response bodies of functions are limited to 4.5 MB. Large uploads go directly to Blob storage.

## Deploy
**You (the user) do:** import the GitHub repository at https://vercel.com/new, or let Claude deploy from the CLI.
**Claude does:**
1. `vercel link` to connect the folder to a project.
2. Add the environment variables (the user types any secret values).
3. `vercel` for a preview deployment; check it.
4. `vercel --prod` for production.

**Verify:** open the production URL (`*.vercel.app`) and walk each flow once (a smoke test). Check the logs in the dashboard (**Deployments → the deployment → Logs**) if anything fails.

## Domain
**Project → Settings → Domains → Add**, or `vercel domains add yourdomain.com`. Vercel shows the exact DNS records to add at your registrar: usually an **A** record for the root domain and a **CNAME** for `www`. Alternatively, move the domain's nameservers to Vercel. DNS changes can take from minutes to a few hours.

## Rollback
Dashboard **Deployments → previous production deployment → Instant Rollback**, or `vercel rollback` from the CLI. To make a fixed version live again, deploy it with `vercel --prod` (or promote a preview with `vercel promote <url>`).
