# Railway recipe

## Fits when
- Apps with a server that runs all the time: Node.js/Express, Python (FastAPI, Django, Flask), Go, Ruby. Background jobs. Apps that need a real database (Postgres, MySQL, Redis) next to the code.
- It's the Builder Method's default for anything with a back end and data.
- Less ideal for a purely static site: it works, but a static host is simpler.
- Pricing: https://railway.com/pricing. Usage-based, with a trial; check current pricing before deciding.

## Prerequisites
- A Railway account (https://railway.com), ideally signed in with GitHub.
- The Railway CLI: `npm i -g @railway/cli` (or `brew install railway` on macOS). Then `railway login`, which opens the browser.
- The code in a GitHub repository is recommended (automatic deploys on every push), but not required.

## Prepare
- Railway detects the language and builds automatically. Make sure `package.json` (or the equivalent) has a `start` script that runs the production server.
- **Port:** the app must listen on the port Railway gives it: `process.env.PORT` (Node) or `os.environ["PORT"]` (Python). Keep a local fallback such as 3000.
- **Environment variables:** never in the code. Set them in the service's **Variables** tab, or with `railway variables --set "NAME=value"`. Keep `.env.example` with the names only.
- **Database:** add one to the project (dashboard: **+ New → Database → PostgreSQL**, or `railway add`). Railway exposes `DATABASE_URL` to the service. A SQLite file is lost on every redeploy unless you attach a **Volume** and store the file there. For real data, prefer Postgres.

## Deploy
**You (the user) do:** create the project in Railway, or let Claude run `railway init`. If you use GitHub, connect the repository in **+ New → GitHub Repo** so every push deploys.
**Claude does:**
1. `railway init` (new project) or `railway link` (existing one).
2. Set the variables (`railway variables --set ...`), names from `.env.example`. The user types any secret values, or pastes them in the dashboard.
3. `railway up` to deploy the current folder, or push to the connected GitHub branch.
4. `railway domain` to generate a public `*.up.railway.app` URL.

**Verify:** open the public URL and walk each flow once (a smoke test). Check the logs with `railway logs` if anything fails.

## Domain
In the service: **Settings → Networking → Custom Domain**. Enter `yourdomain.com` (or `www.yourdomain.com`). Railway shows the DNS records to add at your domain registrar, usually a **CNAME** pointing to the target it gives you, sometimes with a TXT record for verification. For a root domain without CNAME support, use the registrar's ALIAS/ANAME/CNAME-flattening option. DNS changes can take from minutes to a few hours.

## Rollback
In the service's **Deployments** list, open the last good deployment and choose **Redeploy** (Railway calls it rollback). Alternatively, revert the commit (`git revert`) and push.
