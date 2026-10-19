# Blog front end — design brief

**For:** whoever builds the public side of the blog project (`raselrana-blog`).
**From:** the main site project (`raselrana-web`, live at raselrana.com.bd).
**Put this file in the blog project** (for example as `docs/design-brief.md`) and build from it.

## 1. The goal

A visitor reads raselrana.com.bd, clicks **Blog**, and lands on `/blog`. It must feel like walking into another room of the same house: same logo, colours, fonts and light/dark mode, with no jolt. The blog is a different app (a separate zone, served at `/blog` through a rewrite), so this continuity has to be built on purpose. Sections 3 and 4 give the exact values to copy.

Today the blog's public side is a "coming soon" page and stubs. Its login, post storage (Prisma + MongoDB), image upload and a basic "new post" form exist. Everything in this brief is still to be built.

## 2. Decisions already made by the owner

| Question | Decision |
| --- | --- |
| Look | **Same family, own layout.** Same logo, colours, fonts and theme as the main site, but the blog has its own simpler menu and one clear way back to the main site. It should read as a sister publication, not a copy of the main site's menu. |
| Writing | **Markdown with a live preview** in the admin editor. |
| Reader features | Reading time, table of contents that follows scrolling, reading progress bar; topics (tags) with a page per topic, and search; related posts, previous/next links and share buttons. |
| Not wanted now | RSS feed, comments, newsletter, visual (Word-style) editor. |
| Main site home page | Shows the three newest posts, fetched from the blog through the API in section 8. **The main site side is already built and waiting for that API.** |

## 3. Design tokens, fonts and logo

**Superseded by `docs/brand-guide.md`.** That guide holds the current brand: logo files and where they go, colour tokens, fonts (Poppins + IBM Plex Mono), the header controls, components and the accessibility rules, all copied from the live main site. The values that used to be here (teal accent, Space Grotesk, the old badge logo) are out of date.

## 4. Layout rules and ready-made styles

Also in `docs/brand-guide.md` (sections 5, 8 and 9).

## 5. Structure of the blog

### Top bar (the blog's own menu)

Left: the logo (`BrandLogo`, which includes "Rasel Rana") linking to the **main site home** (`/`), then a thin divider and the word **Blog** linking to the blog home. Right: **Posts**, **Topics**, **About the author**, the theme toggle. On phones these collapse into a menu button. Use the main site's header controls so the two apps feel the same: copy `src/components/theme/ThemeToggle.jsx`, `src/components/layout/header-icons.jsx`, `src/lib/use-dialog-focus.js`, the `MobileMenu.jsx` pattern (with the blog's own links), and the "Header controls" block at the end of the main site's `globals.css`.

One clearly visible way back is required: the logo/name is it. Do not copy the main site's full menu.

### Footer (slim)

Logo, name and one line of description; a "Blog" column (Posts, Topics); a "Rasel Rana" column linking to the main site (Home, About, Experience, Achievements, Contact); copyright line. Card-coloured background (`bg-[var(--surface)]`) with a top hairline, like the main site's footer.

### Links between the two sites

- Links **inside** the blog: `next/link`, written without `/blog` (the base path is added automatically).
- Links **to the main site**: plain `<a href="/about">`, never `next/link`. They are root-relative on purpose, so they stay on raselrana.com.bd. (`next/link` would add `/blog` in front.)

### Pages

| Address (under `/blog`) | What it shows |
| --- | --- |
| `/` | Blog home: page header, search box, topic chips, the newest post as a large feature card with its cover, the rest as a card grid, pagination |
| `/[slug]` | One post (section 6) |
| `/tags` | All topics with the number of posts in each |
| `/tags/[tag]` | Posts for one topic |
| `/about` | Short "about the author" with links to the main site's About and Contact pages |
| not found | Styled like the rest, with links to the blog home and the main site |

Only **published** posts appear anywhere public. The site-wide `robots: noindex` in the root layout must be removed when the blog goes live; keep `noindex` on `/admin` and `/login`.

### Post card (used on home, topic pages, related posts)

Cover image (16:9, rounded, optional), topic chips, title, excerpt (two or three lines), then a mono line: `8 Oct 2026 · 6 min read`. The whole card is one link.

## 6. The post page (the most important page)

- **Header:** topic chips, title (`font-display`, large), a mono line with the date, "Updated …" if edited later, and the reading time.
- **Cover image** under the header, full content width, rounded.
- **Two columns on large screens:** the article (comfortable reading width, about 68–72 characters per line) and a sticky **table of contents** on the side. On small screens the table of contents folds into a "On this page" block above the article.
- **Reading progress bar:** a thin `--signal` line at the very top of the window that fills as the reader scrolls the article.
- **Table of contents:** built from the post's `##` and `###` headings; the heading currently on screen is highlighted; clicking scrolls to it. Hide it when a post has fewer than three headings.
- **Reading time:** words ÷ 200, rounded up, minimum 1.
- **Share row** at the end: Copy link (with a "Copied" confirmation), LinkedIn, Facebook. Use the public address, `https://raselrana.com.bd/blog/<slug>`.
- **Previous / next** post links (older and newer).
- **Related posts:** up to three that share a topic; if none, the newest others.
- **Author card** at the bottom: logo, name, role, one or two lines, and two links to the main site: "More about me" (`/about`) and "Get in touch" (`/contact`). This is the natural route back to the main site.
- **Search-engine details:** title and description (the excerpt), Open Graph article data with the cover image.

### Article text styles

