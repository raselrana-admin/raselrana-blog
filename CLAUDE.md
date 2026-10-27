# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000/blog (basePath applies locally too)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (flat config, eslint-config-next/core-web-vitals)

npx prisma db push                  # sync prisma/schema.prisma to MongoDB (no migrations with the MongoDB provider)
npx prisma generate                 # regenerate the client (also runs on postinstall)
node src/scripts/create-admin.js    # upsert the admin user from ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in .env.local
npm run seed:categories             # create the launch categories; safe to run again
npm run import:posts                # import content/seed-posts/*.md (YAML header + Markdown) as DRAFT posts by slug; --dry-run to preview
```

There is no test suite or test runner configured.

On Windows, `prisma generate` (and `prisma db push`, which runs it) fails with `EPERM … query_engine-windows.dll.node` while a dev server is running, because the server holds that file open. Stop the dev server first. Never use `prisma db push --force-reset`.

The `dev` script launches Next through `node --dns-result-order=ipv4first` on purpose (slow IPv6 resolution against MongoDB Atlas) — keep that when editing scripts.

The project must not live in a path containing `&`, `%` or other shell-special characters; it breaks npm's `.bin` shims on Windows.

## Stack

Next.js 16 (App Router) + React 19, plain JavaScript (`.js`/`.jsx`, no TypeScript), Tailwind CSS v4, Prisma 6 on MongoDB, Auth.js v5 beta (`next-auth`), Cloudinary, `next-themes`, `react-markdown`. Import alias `@/*` → `src/*`.

Do not upgrade Prisma past 6.x: Prisma 7 has no MongoDB support and Prisma 8's is early access. `next-auth` stays on the v5 beta line (npm's `latest` tag is the older v4).

Next 16 conventions apply: the request interceptor is `src/proxy.js` (not `middleware.js`), and `params` / `searchParams` in pages are Promises that must be awaited.

## Build spec

Build spec for admin + categories: see docs/BLOG_ADMIN_SPEC.md. Always run the audit (section 1) first and keep the progress table (section 12) updated.

Where the spec and the code disagree, the "Audit corrections and owner decisions" table in its section 2 wins.

## Design: shared with the main site

Two specifications come from the main site project (`raselrana-web`). `docs/brand-guide.md` is the source of truth for look: logo, colours, fonts (Poppins + IBM Plex Mono), header and footer, components and the accessibility rules. `docs/design-brief.md` is the source of truth for structure and the public API (its section 8 is the `/blog/api/posts` contract). Read the brand guide before changing anything visual.

- **Tokens only.** Colours are the CSS variables in `src/app/globals.css` (`--ink`, `--slate`, `--paper`, `--surface`, `--signal`, `--pulse`, `--line`, `--danger`, `--inverse`, `--on-inverse`, `--field`), used as `text-[var(--ink)]` etc. No Tailwind palette colours (`gray-500`, `bg-white`) and no `dark:` variants. Token names and values must stay identical to the main site's. Keep the `[var(--x)]` spelling the guide uses, even though the Tailwind IDE plugin suggests `text-(--x)`. `--rr-*` (exact brand colours) and `--hc-*` are for the header controls only.
- Colour roles: blue (`--signal`) only for things you can click; labels are slate; teal (`--pulse`) only for a success message; form field borders are `--field`, `--line` is for dividers. Badges and chips: one highlighted state blue, an in-between state navy, the rest slate.
- Logo: drawn inline from `src/lib/brand.js` by `components/brand/BrandLogo.jsx` (mark + "Rasel Rana", header 32px, footer 56px with `tagline`) and `BrandMark.jsx` (the tile alone). Never redraw or recolour it. The original files are in `src/asset/brand/rasel-rana-logo/`; the browser icons are `src/app/icon.svg`, `favicon.ico`, `apple-icon.png`, `icon1.png`, `icon2.png`.
- Ready-made class strings (container, headings, card, chip, buttons, input, `cardGrid()`) live in `src/lib/ui.js`; use those instead of retyping them.
- Theme: `next-themes` with `attribute="class"`, `defaultTheme="system"`, `enableSystem` and the default storage key. Both sites share one origin, so this is what carries the visitor's theme across; do not change the settings. The toggle is the main site's (`layout/ThemeToggle.jsx`); its icon waits for the client via `useIsMounted()` (`src/lib/use-is-mounted.js`).
- Public page layout: the blog home opens with the intro and search beside `TypeIndex` (a navy `--inverse` panel listing the content types that have posts, with counts from `getContentTypeCounts()`; each type's `summary` is in `src/lib/content-types.js`). Archives (home, category, topic, type, author, search) are dated lists of `PostRow` via `PostListing`; `PostCard` is only for the home feature (`FeatureCard`) and related posts. Inside navy panels add the `on-inverse` class so the focus ring turns light (Brand Blue is under 3:1 on navy).
- Entrance motion is CSS only (`rise`, `reveal`). Never hide content until JavaScript runs; every public page must be readable from the server HTML. That is why search is a GET form and the table of contents is plain anchors that a client component only enhances.
- Header (`SiteHeader.jsx` + client `HeaderControls.jsx`) matches the main site's bar exactly: 64px, `BrandLogo` 32px, 32px `hc-btn-sm` buttons, links from `md` up. The phone menu (`MobileMenu.jsx`) is the main site's full-screen panel, rendered into `<body>` with a portal and driven by `useDialogFocus()` (`src/lib/use-dialog-focus.js`). Until JavaScript runs the menu button is a plain link to `#site-footer`, which lists the same pages; keep that fallback.
- `rise`/`reveal` elements are transformed, and the header has a backdrop blur, so nothing `position: fixed` may live inside them: render overlays into `document.body` with `createPortal` (`ReadingProgress` is rendered outside; the delete confirmation uses a native `<dialog>`).
- Skip link and focus: the header starts with "Skip to content" → `<main id="main" tabIndex={-1}>`; `html { scroll-padding-top: 5rem }` keeps anchors and focus clear of the sticky bar, so headings need no `scroll-margin`.

## Architecture

### Multi-Zone deployment

This app is one zone of `raselrana.com.bd`. It is deployed as its own Vercel project (internal domain `blog-zone.raselrana.com.bd`, never linked publicly) and the main site rewrites `/blog` and `/blog/:path+` to it. Hence `basePath: "/blog"` in `next.config.mjs`.

The basePath is the main source of subtle bugs here:

- `next/link`, `next/navigation` `redirect()` and `router.push()` add it automatically — write paths without `/blog`.
- Client-side `fetch` calls, native `<form action>` and `signOut({ callbackUrl })` do not get it; they prefix `process.env.NEXT_PUBLIC_BASE_PATH` (`PostEditor`, `SearchForm`, the posts-list filter form, `SignOutButton`). Server actions need nothing.
- Auth.js needs it stated explicitly: the server config uses `basePath: "/api/auth"` (`src/lib/auth.js`), while the client `SessionProvider` uses `${NEXT_PUBLIC_BASE_PATH}/api/auth` (`src/providers/auth-provider.js`). The `pages` paths in the Auth.js config are used verbatim, so they include the prefix. `AUTH_URL` must match the deployed origin.
- In `src/proxy.js` the request passed by the `auth()` wrapper has lost the basePath (`req.nextUrl.clone()` does not restore it), so the login redirect is built from `NEXT_PUBLIC_BASE_PATH`.
- Metadata URLs (canonical, Open Graph) are written in full via `postUrl()` / `BLOG_URL` in `src/lib/posts.js`.

Links to the main site go through `components/layout/MainSiteLink.jsx`: a plain root-relative `<a>` (`/about`, `/contact`), never `next/link`. Locally those addresses 404 because the main site is a different app. The same goes for the tools app at `/tools` (`raselrana-tools`, docs/tools-handover.md): "Tools" is a `zone` entry in the header links, drawn by `components/layout/ToolsMenu.jsx` (desktop disclosure menu: All tools, then each category with its available tools; a plain link before hydration, without JavaScript, or when the API has nothing) and as a section of plain links in `MobileMenu.jsx`; the footer lists it too. The list comes from `toolsMenu()` in `src/lib/tools.js` (`TOOLS_API_URL`, else `${MAIN_SITE_URL}/tools/api/tools`; cached an hour; never throws; only `available: true` tools). In posts, link tools by their full URL; `Markdown.jsx` treats `raselrana.com.bd` addresses as plain internal links.

### Route layout

- `src/app/layout.js` — fonts, theme provider, default metadata. No menu.
- `src/app/(site)/` — public pages; its layout adds `SiteHeader`, the category row (`components/layout/CategoryBar.jsx`) and `SiteFooter`. `src/app/not-found.jsx` sits outside the group and includes header and footer itself.
- Public addresses: article `/<slug>` (`(site)/[slug]`, flat, never with the category), `/category/[slug]` (`?type=` filters by content type), `/type/[type]`, `/tag/[slug]`, `/tags` (all topics), `/author/[username]`, `/preview/[id]`. The article route is a catch-all at the top level: static folders beside it win, and `RESERVED_SLUGS` in `src/services/posts/slugs.js` must list every such folder, so add a name there when adding a top-level route.
- Old addresses redirect permanently in `next.config.mjs` (`/posts/<slug>`, `/tags/<slug>`, old admin paths). A renamed post's old slug redirects from the article page itself (`getCurrentSlugFor()`).
- `src/app/sitemap.js` → `/blog/sitemap.xml`: listed articles, plus category, type and topic pages that have posts (topics need two). The main site's robots.txt or sitemap index has to point to it; nothing in this app does.
- `src/app/admin/layout.js` — adds the Auth.js `SessionProvider` (kept off public pages so they make no session request) and `robots: noindex` for everything under `/admin`.
- `src/app/admin/login/` — the sign-in page. It must stay outside the `(panel)` group, or the access check would redirect it to itself.
- `src/app/admin/(panel)/` — the signed-in area: its layout checks the user, renders the sidebar (`components/admin/AdminNav.jsx`) and the sticky top bar (`components/admin/AdminTopBar.jsx`: page title, an "Under development" pill while the site is off, View site ↗, theme, sign-out), and is `force-dynamic`. Both take their links from `src/lib/admin-nav.js`. The layout wraps everything in `ToastProvider` (`components/admin/Toast.jsx`): after a `runAdminAction()` redirect, `NoticeToast` turns `?ok=` into a pop-up and removes it from the address; `Notice` renders a success only inside `<noscript>` (the fallback) and keeps errors inline as `role="alert"`. Client components call `useToast()` directly (the editor on a manual save, "Check again"). Overview at `/admin`, posts at `/admin/posts`, editor at `/admin/posts/new` and `/admin/posts/[id]/edit`.
- Row actions on the posts list are server actions in `admin/(panel)/posts/actions.js`. A server action can be called without loading the page, so each one calls `requireUser()` / `requireRole()` and validates its input with zod.
- **System** (`admin/(panel)/system/`, any admin): one card per check (`ms` shown on its own line), "Check again" through `recheckSystemAction()` with `useActionState` (refused within 30 seconds), runs live checks from `src/lib/system-status.js`: database ping, Cloudinary ping, the Resend key (a `restricted_api_key` answer means a valid sending-only key; called with `fetch`, because the `resend` package logs every refusal as an error), the main site's session endpoint (401 without a cookie = reachable), the tools API (informational: only "Check" when down), the Auth.js settings and the site switch. Checks run in parallel with a 5 s timeout, never throw and never return secrets (only set / missing). "Send test email" goes through `notifyOwner()`. The Overview shows the same result in `components/admin/SystemSummary.jsx` inside `<Suspense>`, so it streams in after the rest of the page.
- Categories, tags and profile (`admin/(panel)/categories|tags|profile`) are plain server-rendered forms. Their actions go through `runAdminAction()` in `src/lib/admin-action.js`, which checks the user (ADMIN unless `admin: false`), turns zod / `ActionError` / duplicate-key problems into a message, and redirects back with `?ok=` or `?error=` for `components/admin/Notice.jsx`. Throw `ActionError` for anything the person can fix. The logic and zod schemas live in `src/services/taxonomy/` and `src/services/users/`.

### Data layer

Prisma only: `src/lib/prisma.js` exports a singleton client, schema in `prisma/schema.prisma` (`Post` → `posts` collection, `User`, `Category`, `Tag`, `LoginAttempt`). Prisma reads `DATABASE_URL`; the Prisma CLI gets it from `.env` via `prisma.config.ts` (`dotenv/config`), not from `.env.local`.

Every post has a `status` (`DRAFT` / `SCHEDULED` / `PUBLISHED` / `ARCHIVED`), one content type (enum; labels and address slugs in `src/lib/content-types.js`), at most one category, and topics (`Tag` records, many-to-many). The featured image is one JSON field `{ url, publicId, width, height, alt }`.

All post access goes through `src/services/posts/`:

- `queries.js` — reads. **`livePostWhere()`** (published, or scheduled with its time passed) decides what a reader may open; **`listedPostWhere(...extra)`** adds "not `noindex`" and is what every listing, search, related-posts query and the main-site API use. Never write a status filter by hand in a public query. Public functions return card objects without content or ids.
- `actions.js` — create / update / delete. They compute `readingTime`, keep `previousSlugs`, find-or-create topics, and call `revalidatePosts()`.
- `validation.js` — `parsePostInput()` (zod). Drafts and archived posts may be incomplete; publishing or scheduling requires content, excerpt, category, and a featured image with alt text, and scheduling a future date.
- `slugs.js` — a slug is taken if any post uses it now **or used it before** (`previousSlugs`), and `RESERVED_SLUGS` blocks names of top-level routes, because articles will live at `/blog/<slug>`.
- `revalidate.js` — `revalidatePosts(before, after)` refreshes the pages a post is on. Any new write path must call it, or statically rendered pages such as `/tags` go stale.

`publishedAt` is the first publish time, or for a `SCHEDULED` post the time it goes live (`nextPublishedAt()` in `actions.js` holds the rules: unpublishing keeps it, a future date is dropped when a post goes back to draft, publishing a never-public post stamps now). Scheduling needs no cron: `livePostWhere()` compares with the clock. `updatedAt` changes on every save and is never shown to readers; `contentUpdatedAt` ("Last updated") is set only by a deliberate significant update. `showOnMainSite` only affects the main-site API.

A `Tag` that was never attached to a post has no `postIds` field in MongoDB, and Prisma's `isEmpty` filter does not match a missing field; count unused topics in JavaScript (`getUnusedTagIds()` in `src/services/taxonomy/tags.js`).

Old documents may still carry the pre-spec fields (`published`, `coverUrl`, `coverPublicId`, a `tags` text list). Prisma ignores them; do not rely on them.

Addresses are built by `postPath()`, `tagPath()`, `categoryPath()`, `typePath()` and `authorPath()` in `src/lib/posts.js`; never write them by hand. `revalidatePosts()` uses the same functions.

Pages that read `searchParams` or a dynamic segment are rendered per request, so a scheduled post appears on them the moment its time passes. `/tags` and the sitemap are cached with `revalidate = 300`.

### Editor

`components/blog/PostEditor.jsx` (client) holds all fields in state and talks to the REST handlers. Things that are easy to break:

- **Autosave** runs only while the post is a draft, 3 seconds after the last change, and never changes the status. The first save of a new post creates it and swaps the address with `history.replaceState`, on purpose without a navigation, so typing is not interrupted. Autosaves do not overwrite field state with the server's answer; manual saves do.
- Going public (Publish / Schedule / Update) always goes through `goPublic()`, which runs `components/admin/editor/checklist.js` plus the server slug check and shows the checklist dialog; other buttons call `save()` directly.
- The publish date is typed and shown in Asia/Dhaka time and stored in UTC.
- `components/admin/editor/MarkdownEditor.jsx` wraps CodeMirror 6. Its colours come from the CSS tokens, so it follows the theme by itself. The CodeMirror extensions are created once at module level; Ctrl+S reaches React through a DOM event, because the lint rules forbid reading refs while building them.
- The in-editor preview renders `Markdown.jsx` directly. `/preview/[id]` renders the saved post with `components/blog/PostArticle.jsx`, the same component the public post page uses.

### Markdown

`src/components/mdx/Markdown.jsx` is the single renderer (GFM, heading ids, syntax highlighting, raw HTML dropped, external links in a new tab, Cloudinary-resized images). It has no `"use client"` so the post page renders it on the server and `PostEditor` reuses it for the live preview; keep it free of server-only imports. Its output must sit inside an element with class `article` (styles in `globals.css`).

Four conventions go beyond plain Markdown, all decided by looking at a paragraph's contents:

- two or more images with nothing else in the paragraph (image lines directly under each other) render as a photo grid (`.gallery`), each linking to the full-size image;
- a blockquote starting with `[!NOTE]`, `[!TIP]` or `[!WARNING]` renders as a callout box (`src/lib/rehype-callouts.js`);
- one image with a title, `![alt](url "caption")`, renders as a `<figure>` with that caption;
- a bare YouTube address alone in a paragraph renders as `YouTubeEmbed` (thumbnail and play button; the player loads from `youtube-nocookie.com` only on click, and without JavaScript it is a plain link). A YouTube link inside a sentence stays a link. Parsing is in `src/lib/youtube.js`.

It also adds two reading tools: `h2`/`h3` end with a `#` link to themselves (`.heading-anchor`, shown on hover or focus, named "Link to section: …"), and every `<pre>` renders through the client component `components/mdx/CodeBlock.jsx`, which adds a Copy button after hydration and makes the block focusable so long lines can be scrolled by keyboard.

`src/lib/toc.js` builds the table of contents with the same slugger order as `rehype-slug`, so ids match the rendered headings.

### Images

Uploads go **straight from the browser to Cloudinary**; no file passes through this app. `signImageUpload()` (a server action in `src/services/uploads/actions.js`, guarded by `requireUser()`) signs the folder, the allowed formats and a timestamp; `src/lib/upload-client.js` then posts the file with those fields. Anything Cloudinary should enforce must be in the signed parameters. Images land in `<UPLOAD_FOLDER>/posts/<post-id>/` (`unassigned` for a post not saved yet); profile pictures in `<UPLOAD_FOLDER>/avatars/`. The rules shared by both sides (formats, 5 MB, no SVG) are in `src/lib/upload-rules.js`; the size limit is checked in the browser only.

`next.config.mjs` sets a global `next/image` loader, `src/lib/cloudinary-loader.js`, which inserts `f_auto,q_auto,c_limit,w_<width>` into Cloudinary addresses. That file is imported by client code too, so it must not import the Cloudinary SDK (`src/lib/cloudinary.js` is server only).

### Auth and permissions

Two Credentials providers, JWT sessions. Emails are looked up lower-cased. There is no sign-up flow.

- **Password** (`credentials`): email + bcrypt hash on `User.passwordHash`, for blog-only admins and authors. The first admin is created by `src/scripts/create-admin.js`. The login page is `/admin/login`.
- **Main site** (`main-site`, docs/blog-admin-handover.md): the website owner, signed in to the dashboard at `raselrana.com.bd/admin`, opens `/blog/admin/sso` (Apps → Blog admin) and is signed in as `SUPER_ADMIN` with no second password. The browser sends the main site's `admin_session` cookie with every `/blog` request; `getMainSiteOwner()` in `src/lib/main-site.js` passes it to `${MAIN_SITE_URL}/api/admin/session`, which answers 200 `{ email, name }` or 401. The blog never verifies, logs, stores or returns that value, and must never name a cookie of its own `admin_session`. `upsertSuperAdmin()` (`src/services/users/super-admin.js`) upgrades the account with that email (or creates one with an unknown password) and turns any other super admin back into `ADMIN`. The password provider refuses a `SUPER_ADMIN` (code `use_main_site`), `create-admin.js` refuses that email, and its profile has no password section.
- `/admin/sso` sits outside `(panel)`, and the proxy lets it through like the login page. `next.config.mjs` allows Server Actions from the main site's origin, because the blog is reached through its rewrite.

Permission checks live in `src/lib/authz.js` and read the user **from the database**, not from the session cookie, so a role change or `isActive: false` takes effect at once: `getCurrentUser()`, `requireUser()`, `requireRole("ADMIN")`, `canEditPost(user, post)`, `canSetStatus(user, status)`. The role on the session is only a hint for the UI.

`/admin/*` is guarded twice: `src/proxy.js` (matcher `/admin/:path*`, letting `/admin/login` through) and `src/app/admin/(panel)/layout.js` (`getCurrentUser()` + redirect). The proxy must not redirect a signed-in visitor away from the login page: a disabled account still has a cookie and would loop. API route handlers and server actions are outside that matcher, so each one that changes data must start with `requireApiUser()` or `requireAdmin()` from `src/lib/require-admin.js` (wrappers that turn an `AuthzError` into a 401/403 response). Roles rank `AUTHOR` < `ADMIN` < `SUPER_ADMIN`: `requireRole("ADMIN")` also passes a super admin, and `isAdmin(user)` is the check for admin-or-higher. Only admins may publish or delete. There is exactly one `SUPER_ADMIN`, given only by the main-site sign-in, and `getCurrentUser()` asks the main site on every request whether that person is still signed in there, so signing out of the dashboard ends blog access on the next page. Only a super admin may manage users when that screen is built (`requireRole("SUPER_ADMIN")`). Nothing in the UI creates an `AUTHOR` yet.

Login rate limiting (`src/lib/login-rate-limit.js`): every attempt is stored as a `LoginAttempt` keyed by email + IP; after 5 failures in 15 minutes the next attempts are refused with the code `rate_limited`, whether or not the email exists. A successful sign-in resets the count; attempts older than 24 hours are deleted on each login. To unblock yourself locally, delete the `LoginAttempt` documents.

### API

- The article page embeds `TechArticle` JSON-LD; `dateModified` is `contentUpdatedAt ?? publishedAt`, never `updatedAt`.
- `GET /api/og` and `GET /api/og/[slug]` — public link-preview pictures (1200×630, `src/lib/share-image.jsx`, Poppins TTFs in `src/asset/fonts/`). The root layout uses `/blog/api/og` for every page; a post uses its `ogImageUrl`, else its cover, else `/api/og/<slug>`. Only live posts; while the site is not live, every post gets the blog picture. Satori has no CSS variables, so its colours are written out there.
- `GET /api/posts?limit=` — **public, and a contract with the main site** (its home page shows the newest posts). Only listed posts with `showOnMainSite` on. The shape, caching header and rules are in `docs/main-site-api.md`; fields may be added but not removed or renamed, and never content or ids.
- `GET /api/posts/slug-check?slug=&except=` — signed-in users; used by the pre-publish checklist.
- `POST /api/posts`, `PATCH /api/posts/[id]` — any signed-in user who may edit the post; setting a status other than `DRAFT` needs `ADMIN`. The editor always sends the full post, including `status`.
- `DELETE /api/posts/[id]` — `ADMIN`, and only for a draft that was never published (409 otherwise; archive instead).

### Vercel analytics

`src/app/layout.js` renders `<Analytics />` (visitors) and `<SpeedInsights />` (page speed). Their scripts load from `/_vercel/...` at the root of the domain, so on `raselrana.com.bd` the data is recorded by the **main site's** Vercel project, with `/blog/...` paths; only visits to the blog's own `vercel.app` address land in the blog project. Each must be enabled in the Vercel dashboard of the project that should record it.

## Not built / leftovers

- `docs/BLOG_ADMIN_SPEC.md` section 12 lists what is built.
- Out of scope by decision: RSS, comments, newsletter, visual editor.
- Deleting a post does not delete its images from Cloudinary.

## Environment variables

`.env` (Prisma CLI): `DATABASE_URL`

`.env.local` (sections and comments as in `.env.example`, which is the only one committed): `DATABASE_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_FOLDER` (optional, defaults to `raselrana-blog`), `NEXT_PUBLIC_BASE_PATH` (`/blog`), `MAIN_SITE_URL` (`http://localhost:3000` locally, `https://raselrana.com.bd` in production; unset = nobody can sign in through the main site), optional `TOOLS_API_URL` (override for the Tools menu's list), `AUTH_SECRET`, `AUTH_URL` (production `https://raselrana.com.bd/blog/api/auth`), `BLOG_INDEXABLE`, `RESEND_API_KEY` / `NOTIFY_EMAIL_FROM` / `NOTIFY_EMAIL_TO` (switch notifications; empty = no email), plus `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` / `ADMIN_USERNAME` for the admin script only. `.env.example` lists them all.

`BLOG_INDEXABLE=true` lets search engines index the public pages; anything else keeps the whole site `noindex`. It is off until launch.

**Site live switch** (admin → Site, super admin only; `src/lib/site-status.js`, replacing the old `BLOG_LAUNCHED` variable): while it is off, the production deployment (`VERCEL_ENV=production`) answers every public address for visitors with the under-development page (a rewrite in `src/proxy.js` with **status 503** and `Retry-After: 600`, so search engines keep the pages; page in `src/app/coming-soon/`). Signed-in blog users get the real blog instead: the proxy reads the session with `getToken()` (no database, and unlike the `auth()` wrapper it sets no cookies on visitors) and sets `blog_preview` (`src/lib/site-preview.js`; `Path=/blog`, not httpOnly, value `manage` or `view`), which `UnderDevelopmentBanner` reads in the browser to show a bar above the menu; it is deleted once the site is live. The page says "Coming soon" until the site has ever been live, then "Back soon", and shows the super admin's message (`SiteMessage`, id `under-development`, at most 400 characters, "" = standard text from `STANDARD_TEXT`). Opened directly while live, it redirects to the blog, except when the proxy sent the visitor (header `x-blog-maintenance`), which avoids a loop while server copies disagree. Also while off, `GET /api/posts` returns no posts, the sitemap is empty and share images show the blog picture. `/admin` (with the sign-in page) and `/preview/...` stay open. Each flip is a `SiteStatusChange` row (the newest is the current state; none = off) and sends an email through Resend (`src/lib/notify.js`), which never blocks the switch. `isSiteLive()` caches the answer per server instance for 10 minutes while live and 1 minute while off (`LIVE_CHECK_MINUTES`, `OFF_CHECK_MINUTES`; wording from `delayText()`), so switching off reaches every visitor within 10 minutes and switching on within a minute; a database error counts as off. Read it only through `isSiteLive()`. Local runs and preview deployments always show the blog; to see the page locally, start the server with `VERCEL_ENV=production`.

These belong to the blog's own Vercel project, not the main site's.

## Git workflow

Work happens on `feature/*` branches merged into `develop` through pull requests; `main` is the release branch.
