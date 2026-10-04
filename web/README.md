# Jalal Saleem · portfolio

Next.js 15 + Framer Motion, with a Keystatic admin panel. All content lives in
`content/` as plain JSON and Markdoc files, so every edit is a Git commit you can
see and undo.

## Run it

```bash
cd web
npm install
npm run dev          # site on http://localhost:3000
```

Admin dashboard: **http://localhost:3000/admin** (local password: `admin`)


## What you can change from the admin panel

| Section | What you control |
|---|---|
| Site settings | Name, email, social links, CV PDF upload, availability note, every nav link (rename, reorder, hide) |
| Home page | Intro text, highlighted words, proof chips, counter tiles, research interests, next research question, and which home sections show |
| Story chapters | Add, edit, reorder or hide any chapter of your story, with an image |
| Publications | Title, authors (`**J. Saleem**` makes your name bold), venue, status, summary, key result, PDF upload, link, BibTeX, related project, show on home |
| Projects | Everything on the card and the case study page: cover, video, role, stack, results, repo, demo, gallery, and the full write-up |
| Experience | Role, org, dates, text, which city it lights up on the map, small or full size |
| Honors, Certificates, Skill groups | Add, edit, reorder, hide. Certificates can be featured on the home page |

Every item has **Show on site** and **Order**. Untick to hide without deleting.
Lower order number shows first.

## Add a paper in under 2 minutes

1. Open `/admin` → Publications, type the title, click **+ Add**.
2. Fill in title, authors, venue, year and status. Pick the exact status.
3. Save. The paper appears on `/publications`, and on the home page if
   "Show on home page" is ticked.

## Admin dashboard (/admin)

- **Dashboard:** counts for every section, and what is hidden or featured.
- **Lists:** drag ⋮⋮ to reorder (saves on drop), flip **Show** to hide or show, flip **Home** to put it on the home page, search, **+ Add** new items.
- **Editor:** every field of every item, generated from the content file, so new fields appear automatically. Upload images, PDFs, videos and your CV. Lists inside items (results, stack, chips, nav links) can be added to, removed and reordered. Delete asks you to type DELETE.
- **Site settings / Home page:** name, links, CV, nav, intro, chips, counters, research question, and which home sections show.

### Make the admin save on the live site (Vercel)

Set these in Vercel → Project → Settings → Environment Variables, then redeploy:

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | a long password only you know |
| `ADMIN_SECRET` | any random string |
| `GITHUB_TOKEN` | a fine-grained GitHub token with **Contents: Read and write** on this repo only |
| `GITHUB_REPO` | `Engr-Jalal-Saleem/Engr-Jalal-Saleem-portfolio` |
| `GITHUB_BRANCH` | `main` |

With these set, each Save commits to GitHub and Vercel redeploys in about a minute.
Without `ADMIN_PASSWORD` in production, the admin refuses all logins.

## Structure

```
content/          all editable content (JSON + .mdoc)
public/images     project and story images
public/videos     explainer videos
components/       animated pieces (particle hero, ground track, story rail, tilt cards)
app/(site)/       pages
lib/store.ts      admin read/write (local disk or GitHub)
```

## Analytics (/admin/analytics)

1. Vercel → project → **Storage** → **Create Database** → **Upstash for Redis** (free) → connect to this project.
2. Redeploy. Vercel adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` for you.

Tracked: page views, visitors, sessions, time on page, scroll depth, clicks (CV, papers, email, outside links),
city/region/country (from Vercel's geo headers), device, OS, browser, language, screen size, referrer, UTM tags.
Not stored in analytics: names, emails, IP addresses, cookies. Visitors with Do Not Track or Global Privacy Control are skipped.

**Tracked links:** admin → Tracked links → add one per person (for example `prof-lee-kaist`). Copy the link from
the Analytics page and paste it in your email. You will see when they opened it, from where, what they read and clicked.

## Security (/admin/security)

- **Admin login:** constant-time password check, 5 attempts per 15 minutes per IP, then locked. HTTP-only, SameSite=strict cookie.
- **Uploads:** only JPG, PNG, WebP, AVIF, GIF, PDF, MP4, WebM. No HTML, SVG or scripts.
- **Rate limits:** tracking endpoint 120 requests per minute per IP, 4 KB max body.
- **Headers:** Content Security Policy, HSTS, X-Frame-Options DENY, nosniff, strict referrer, Permissions-Policy.
- **Security log:** failed logins, blocked requests and rejected uploads, with IP, kept 7 days then deleted automatically.
- **DDoS:** handled by Vercel at the network edge. To block an IP: Vercel → project → Firewall → New Rule → IP Address → Deny.
- **Dependencies:** `npm audit` clean (postcss pinned via `overrides`).