Markdown output needs its own styles (Tailwind's reset removes the defaults). Style, with the tokens: headings (h2/h3/h4 in `font-display`, with `scroll-margin-top` so the sticky bar does not cover them), paragraphs (`leading-relaxed`, body size around 17–18px), links (`--signal`, underlined), lists, blockquotes (left border in `--signal`), horizontal rules (`--line`), images (rounded, full width, lazy), tables (hairline borders, scroll sideways on phones), inline code (mono, slight `--line` background) and code blocks (mono, `--surface` background, hairline border, rounded, scroll sideways) with syntax colours that work in both themes.

### Markdown

Render with GitHub-flavoured Markdown (tables, task lists, strikethrough), heading ids (for the table of contents), and syntax highlighting. **Do not allow raw HTML in posts.** Links to other sites open in a new tab with `rel="noopener noreferrer"`.

## 7. Admin side needed for this to work

The current editor can only save a draft with a title, slug and content. To run the blog it needs:

- **Fields:** title; slug (filled in from the title until edited by hand); excerpt (short summary, used on cards and for search engines); topics (tags); cover image (existing uploader); content (Markdown).
- **Live preview:** the Markdown on one side and the rendered result on the other, using the same renderer and styles as the public post page, so what the owner sees is what readers get. On phones, switch between "Write" and "Preview".
- **Insert image:** upload through the existing uploader and insert the Markdown image line at the cursor.
- **Publish controls:** Save draft, Publish, Unpublish. Record the first publish time (add `publishedAt DateTime?` to the `Post` model; show and sort by it, falling back to `createdAt`).
- **Manage posts:** a list of all posts (drafts and published) with Edit and Delete (with a confirmation). The edit page is a stub today.
- **Topics:** store them as typed (trimmed, no duplicates, at most 8 per post). Offer existing topics as suggestions so the same topic is not spelled two ways.
- Restyle the admin and login pages with the same tokens. They do not need the public menu and footer.
- After any change, refresh the public pages so edits show at once.

Keep the blog project's own rules (its `CLAUDE.md`): base path handling, `requireAdmin()` at the start of every changing API handler, Prisma 6, Auth.js v5.

## 8. The API the main site depends on

The main site's home page shows a "Latest writing" section with the three newest posts. It is already built. It asks the blog for them, server to server, and **hides the section if the answer is missing or wrong**, so nothing breaks before this exists.

### Request

```
GET /blog/api/posts?limit=3
```

In the blog project this is a public `GET` handler in `src/app/api/posts/route.js` (the same file as the existing admin-only `POST`). No login. `limit`: whole number from 1 to 12, default 6.

### Response — `200`, JSON

```json
{
  "posts": [
    {
      "title": "Why backup power decides telecom uptime",
      "slug": "why-backup-power-decides-telecom-uptime",
      "url": "/blog/why-backup-power-decides-telecom-uptime",
      "excerpt": "One or two sentences that summarise the post.",
      "coverUrl": "https://res.cloudinary.com/<cloud>/image/upload/v1/raselrana-blog/abc.jpg",
      "coverAlt": "Battery bank in a telecom shelter",
      "tags": ["ONT", "dBm"],
      "category": { "name": "GPON & Fiber Optics", "slug": "gpon-fiber-optics" },
      "contentType": { "label": "Troubleshooting", "slug": "troubleshooting" },
      "publishedAt": "2026-10-08T09:30:00.000Z",
      "readingMinutes": 6
    }
  ]
}
```

This is the shape the blog now provides. The main site reads it in `src/lib/services/blog-posts.js`.

| Field | Type | Rules |
| --- | --- | --- |
| `title` | text | Required |
| `slug` | text | Required. Lower-case letters, numbers and single hyphens |
| `url` | text | Root-relative address of the post, e.g. `/blog/<slug>`. The main site links to it; if it is missing or not a `/blog/…` address, the main site uses `/blog/<slug>` |
| `excerpt` | text | May be empty |
| `coverUrl` | text or `null` | A `https://res.cloudinary.com/…/image/upload/…` address, or `null`. Anything else is ignored by the main site |
| `coverAlt` | text | Description of the photo. May be empty |
| `tags` | list of text | May be empty. The main site shows the first three |
| `category` | object or `null` | `{ name, slug }`. The name is the small label on the card |
| `contentType` | object or `null` | `{ label, slug }`. The label is used when there is no category |
| `publishedAt` | ISO date-time | Shown as the day in Bangladesh time, e.g. `8 Oct 2026` |
| `readingMinutes` | whole number | Shown as "6 min read" |

### Rules

- **Published posts only**, and only those the author left ticked "Show on main site"; newest first. Never drafts.
- **Never include the post content**, ids or anything about the author account.
- The blog keeps its answer for 5 minutes and the main site keeps its own copy for 10, so a new post appears on the main home page within about 15 minutes of publishing.
- On an internal error answer with a `5xx` status; the main site then simply hides its section.
- More fields may be added later; the main site ignores the ones it does not know.

## 9. Out of scope

RSS feed, comments, newsletter sign-up, a visual editor, several authors, and scheduled publishing.

## 10. Checklist before calling it done

- [ ] Open the main site, click Blog, come back with the logo. The top bar does not jump, the colours and fonts match, and the theme stays the same in both directions.
- [ ] Choose dark mode on the main site, open the blog: it is dark. And the reverse.
- [ ] No Tailwind palette colours or `dark:` classes remain in public pages.
- [ ] Every public page is readable with JavaScript turned off (content is in the HTML).
- [ ] Phone width, light and dark: home, a post, a topic page, the menu.
- [ ] A draft is not visible on the home page, by its address, in search, on topic pages or in the API.
- [ ] A long post: table of contents highlights the right heading, the progress bar reaches the end, headings are not hidden under the sticky bar.
- [ ] A post with a table, a code block and an image looks right in both themes and does not make the page scroll sideways on a phone.
- [ ] `GET /blog/api/posts?limit=3` returns the shape in section 8, and the main site's home page shows the three posts.
- [ ] `npm run lint` and `npm run build` pass.
