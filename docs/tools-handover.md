# Blog (raselrana-blog) · Work needed for the tools zone

> For whoever works on **raselrana-blog** (a developer or a Claude Code session in that
> repo). Read the whole file, then do the tasks in order. Don't change the tools app from
> there; its side is done (repo `raselrana-tools`).
>
> Copies of this file: `raselrana-tools/docs/BLOG-HANDOVER.md` (source) and
> `raselrana-blog/docs/tools-handover.md`. Update the source and re-copy.

## Context

`raselrana-tools` is a separate Next.js app (basePath `/tools`) served at
**raselrana.com.bd/tools** through the main site's rewrite, the same way the blog is
served at `/blog`. It has free calculators and converters (the first one live:
**Optical Fiber Link Budget Calculator**, `/tools/fiber-link-budget`), and the list grows
over time.

The owner's decision on navigation:

- **Blog: "Tools" in the navbar** (this file).
- Main site: "Tools" in the footer only (the main site's own task).

The tools app publishes its list as public JSON, so the blog never hard-codes tool names:

```
GET https://raselrana.com.bd/tools/api/tools
```

```json
{
  "version": 1,
  "baseUrl": "https://raselrana.com.bd/tools",
  "categories": [
    {
      "slug": "telecom",
      "title": "Telecom & Networking",
      "description": "…",
      "icon": "RadioTower",
      "url": "https://raselrana.com.bd/tools/category/telecom",
      "toolCount": 3,
      "liveCount": 1
    }
  ],
  "tools": [
    {
      "slug": "fiber-link-budget",
      "title": "Optical Fiber Link Budget Calculator",
      "shortTitle": "Fiber Link Budget",
      "description": "…",
      "category": "telecom",
      "categoryTitle": "Telecom & Networking",
      "icon": "Cable",
      "status": "live",
      "featured": false,
      "badge": null,
      "url": "https://raselrana.com.bd/tools/fiber-link-budget",
      "available": true
    }
  ]
}
```

- Public, no auth, `Access-Control-Allow-Origin: *`, cached (`s-maxage=3600`).
- `status`: `live`, `maintenance`, `development`, `coming_soon`. Hidden tools aren't
  listed. Treat unknown values like `coming_soon`.
- **Link only tools with `available: true`** (their page exists). Show the others as
  "Coming soon" without a link, or leave them out.
- `icon` is a lucide icon name (PascalCase). `badge` is `"New"`, `"Beta"`, `"Updated"` or
  `null`.
- `version` changes only on breaking changes; new fields may appear.

## Important: links to /tools are links into another app

The blog's `next/link` puts `/blog` in front of every path and tries an in-app
navigation. A link to the tools must be a **plain `<a href="/tools…">`**, the same as the
blog's links to the main site. Use the existing `src/components/layout/MainSiteLink.jsx`
(root-relative, plain `<a>`). Never `<Link href="/tools">`.

## Tasks

### 1. "Tools" link in the navbar (desktop and mobile). Required

The header links are built in `src/components/layout/SiteHeader.jsx` (`links`) and drawn
by `HeaderControls.jsx` (desktop) and `MobileMenu.jsx` (mobile), both with `next/link`.

1. In `SiteHeader.jsx`, add an entry marked as another app, after "Topics":

   ```js
   const links = [
     { href: "/", label: "Posts" },
     { href: "/tags", label: "Topics" },
     { href: "/tools", label: "Tools", zone: true }, // another app: plain <a>, no /blog prefix
     { href: "/about", label: "About the author" },
   ];
   ```

2. In `HeaderControls.jsx` and `MobileMenu.jsx`, where each link is rendered, use
   `MainSiteLink` when `link.zone` is true and `Link` otherwise:

   ```jsx
   const NavLink = link.zone ? MainSiteLink : Link;
   // …
   <NavLink href={link.href} className={…}>{link.label}</NavLink>
   ```

   A zone link is never "active" (the blog's `pathname` can't be `/tools`); keep
   `aria-current` only for blog links. Keep the existing styles so Tools looks like the
   other items.

**Done when:** "Tools" shows in the desktop header and the mobile menu, its `href` in the
HTML is exactly `/tools` (not `/blog/tools`), and clicking it loads
`raselrana.com.bd/tools` with a full page load.

### 2. Tools dropdown fed by the API. Recommended

Turn "Tools" into a small menu: "All tools", then each category with its available tools.
Keep a plain "Tools" link when the API can't be reached.

1. `src/lib/tools.js` (server only):

   ```js
   // The tools app's public list (raselrana-tools docs/API.md). Never throws:
   // returns empty lists when the API is down, so the header still renders.
   const TIMEOUT_MS = 5000;

   function toolsApiUrl() {
     if (process.env.TOOLS_API_URL) return process.env.TOOLS_API_URL;
     const base = process.env.MAIN_SITE_URL || "https://raselrana.com.bd";
     return `${base.replace(/\/$/, "")}/tools/api/tools`;
   }

   export async function getTools() {
     try {
       const res = await fetch(toolsApiUrl(), {
         next: { revalidate: 3600 },
         signal: AbortSignal.timeout(TIMEOUT_MS),
       });
       if (!res.ok) throw new Error(`Tools API ${res.status}`);
       const data = await res.json();
       if (data?.version !== 1 || !Array.isArray(data.tools))
         throw new Error("Unexpected shape");
       return data;
     } catch {
       return { version: 1, categories: [], tools: [] };
     }
   }
   ```

2. `SiteHeader.jsx` (server component): `const tools = await getTools();` and pass a small,
   serialisable list to `HeaderControls` and `MobileMenu`, e.g. per category
   `{ title, url, items: [{ title: shortTitle ?? title, url }] }`, with only
   `available: true` tools and empty categories left out.

3. Desktop (`HeaderControls.jsx`): "Tools" becomes a disclosure button
   (`aria-expanded`, `aria-controls`) opening a panel; close it with Escape and on outside
   click, and return focus to the button. Every entry is a plain `<a>` with the absolute
   `url` from the API. Mobile (`MobileMenu.jsx`): list the same links under a "Tools"
   heading. If there are no categories (API down), render the plain "Tools" link from
   task 1 instead.

4. Follow `docs/brand-guide.md` for the look. No new UI libraries.

**Done when:** the dropdown lists "Optical Fiber Link Budget Calculator" under "Telecom &
Networking"; it works by keyboard alone; with `TOOLS_API_URL` pointing at a dead URL the
header still renders with a plain "Tools" link.

### 3. Environment. Only for task 2

Nothing new is required: by default the list is read from
`${MAIN_SITE_URL}/tools/api/tools`, and `MAIN_SITE_URL` is already set.

| Variable        | When              | Value                                                |
| --------------- | ----------------- | ---------------------------------------------------- |
| `TOOLS_API_URL` | optional override | e.g. `http://localhost:3001/tools/api/tools` locally |

Local: run the tools app with `pnpm dev -p 3001` (repo `raselrana-tools`) and either set
`TOOLS_API_URL` as above, or run the main site with `TOOLS_ORIGIN=http://localhost:3001`.

### 4. Linking to a tool from a post. Note

In post content, link tools by their full URL, e.g.
`https://raselrana.com.bd/tools/fiber-link-budget`, so the link never goes through
`next/link` or picks up `/blog`.

### 5. Health check. Optional

`src/lib/system-status.js` already checks the main site. You can add a "Tools API" row
that fetches the URL from task 2 and reports OK when it returns `version: 1`. Informational
only: the blog must keep working when the tools app is down.

## Acceptance checklist

```powershell
curl.exe -s https://raselrana.com.bd/blog | Select-String 'href="/tools"'     # task 1
curl.exe -s https://raselrana.com.bd/tools/api/tools                         # JSON the dropdown uses
```

In the browser (desktop and phone width):

1. Blog header shows "Tools"; clicking it opens `raselrana.com.bd/tools` (full page load).
2. Dropdown (task 2): categories and available tools; Tab / Enter / Escape work; links are
   absolute tool URLs.
3. With the tools API unreachable, the header still renders with a plain "Tools" link.
4. Lint, tests and `next build` pass.
