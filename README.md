# Rasel Rana — Blog

The technical blog of Rasel Rana, Manager (Technical) at BTCL: field notes on telecom networks, GPON and fibre, MikroTik, VoIP and power systems. Public address: **[raselrana.com.bd/blog](https://raselrana.com.bd/blog)**.

This repository is one zone of the main site (Next.js Multi-Zones). It is deployed as its own Vercel project (internal domain `blog-zone.raselrana.com.bd`, never linked publicly), runs with `basePath: "/blog"`, and the main site (`raselrana-web`) rewrites `/blog` and `/blog/:path+` to it.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, plain JavaScript |
| Styling | Tailwind CSS v4 with the main site's design tokens; Poppins + IBM Plex Mono |
| Data | MongoDB Atlas + Prisma 6 (stays on 6: Prisma 7 has no MongoDB support) |
| Sign-in | Auth.js v5 beta: email + password, plus one-click sign-in from the main site's dashboard |
| Images | Cloudinary, uploaded straight from the browser |
| Content | Markdown (react-markdown, GFM, syntax highlighting) |
| Theme | next-themes, shared with the main site |
| Hosting | Vercel, with Analytics and Speed Insights |

Look and accessibility follow [docs/brand-guide.md](docs/brand-guide.md); structure and the public API follow [docs/design-brief.md](docs/design-brief.md). Both come from the main site project.

## Features

**For readers**
- Blog home with search, a "Start from what you need" index by post type (Troubleshooting, How-to, Explainer, Comparison), the newest post as a feature, then a dated list.
- Category, post type, topic and author pages; articles at `/blog/<slug>`, with old addresses redirecting.
- Post page: table of contents, reading progress, a `#` link on every section, a Copy button on code blocks, share row, previous / next, related posts, author card.
- Markdown extras: callout boxes, captioned images, photo grids, click-to-play YouTube.
- Branded link-preview images (`/blog/api/og`), sitemap at `/blog/sitemap.xml`, structured data on articles.
- Light and dark mode that carries over from the main site; every page readable without JavaScript.

**For the author** (at `/blog/admin`)
- Posts list with filters; Markdown editor with live preview, autosave, image uploads, a pre-publish checklist and scheduling.
- Categories, topics (rename, merge) and profile pages; login rate limiting and role-based permissions.
- **System** page: live checks of the database, Cloudinary, Resend, the website sign-in and the site settings, with a test email; a summary of it on the Overview.
- **Super admin:** the website owner, signed in at `raselrana.com.bd/admin`, opens **Apps → Blog admin** and lands in the blog admin with no second password ([docs/blog-admin-handover.md](docs/blog-admin-handover.md)). Other admins and authors use the blog's own login.
- **Site live switch** (super admin): turns the public blog on or off without a redeploy, after a warning; every flip is emailed and listed in the admin.

**For the main site**
- `GET /blog/api/posts?limit=3` feeds its "Latest writing" section ([docs/main-site-api.md](docs/main-site-api.md)).

Not included by decision: RSS, comments, newsletter, visual editor.

## Getting started

Keep the project in a path without `&`, `%` or other shell-special characters; they break npm's `.bin` shims on Windows.

```bash
git clone <repo-url>
cd raselrana-blog
npm install              # also runs prisma generate
```

**Environment.** Copy `.env.example` to `.env.local` and fill it in; every variable is explained there. The Prisma CLI reads only `.env`, so put `DATABASE_URL` there as well. Everything except the `ADMIN_*` values also goes in the blog's Vercel project.

**Database and first admin.**

```bash
npx prisma db push                  # create collections and indexes (never use --force-reset)
npm run seed:categories             # the six launch categories; safe to run again
node src/scripts/create-admin.js    # blog admin from ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME
npm run import:posts                # optional: the starter posts in content/seed-posts/, as drafts
```

**Run it.**

```bash
npm run dev
```

The blog runs at `http://localhost:3000/blog` (the base path applies locally too); sign in at `/blog/admin/login`. Links to the main site (`/about`, `/contact`) 404 locally, because the main site is a different app.

**With the main site**, to try the one-click sign-in: start the blog with `npm run dev -- -p 3001`, then the main site with `BLOG_DOMAIN=http://localhost:3001` on port 3000, and use `http://localhost:3000`. The blog's `MAIN_SITE_URL` stays `http://localhost:3000`.

On Windows, stop the dev server before `prisma generate` or `prisma db push`, or they fail with `EPERM`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server (through `node --dns-result-order=ipv4first`, for Atlas) |
| `npm run build` / `npm run start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run seed:categories` | Create the launch categories |
| `npm run import:posts` | Import `content/seed-posts/*.md` as drafts by slug (`-- --dry-run` to preview) |
| `node src/scripts/create-admin.js` | Create or update the blog admin; also changes its password |
| `npx prisma db push` | Sync `prisma/schema.prisma` to MongoDB |

There is no test suite.

## Project structure

```
content/seed-posts/   starter posts (YAML header + Markdown) for npm run import:posts
docs/
  brand-guide.md          look: logo, colours, fonts, header, footer, accessibility
  design-brief.md         structure and the /api/posts contract
  main-site-api.md        the API the main site reads
  blog-admin-handover.md  super-admin sign-in from the main site
  BLOG_ADMIN_SPEC.md      admin and categories build spec, with its progress table
prisma/schema.prisma  Post, User, Category, Tag, LoginAttempt
src/
  app/
    (site)/      public pages: home, article, category, type, topic, author, about, preview
    admin/       login, sso (main-site sign-in) and the signed-in panel
    api/         posts, og (share images), auth
  asset/         logo master files and the fonts for share images
  components/    layout, blog, mdx (the Markdown renderer), admin, auth, brand, media
  lib/           auth, authz, main-site, prisma, cloudinary, posts helpers, ui classes
  providers/     Auth.js session provider (admin pages only)
  scripts/       create-admin, seed-categories, import-posts
  services/      posts, taxonomy, users, uploads
  proxy.js       guards /admin; serves the under-development page while the site is not live
```

`CLAUDE.md` holds the detailed architecture notes and the rules that are easy to break (base path, permissions, the main-site API).

## Going live

1. In the blog's Vercel project, set:
   - `MAIN_SITE_URL=https://raselrana.com.bd`, or the owner cannot sign in from the website dashboard;
   - `AUTH_URL=https://raselrana.com.bd/blog/api/auth`;
   - `RESEND_API_KEY` and `NOTIFY_EMAIL_FROM`, for the email sent each time the site is switched.

   Redeploy after changing them.
2. Open **Blog admin → Site** and switch the site live. A warning shows what will change first, you get an email, and visitors see the blog within 10 minutes. Switch it back the same way. Until it is switched on, visitors see the under-development page; `/blog/admin` always works, and preview deployments always show the blog.
3. When search engines may come in, set `BLOG_INDEXABLE=true` in Vercel and redeploy. Until then every page is `noindex`; `/blog/admin` always is.

## Git workflow

Work on `feature/*` branches, merged into `develop` through pull requests; `main` is the release branch that production deploys from.
