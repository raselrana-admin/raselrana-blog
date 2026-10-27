# Changelog

## Unreleased

- "Tools" in the navbar: a menu of the available tools from `raselrana.com.bd/tools` (plain link without JavaScript or when the tools API is down), also in the phone menu and the footer; a Tools card on the System page.

## 1.1.0 — 2026-10-24

- Admin matches the website dashboard: a top bar (page title, View site, theme, sign-out, an "Under development" pill), pop-up confirmations after saving, and the System page as one card per check with a "Check again" button.
- Message for visitors while under development, set on the Site page; the page says "Back soon" once the blog has been live and answers with status 503.
- Signed-in blog users see the real blog while it is under development, with a banner.
- Switching back on reaches visitors within a minute (switching off still within 10 minutes).

## 1.0.0 — 2026-10-23

First release of the blog at [raselrana.com.bd/blog](https://raselrana.com.bd/blog), served as one zone of the main site.

### For readers
- Blog home with search, a "Start from what you need" index by post type, the newest post as a feature and a dated list of the rest.
- Article pages at `/blog/<slug>`: table of contents, reading progress, a link on every section, Copy on code blocks, share row, previous / next, related posts and an author card.
- Category, post type, topic and author pages; topics overview; old addresses redirect.
- Markdown extras: callout boxes, captioned images, photo grids, click-to-play YouTube.
- The main site's brand: logo, colours, Poppins and IBM Plex Mono, header, phone menu and footer; light and dark mode carried over from the main site.
- Branded link-preview images, sitemap and article structured data; `noindex` until launch.

### For the author
- Admin at `/blog/admin`: overview, posts list with filters, Markdown editor with live preview, autosave, image uploads to Cloudinary, pre-publish checklist and scheduling.
- Categories, topics (rename, merge) and profile pages.
- One-click sign-in from the website dashboard as the blog's super admin; password sign-in with rate limiting for other accounts.
- **Site live switch** (super admin): turns the public blog on or off without a redeploy, after a warning; every flip is emailed (Resend) and listed. Visitors see a change within 10 minutes.
- **System** page: live checks of the database, Cloudinary, Resend, the website sign-in and the site settings, with a test email; a summary on the Overview.
- Six starter posts and `npm run import:posts`.

### For the main site
- `GET /blog/api/posts` for its "Latest writing" section.

### Security
- Next.js 16.4.2 (fixes GHSA-2464-fhr4-w9xw and GHSA-p3m5-59mp-jv5r).
- Production shows the under-development page until the site is switched live; a database error counts as not live.
