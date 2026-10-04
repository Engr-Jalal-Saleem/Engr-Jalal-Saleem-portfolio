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

Advanced editor (Keystatic): `/keystatic`, behind the same login.

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

## Keystatic (advanced, optional)

Locally, Keystatic writes straight to the files on disk, so you edit, then commit and push.

To edit directly on the live site:

1. Deploy `web/` to Vercel (Root Directory = `web`).
2. In Vercel, set `NEXT_PUBLIC_KEYSTATIC_STORAGE=github`.
3. Open `https://<your-domain>/keystatic` and follow the prompt to create the
   Keystatic GitHub App. It adds `KEYSTATIC_GITHUB_CLIENT_ID`,
   `KEYSTATIC_GITHUB_CLIENT_SECRET` and `KEYSTATIC_SECRET` for you. Add those to Vercel too.
4. From then on, every Save commits to GitHub and Vercel redeploys in about a minute.

Only GitHub accounts with write access to the repo can log in.

## Structure

```
content/          all editable content (JSON + .mdoc)
public/images     project and story images
public/videos     explainer videos
components/       animated pieces (particle hero, ground track, story rail, tilt cards)
app/(site)/       pages
keystatic.config.ts   admin panel schema
```
