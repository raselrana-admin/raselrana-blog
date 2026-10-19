# Rasel Rana brand — design guide for the blog

**For:** Claude Code (or any developer) working in the blog project `raselrana-blog`, and for Rasel.
**From:** the main site project `raselrana-web` (raselrana.com.bd), where this design is already live.
**Save this file in the blog project as `docs/brand-guide.md`.**

The main site and the blog are two apps under one address: the main site at `/` and the blog at `/blog`. A visitor must not feel any jump between them. This guide gives the blog the exact brand the main site uses: logo, colours, fonts, header, footer and components, plus the accessibility rules both follow. Every value here is copied from the main site's source files, so **copy it exactly, don't retype it from memory.**

---

## 1. How to use this file

1. Work on a new branch, e.g. `feature/brand-redesign`.
2. This file **replaces sections 3 and 4** of `docs/design-brief.md` (design tokens, fonts, logo, layout styles). Those sections describe the old design (teal accent, Space Grotesk / IBM Plex Sans, the old navy "R" badge). Replace them with one line: "Superseded by `docs/brand-guide.md`." The rest of `design-brief.md` still applies, especially **section 8, the `/blog/api/posts` contract**, which the main site's home page depends on. Do not change that API.
3. In the blog's `CLAUDE.md`, change the design rule to point to `docs/brand-guide.md` as the source of truth for look, and keep the "tokens only" rule.
4. Follow sections 2–11, then work through the checklist in section 12.

---

## 2. Logo files

### 2.1 Where the files are

Rasel's logo files are on Rasel's computer, in:

```
E:\my_website-blog\Website Info\rasel-rana-logo\
├── favicon\   apple-touch-icon.png, favicon-16.png, favicon-32.png, favicon-48.png,
│              favicon.ico, icon-192.png, icon-512.png, icon.svg
├── png\       rasel-rana-logo.png, rasel-rana-logo-on-dark.png,
│              rasel-rana-logo-name-only.png, rasel-rana-logo-name-only-on-dark.png,
│              rasel-rana-logo-mono-navy.png, rasel-rana-logo-mono-white.png,
│              rasel-rana-mark-512.png, rasel-rana-mark-1024.png,
│              rasel-rana-mark-mono-navy-1024.png, rasel-rana-mark-mono-white-1024.png
└── svg\       rasel-rana-logo.svg, rasel-rana-logo-on-dark.svg,
               rasel-rana-logo-name-only.svg, rasel-rana-logo-name-only-on-dark.svg,
               rasel-rana-logo-mono-navy.svg, rasel-rana-logo-mono-white.svg,
               rasel-rana-mark.svg, rasel-rana-mark-small.svg, rasel-rana-icon-square.svg,
               rasel-rana-mark-mono-navy.svg, rasel-rana-mark-mono-white.svg
```

(The `rasel-rana-logo-v2` folder next to it holds identical copies; ignore it.)

### 2.2 Where they go in the blog

| Copy from (Rasel's PC) | To (blog project) | Purpose |
|---|---|---|
| the whole `rasel-rana-logo\` folder | `src/asset/brand/rasel-rana-logo/` (keep the `svg/`, `png/`, `favicon/` subfolders and file names) | The master copy, for reference and future use |
| `favicon\icon.svg` | `src/app/icon.svg` (replace the old one) | Browser tab icon (the small-size mark: thicker lines, one arc) |
| `favicon\favicon.ico` | `src/app/favicon.ico` | Older browsers |
| `favicon\apple-touch-icon.png` | `src/app/apple-icon.png` | iPhone home screen |
| `favicon\icon-192.png` | `src/app/icon1.png` | Phone home screen / manifest |
| `favicon\icon-512.png` | `src/app/icon2.png` | Phone home screen / manifest |

The `src/app/` file names follow Next.js's icon conventions, so Next serves them and adds the `<link>` tags by itself, under `/blog/…` because of `basePath`. There's no `public/` copy and no hand-written `<link>`.

### 2.3 The logo in code (not as image files)

On pages the logo is drawn as inline SVG from shared data, so it is crisp, needs no image request, and the "Rasel Rana" letters can follow the theme. Create these three files. They are identical to the main site's (`E:\my_website-blog\raselrana-web\src\…`); the full text of each is in **Appendix A**:

| Blog file | Main site source | What it is |
|---|---|---|
| `src/lib/brand.js` | `src/lib/brand.js` | Shapes and colours of the mark, plus the outlined "Rasel Rana" wordmark and "ENGINEER · DEVELOPER" tagline (plain data) |
| `src/components/brand/BrandMark.jsx` | `src/components/ui/BrandMark.jsx` | The blue tile alone. Replaces the blog's old `BrandMark.jsx` (same file name and props, so existing imports keep working) |
| `src/components/brand/BrandLogo.jsx` | `src/components/ui/BrandLogo.jsx` | Tile + "Rasel Rana" (and optionally the tagline). The name is filled with `var(--ink)` and the tagline with `var(--slate)`, so one SVG works in both themes |

### 2.4 Which version goes where

| Place | Component / file | Size |
|---|---|---|
| Header bar (and the phone menu's top row) | `<BrandLogo height={32} />` | 32px tall: the "R" tile matches the 32px header buttons |
| Footer | `<BrandLogo height={56} tagline />` | 56px, the smallest size where "ENGINEER · DEVELOPER" stays readable |
| Author card, empty post picture, admin login | `<BrandMark size={…} />` | Any size; below 24px it switches to the small-size mark automatically |
| Browser tab, home screen | the `src/app/` icon files (2.2) | — |
| Social profile pictures, print, email signature | `svg/rasel-rana-icon-square.svg`, the mono navy/white versions, `png/rasel-rana-logo.png` | Not used on the site |

**Rules:**
- Never redraw, stretch or recolour the mark, and never add shadows or effects.
- The tile's blue `#1D6FE0` and the arc colours belong to the logo only; they are not UI colours.
- Keep clear space around the logo at least as wide as the "R" stem.

---

## 3. Colours

### 3.1 Brand palette

| Name | Hex | Used for |
|---|---|---|
| Navy | `#0F1F3A` | Text, dark backgrounds |
| White | `#FFFFFF` | Light page background |
| Slate | `#475569` | Secondary text, labels |
| Light Gray | `#F1F5F9` | Cards, panels, footer |
| Brand Blue | `#1F6FE0` | Accent: buttons, links, highlights (see the shades below) |
| Teal | `#5EEAD4` | Second accent, mostly in dark mode; logo arc |
| Yellow | `#FFD54F` | Shapes only (logo arc, the sun icon); never text |

### 3.2 Site tokens: copy exactly into `src/app/globals.css`

Colours are CSS variables, used as Tailwind arbitrary values (`text-[var(--ink)]`, `bg-[var(--surface)]`, `border-[var(--line)]`). **No Tailwind palette colours (`gray-500`, `bg-white`) and no `dark:` variants**: the variables switch themes by themselves. Replace the blog's old `:root` / `.dark` values with these. The names are the same; three are new (`--inverse`, `--on-inverse`, `--field`):

```css
/* Colours follow the Rasel Rana brand guideline (Navy, White, Slate, Light
   Gray, Brand Blue, Teal, Yellow). Accents are shaded where the exact brand
   value would fall below WCAG AA contrast for small text; the logo itself
   keeps its exact colours (src/lib/brand.js). */
:root {
  --ink: #0f1f3a; /* Navy: primary text, solid buttons */
  --slate: #475569; /* Slate: secondary text, labels */
  --paper: #ffffff; /* White: page background */
  --surface: #f1f5f9; /* Light Gray: cards, panels, footer */
  --signal: #1b63d3; /* Brand Blue, one step deeper so small text passes AA */
  --pulse: #0f766e; /* Teal, deep shade (brand Teal is too light on white) */
  --line: #e2e8f0; /* hairline borders */
  --danger: #b42318; /* error text */
  --inverse: #0f1f3a; /* Navy panel that stays dark in both themes */
  --on-inverse: #ffffff; /* text on --inverse */
  --field: #7c8ba1; /* form field borders: 3.2:1 on cards, 3.5:1 on white (WCAG 1.4.11) */
}

.dark {
  --ink: #f1f5f9; /* Light Gray */
  --slate: #94a3b8;
  --paper: #0a1628; /* deeper than Navy, so Navy cards lift off it */
  --surface: #0f1f3a; /* Navy */
  --signal: #60a5fa; /* Brand Blue, lightened for text on navy */
  --pulse: #5eead4; /* Teal */
  --line: #1e3354;
  --danger: #f97066;
  --inverse: #193a6e; /* a brighter navy, so the panel stands out on the page */
  --on-inverse: #f1f5f9;
  --field: #5b6f8f; /* 3.2:1 on navy cards, 3.6:1 on the page */
}
```

**Blog-only code colours.** Keep the blog's `--code-*` variables, with one change. On the new light-gray code background, the old comment colour `#6b7785` is 4.2:1, below the 4.5:1 minimum. Use these:

```css
:root {
  --code-comment: #5b6b7a; /* was #6b7785: 5.0:1 on #F1F5F9 */
  --code-keyword: #6d3fc4;
  --code-string: #0b6b4f;
  --code-number: #b45309;
  --code-title: #0e5fa8;
}
.dark {
  --code-comment: #7f8fa0;
  --code-keyword: #c4a7ff;
  --code-string: #7ee0b8;
  --code-number: #f5b971;
  --code-title: #7cc4ff;
}
```

(Measured on the code block background `--surface`: light `#F1F5F9`, all pairs ≥ 4.58:1; dark `#0F1F3A`, all ≥ 4.96:1.)

### 3.3 Why some accents aren't the exact brand hex

| Token | Light | Dark | Reason |
|---|---|---|---|
| `--signal` (Brand Blue) | `#1B63D3` | `#60A5FA` | Exact `#1F6FE0` is only 4.35:1 on Light Gray cards, below AA for small text; navy needs a lighter blue |
| `--pulse` (Teal) | `#0F766E` | `#5EEAD4` | Brand Teal is ~1.5:1 on white, so light mode uses a deep teal |

Buttons, focus rings and the header menu button use exact `#1F6FE0` (`--rr-blue`, section 6).

### 3.4 Contrast rules (WCAG 2.1 AA)

- Every text/background pair is **at least 4.5:1** (3:1 for text 24px+, or 18.66px+ bold).
- Borders that identify a control (form fields, outlined buttons) are **at least 3:1**: use `--field` for form fields; `--line` is only for dividers.
- Measured pairs (keep them this way):

| Text | Background | Ratio |
|---|---|---|
| `--ink` `#0F1F3A` | `#FFFFFF` / `#F1F5F9` | 16.6 / 15.0:1 |
| `--slate` `#475569` | `#FFFFFF` / `#F1F5F9` | 7.6 / 6.9:1 |
| `--signal` `#1B63D3` | `#FFFFFF` / `#F1F5F9` | 5.6 / 5.1:1 |
| white on `--signal` (buttons) | `#1B63D3` | 5.6:1 |
| dark `--ink` `#F1F5F9` | `#0A1628` | 16.6:1 |
| dark `--slate` `#94A3B8` | `#0F1F3A` | 6.4:1 |
| dark `--signal` `#60A5FA` | `#0F1F3A` | 6.5:1 |
| `--danger` light / dark | `#F1F5F9` / `#0F1F3A` | 6.0 / 5.9:1 |
| `--field` `#7C8BA1` / dark `#5B6F8F` (borders) | card / field | ≥ 3.2:1 |

---

## 4. Typography

**Fonts:** Poppins (the brand typeface) for headings and text; IBM Plex Mono for small labels, dates, tags and code. Replace `src/app/fonts.js`:

```js
// Raw font variables. globals.css maps them to the --font-display /
// --font-body / --font-mono theme tokens that components use.
// Poppins is the brand typeface (headings and text); Plex Mono is kept for
// small labels, dates and tags.
import { IBM_Plex_Mono, Poppins } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});
```

In `src/app/layout.js` put both variables on `<html>`:

```jsx
<html lang="en" suppressHydrationWarning className={`${poppins.variable} ${plexMono.variable}`}>
  <body className="bg-[var(--paper)] font-body text-[var(--ink)]">
```

In `globals.css`, the `@theme static` block maps them to the utilities (replace the old block):

```css
@theme static {
  --font-display: var(--font-poppins), Arial, ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-poppins), Arial, ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-poppins), Arial, ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

| Utility | Font | Use |
|---|---|---|
| `font-display` | Poppins | Headings, post titles |
| `font-body` (default) | Poppins | Paragraphs, article text |
| `font-mono` | IBM Plex Mono | Small labels, dates, tags, code. **Short text only, never sentences** |

**Rules:**
- Headings use `font-semibold` (600) with `tracking-tight`; card titles `font-medium` (500).
- Intro paragraphs under a page heading are `text-base` on phones and `md:text-xl` from tablets up. Poppins is wide, and 18px phone text makes long walls.
- Text is **left-aligned, never justified.** `globals.css` keeps the ragged edge tidy instead: `text-wrap: balance` on h1–h3 and `text-wrap: pretty` on paragraphs (section 10).

---

## 5. Colour roles

- **Blue means "you can click this."** Links, main buttons and active states are `--signal`. Plain text that isn't a link (an organisation name, a category label) is never blue.
- **Main button:** Brand Blue fill. **Second button:** outlined.
  ```jsx
  {/* Main button */}
  className="rounded-full bg-[var(--signal)] px-6 py-3 text-sm font-medium text-[var(--paper)] transition-opacity hover:opacity-90"
  {/* Second button */}
  className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
  ```
- **Small uppercase labels** above headings are **slate**:
  ```jsx
  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]">Label</p>
  ```
- **Cards** are Light Gray with a thin border that turns blue on hover. Never tint a card blue.
  ```jsx
  className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7 transition-colors hover:border-[var(--signal)]"
  ```
- **A coloured left line** (`border-l-2 border-[var(--signal)]`) marks **one** featured item on a page at most. Ordinary list items use `border-[var(--line)]`, turning blue on hover only when the item is a link.
- **Panels that stay dark** in both themes (e.g. a "subscribe" or "contact" box) use `bg-[var(--inverse)] text-[var(--on-inverse)]`.
- **Errors** use `--danger`. **Teal** (`--pulse`) is only for a success message.

---

## 6. Header

The blog's header must look and measure exactly like the main site's, so moving between them doesn't jump.

**The bar:** `sticky top-0 z-50 h-16 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-sm`. Its content sits in `mx-auto flex h-full max-w-6xl items-center justify-between px-6`.

**Left:**
1. The logo, `<BrandLogo height={32} />`, inside the existing `MainSiteLink href="/"`. Use a plain `<a>`, because `next/link` would add `/blog`. Give it `aria-label="Rasel Rana — main site"` and remove the old separate `<span>Rasel Rana</span>`, since the wordmark is part of the logo now.
2. The divider: `<span aria-hidden className="h-5 w-px bg-[var(--line)]" />`.
3. The "Blog" link: `font-mono text-xs uppercase tracking-[0.2em] text-[var(--signal)]`. It's a link, so blue is right.

**Right:**
- On wide screens, the blog's links (`text-sm font-medium text-[var(--slate)] hover:text-[var(--ink)]`; the current one `text-[var(--ink)]` with `aria-current="page"`) and then the theme button.
- On narrow screens, the theme button and the menu button.
- Switch where the links still fit without crowding. Measure the widest state; use `md` (768px) if they fit, otherwise `lg` (1024px). Nothing may scroll sideways at 320px.

**Header controls:** the theme button and menu button are **32px** in the bar (`hc-btn hc-btn-sm`), the same height as the logo's "R" tile. Copy these four pieces:

1. **CSS:** append the block below to the end of `src/app/globals.css`. It sits in `@layer components` so utilities like `md:hidden` / `lg:hidden` still win. The focus-ring rules are deliberately outside the layer so they beat the site-wide `:focus-visible`.

```css
/* ---- Header controls ---------------------------------------------------
   Theme toggle, mobile menu button and mobile menu panel, in the brand
   palette (spec: header-controls-implementation.md). --rr-* are the brand
   colours, --hc-* the control colours per theme. Used by
   theme/ThemeToggle.jsx, layout/Navbar.jsx and layout/MobileMenu.jsx.
   ----------------------------------------------------------------------- */

:root {
  --rr-navy: #0f1f3a;
  --rr-white: #ffffff;
  --rr-slate: #475569;
  --rr-light: #f1f5f9;
  --rr-blue: #1f6fe0;
  --rr-teal: #5eead4;
  --rr-yellow: #ffd54f;

  --hc-btn-bg: #ffffff;
  --hc-btn-border: #e2e8f0;
  --hc-icon: var(--rr-navy);
  --hc-hover-bg: var(--rr-light);
  --hc-hover-accent: var(--rr-blue);
  --hc-ring: var(--rr-blue);
  --hc-menu-bg: var(--rr-blue);
  --hc-menu-hover: #1a5fc2;
  --hc-menu-shadow: 0 6px 16px -6px rgba(31, 111, 224, 0.55);
  --hc-open-bg: var(--rr-navy);
  --hc-open-fg: #ffffff;
  --hc-surface: #ffffff;
  --hc-border: #e2e8f0;
  --hc-text: var(--rr-navy);
  --hc-sub: var(--rr-slate);
  /* Accent *text* (active link, its 12px number). Brand Blue #1f6fe0 is
     4.35:1 on #f1f5f9, below AA for small text, so text uses the site's
     deeper shade; fills, rings and buttons keep exact Brand Blue. */
  --hc-accent: #1b63d3;
  --hc-active-bg: var(--rr-light);
  --hc-foot-bg: #f8fafc;
  --hc-seg-bg: var(--rr-light);
  --hc-seg-on: #ffffff;
  --hc-seg-on-fg: var(--rr-navy);
}

.dark {
  --hc-btn-bg: #16294a;
  --hc-btn-border: #2a3f66;
  --hc-icon: #ffffff;
  --hc-hover-bg: #1c3358;
  --hc-hover-accent: var(--rr-teal);
  --hc-ring: var(--rr-teal);
  --hc-menu-shadow: 0 6px 18px -6px rgba(31, 111, 224, 0.8);
  --hc-open-bg: #ffffff;
  --hc-open-fg: var(--rr-navy);
  --hc-surface: var(--rr-navy);
  --hc-border: #22365a;
  --hc-text: #ffffff;
  --hc-sub: #94a3b8;
  --hc-accent: var(--rr-teal);
  --hc-active-bg: #16294a;
  --hc-foot-bg: #0c1a33;
  --hc-seg-bg: #16294a;
  --hc-seg-on: var(--rr-blue);
  --hc-seg-on-fg: #ffffff;
}

/* In the components layer so Tailwind utilities (md:hidden) still win */
@layer components {
  .hc-btn {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    transition:
      background-color 0.2s,
      border-color 0.2s,
      color 0.2s,
      box-shadow 0.2s;
  }
  /* Header bar size: 32px, the height of the logo's "R" tile beside it.
     The open menu's top row uses it too, so nothing changes size on opening. */
  .hc-btn-sm {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }
  .hc-btn-sm svg {
    width: 18px;
    height: 18px;
  }
  .hc-theme {
    background: var(--hc-btn-bg);
    border: 1px solid var(--hc-btn-border);
    color: var(--hc-icon);
  }
  .hc-theme:hover {
    background: var(--hc-hover-bg);
    border-color: var(--hc-hover-accent);
    color: var(--hc-hover-accent);
  }
  .hc-menu {
    background: var(--hc-menu-bg);
    border: 1px solid var(--hc-menu-bg);
    color: #ffffff;
    box-shadow: var(--hc-menu-shadow);
  }
  .hc-menu:hover {
    background: var(--hc-menu-hover);
    border-color: var(--hc-menu-hover);
  }
  .hc-menu[aria-expanded="true"] {
    background: var(--hc-open-bg);
    border-color: var(--hc-open-bg);
    color: var(--hc-open-fg);
    box-shadow: none;
  }

  .hc-panel {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    background: var(--hc-surface);
    color: var(--hc-text);
    font-family: var(--font-poppins), "Poppins", Arial, sans-serif;
  }
  /* Matches the header row exactly (64px + 1px border, 24px sides) */
  .hc-panel-head {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    height: 65px;
    padding: 0 24px;
    border-bottom: 1px solid var(--hc-border);
  }
  .hc-eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--hc-sub);
  }
  .hc-nav {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 28px 20px 16px;
    overflow-y: auto;
  }
  .hc-link {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 56px;
    padding: 0 14px;
    border-radius: 14px;
    text-decoration: none;
    font-size: 22px;
    font-weight: 600;
    color: var(--hc-text);
    transition:
      background-color 0.2s,
      color 0.2s;
  }
  .hc-link:hover {
    background: var(--hc-active-bg);
  }
  .hc-link[aria-current="page"] {
    font-weight: 700;
    color: var(--hc-accent);
    background: var(--hc-active-bg);
  }
  .hc-num {
    width: 22px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--hc-sub);
  }
  .hc-link[aria-current="page"] .hc-num {
    color: var(--hc-accent);
  }
  .hc-foot {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px 20px 28px;
    border-top: 1px solid var(--hc-border);
    background: var(--hc-foot-bg);
  }
  .hc-seg {
    display: flex;
    gap: 4px;
    padding: 4px;
    border-radius: 12px;
    background: var(--hc-seg-bg);
  }
  .hc-seg button {
    height: 36px;
    padding: 0 16px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: var(--hc-sub);
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
  }
  .hc-seg button[aria-pressed="true"] {
    background: var(--hc-seg-on);
    color: var(--hc-seg-on-fg);
    box-shadow: 0 1px 3px rgba(15, 31, 58, 0.18);
  }
  .hc-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 54px;
    border-radius: 14px;
    background: var(--rr-blue);
    color: #ffffff;
    font-weight: 600;
    font-size: 16px;
    text-decoration: none;
    box-shadow: 0 10px 24px -10px rgba(31, 111, 224, 0.7);
  }
  .hc-cta:hover {
    background: #1a5fc2;
  }
  .hc-email {
    text-align: center;
    font-size: 13px;
    color: var(--hc-sub);
  }
}

/* Unlayered, so they override the site-wide :focus-visible ring */
.hc-btn:focus-visible,
.hc-panel :focus-visible {
  outline: 2px solid var(--hc-ring);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .hc-btn,
  .hc-link {
    transition: none;
  }
}
```

2. **Icons:** `src/components/layout/header-icons.jsx`:

```jsx
// Icons for the header controls (theme/ThemeToggle, layout/Navbar,
// layout/MobileMenu): 22px, round caps, currentColor except the brand
// accents (sun core yellow, moon sparkle teal, signal arcs teal + yellow).

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function SunIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="var(--rr-yellow)" stroke="currentColor" strokeWidth="1.8" />
      <path
        {...stroke}
        strokeWidth="1.8"
        d="M12 2.8v1.8M12 19.4v1.8M2.8 12h1.8M19.4 12h1.8M5.5 5.5l1.3 1.3M17.2 17.2l1.3 1.3M5.5 18.5l1.3-1.3M17.2 6.8l1.3-1.3"
      />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} strokeWidth="1.8" d="M19.5 14.6A7.6 7.6 0 0 1 9.4 4.5a7.6 7.6 0 1 0 10.1 10.1z" />
      <path {...stroke} stroke="var(--rr-teal)" strokeWidth="1.6" d="M17 3.2v3.2M15.4 4.8h3.2" />
    </svg>
  );
}

// Middle line shorter and right-aligned
export function BarsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} strokeWidth="2" d="M4 7h16M9 12h11M4 17h16" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} strokeWidth="2" d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

export function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} strokeWidth="2" d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} strokeWidth="2" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// The logo's two signal arcs, as a small decorative mark
export function SignalArcs() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} stroke="var(--rr-teal)" strokeWidth="2" d="M4 14a6 6 0 0 1 6-6" />
      <path {...stroke} stroke="var(--rr-yellow)" strokeWidth="2" d="M4 20a12 12 0 0 1 12-12" />
    </svg>
  );
}
```

3. **The theme button:** replace `src/components/layout/ThemeToggle.jsx`. In the header bar it's used as `<ThemeToggle className="hc-btn-sm" />`.

```jsx
"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/layout/header-icons";
import { useIsMounted } from "@/lib/use-is-mounted";

// Brand theme button (.hc-btn .hc-theme in globals.css): a sun in light mode,
// a moon in dark mode. The icon waits for the client so the server HTML and
// the first render agree (the theme is only known in the browser).
// In the header bar pass className="hc-btn-sm" for the 32px size.
export default function ThemeToggle({ className = "" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={!mounted ? "Switch theme" : isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`hc-btn hc-theme ${className}`}
    >
      {mounted ? isDark ? <MoonIcon /> : <SunIcon /> : <span className="h-[22px] w-[22px]" />}
    </button>
  );
}
```

It needs `src/lib/use-is-mounted.js` (new in the blog). It holds back browser-only UI without a hydration mismatch, so don't use `setState` in an effect for this:

```js
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * False during server rendering and hydration, true once on the client.
 * Use it to hold back UI that depends on browser-only state (the resolved
 * theme, document.body for portals) without a hydration mismatch.
 */
export function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}
```

4. **The menu button and the phone menu.** The menu button in the header:

```jsx
<button
  type="button"
  onClick={() => setOpen(true)}
  aria-label="Open menu"
  aria-expanded={open}
  aria-controls="mobile-menu"
  className="hc-btn hc-btn-sm hc-menu"
>
  <BarsIcon />
</button>
```

Close the menu when the page changes. Compare the previous path during render (React's pattern, so no effect is needed):

```jsx
const pathname = usePathname();
const [open, setOpen] = useState(false);
const [lastPath, setLastPath] = useState(pathname);
if (pathname !== lastPath) {
  setLastPath(pathname);
  setOpen(false);
}
// …
{open && <MobileMenu links={links} pathname={pathname} onClose={() => setOpen(false)} />}
```

The phone menu covers the whole screen, and **its top row repeats the header row exactly**: same logo, same 32px buttons, same 64px height and 24px sides. Opening it moves nothing; the menu button simply becomes the close button where it stands. It is rendered into `<body>` with a portal, because the header's `backdrop-blur` would otherwise trap a `position: fixed` child inside the header. Replace `src/components/layout/MobileMenu.jsx` with this blog version of the main site's menu:

```jsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import BrandLogo from "@/components/brand/BrandLogo";
import MainSiteLink from "@/components/layout/MainSiteLink";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useDialogFocus } from "@/lib/use-dialog-focus";
import { useIsMounted } from "@/lib/use-is-mounted";
import { ArrowIcon, ChevronIcon, CloseIcon, SignalArcs } from "./header-icons";

const CONTACT_EMAIL = "contact@raselrana.com.bd";

/**
 * The full-screen phone menu (styles: .hc-* in globals.css). Rendered into
 * <body>: the sticky header has a backdrop blur, which would otherwise make
 * this fixed panel position itself against the header instead of the screen.
 * useDialogFocus moves focus in, keeps Tab inside, closes on Escape and
 * returns focus to the menu button; the header also closes it on a route change.
 * `links` are the blog's own links: [{ label, href }].
 */
export default function MobileMenu({ links, pathname, onClose }) {
  const mounted = useIsMounted();
  const panelRef = useRef(null);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  useDialogFocus(panelRef, onClose, mounted);

  // The page behind does not scroll while the menu is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="hc-panel md:hidden" /* use the same breakpoint as the header */
    >
      {/* Same row as the header (logo, 32px buttons, height, padding), so
          opening the menu does not move or resize anything at the top */}
      <div className="hc-panel-head">
        <MainSiteLink href="/" aria-label="Rasel Rana — main site" className="flex shrink-0 items-center">
          <BrandLogo height={32} />
        </MainSiteLink>
        <div className="flex shrink-0 items-center gap-2.5">
          <ThemeToggle className="hc-btn-sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            aria-expanded="true"
            aria-controls="mobile-menu"
            className="hc-btn hc-btn-sm hc-menu"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <nav aria-label="Blog" className="hc-nav">
        <div className="flex items-center justify-between px-3.5 pb-2.5">
          <span className="hc-eyebrow">Menu</span>
          <SignalArcs />
        </div>
        {links.map((link, i) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className="hc-link"
            >
              <span className="hc-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1">{link.label}</span>
              <ChevronIcon />
            </Link>
          );
        })}
      </nav>

      <div className="hc-foot">
        <div className="flex items-center justify-between gap-4">
          <span className="hc-eyebrow">Appearance</span>
          <div className="hc-seg" role="group" aria-label="Theme">
            <button type="button" aria-pressed={!isDark} onClick={() => setTheme("light")}>
              Light
            </button>
            <button type="button" aria-pressed={isDark} onClick={() => setTheme("dark")}>
              Dark
            </button>
          </div>
        </div>
        {/* The main site's contact page (another app, so a plain <a>) */}
        <MainSiteLink className="hc-cta" href="/contact">
          Get in touch
          <ArrowIcon />
        </MainSiteLink>
        <p className="hc-email">{CONTACT_EMAIL}</p>
      </div>
    </div>,
    document.body,
  );
}
```

It uses `src/lib/use-dialog-focus.js` (new in the blog):

```js
"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keyboard behaviour for a dialog or slide-in panel (WCAG 2.1.1 / 2.4.3):
 * while `active`, focus moves to the first focusable element inside `ref`,
 * Tab and Shift+Tab stay inside it, Escape calls `onClose`, and on close
 * focus goes back to whatever had it before (usually the button that opened
 * it). Used by layout/MobileMenu and sections/downloads/ContactCardPreview.
 */
export function useDialogFocus(ref, onClose, active = true) {
  // Kept in a ref so a new onClose on every render does not re-run the effect
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!active || !ref.current) return;
    const panel = ref.current;
    const previous = document.activeElement;
    panel.querySelector(FOCUSABLE)?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...panel.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, [active, ref]);
}
```

---

## 7. Footer

- Card-coloured background with a top line: `border-t border-[var(--line)] bg-[var(--surface)]`, with the same `mx-auto max-w-6xl px-6` container.
- **Lead row:** `<BrandLogo height={56} tagline />` linking to the main site (`MainSiteLink href="/"`, `aria-label="Rasel Rana — main site"`), with one line of description under it in `text-sm leading-relaxed text-[var(--slate)]`.
- **Columns:** a "Blog" column (the blog's links) and a "Rasel Rana" column linking to the main site (Home `/`, About `/about`, Experience `/experience`, Achievements `/achievements`, Contact `/contact`, all plain `<a>`). Column labels use the slate label style from section 5; links are `text-sm text-[var(--ink)] hover:text-[var(--signal)]`.
- **Bottom line:** `font-mono text-xs text-[var(--slate)]` with "© year Rasel Rana" and "Back to top ↑" (`href="#top"`).

---

## 8. Components

### 8.1 Badges and chips

The outlined pill: `inline-block whitespace-nowrap rounded-full border px-3 py-1 font-mono text-xs`. **One colour rule everywhere:**
- the single highlighted state is Brand Blue (`--signal`);
- an in-between state is navy (`--ink`);
- everything else is slate (`--slate`).
- **Never teal.**

For the blog:

| Component | Mapping |
|---|---|
| `admin/StatusBadge.jsx` | `PUBLISHED` → `border-[var(--signal)] text-[var(--signal)]`; `SCHEDULED` → `border-[var(--ink)] text-[var(--ink)]` (it was teal `--pulse`; change it); `DRAFT` and anything else → `border-[var(--slate)] text-[var(--slate)]` |
| `blog/TagChip.jsx` | A neutral chip: `border-[var(--line)] text-[var(--slate)]`. When it is a link, `hover:border-[var(--signal)] hover:text-[var(--signal)]` |
| Category label on a post card | Slate mono text (`font-mono text-xs text-[var(--slate)]`), not blue. It's a label, not a link |

For reference, the main site's achievement badge (`src/components/ui/Badge.jsx`) applies the same rule:

```jsx
// The small outlined label on achievement cards ("Champion", "Judge",
// "Leadership", …), the same on the home page and the Achievements page.
// One colour rule: the top result is Brand Blue, a runner-up is navy, and
// every other label is slate, so blue stays rare and means something.
const TONES = {
  top: "border-[var(--signal)] text-[var(--signal)]",
  runnerUp: "border-[var(--ink)] text-[var(--ink)]",
  plain: "border-[var(--slate)] text-[var(--slate)]",
};

function toneOf(label) {
  const text = String(label || "").trim().toLowerCase();
  if (text === "champion") return TONES.top;
  if (text === "runner-up" || text === "1st runner-up") return TONES.runnerUp;
  return TONES.plain;
}

export default function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 font-mono text-xs ${toneOf(children)} ${className}`}
    >
      {children}
    </span>
  );
}
```

### 8.2 Post cards

The card style from section 5. Inside:
- category + date in slate mono;
- title `font-display text-xl font-medium text-[var(--ink)]` (blue on card hover is fine, since the card is a link);
- excerpt `text-sm leading-relaxed text-[var(--slate)]`.

If a grid would leave one card alone on a row, pick a column count that fills the rows: 4 cards → `md:grid-cols-2 lg:grid-cols-4`; 2 → `md:grid-cols-2`; else `md:grid-cols-3`.

### 8.3 Article (post page)

- **Body:** `--ink` text, `leading-relaxed`, measure about 65–70 characters.
- **Links in text:** `--signal`, underlined.
- **Blockquote:** a `--line` left border and slate text. A blue left rule is kept for the one featured item on a page.
- **Code:** inline code on `--surface`; code blocks as now (`--surface` background, `--line` border, mono), with the `--code-*` colours from 3.2.
- **Reading progress bar:** `--signal` (Brand Blue).
- **Table of contents:** the current entry in `--signal` with `aria-current="location"`; others slate, `hover:text-[var(--ink)]`.
- **Author card:** `<BrandMark />` (or the author photo), the name in `--ink`, the role in slate.

### 8.4 Forms (search, admin, any future form)

- **Fields:**
  ```
  w-full rounded-md border border-[var(--field)] bg-[var(--paper)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--slate)] outline-none transition-colors focus:border-[var(--signal)]
  ```
  `--field`, not `--line`, so the outline is visible (3:1).
- **Labels:** every field has a visible `<label>` (the slate mono label style). Required fields add " (required)" to the label, read as part of it.
- **Errors:** check fields before sending. Show each problem **under its field** in `text-sm text-[var(--danger)]` with an id. Give the field `aria-invalid="true"` and `aria-describedby="<id>"`, and turn its border `--danger`. Move focus to the first problem field, and clear a field's error as soon as it changes.
- **Server results:** messages that appear after an action ("Saved", "Failed to send") go inside an always-present `<div aria-live="polite">`.
- **Busy buttons:** use `aria-disabled` and ignore clicks while busy, instead of `disabled`, so focus isn't lost.

---

## 9. Layout and motion

- **One container everywhere:** `mx-auto max-w-6xl px-6` for the header, content and footer, so every left edge lines up with the main site.
- **Section rhythm:** `py-16 md:py-20` or `py-20 md:py-24`. Each section after the first starts with `border-t border-[var(--line)]`.
- **Motion is CSS only:** `.rise` on load and `.reveal` on scroll, as already in the blog's `globals.css`. All of it sits inside `@media (prefers-reduced-motion: no-preference)`. Never hide content until JavaScript runs.
- **Page cross-fade:** keep `@view-transition { navigation: auto; }` inside that media query. The main site has the same rule, so going between the two apps cross-fades.
- **Overlays:** an element with `.rise` / `.reveal` is transformed, so a `position: fixed` child would be placed against it instead of the screen. Render dialogs and overlays into `document.body` with `createPortal`.

---

## 10. Accessibility rules (WCAG 2.1 AA, as on the main site)

1. **Skip link:** the header starts with a "Skip to content" link to `<main id="main" tabIndex={-1} className="… outline-none">`. Copy it from the main site's `Navbar.jsx`:
   ```jsx
   <a
     href="#main"
     className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-[var(--signal)] focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-[var(--paper)]"
   >
     Skip to content
   </a>
   ```
2. **Focus ring:** `:focus-visible { outline: 2px solid var(--signal); outline-offset: 3px; border-radius: 2px; }` site-wide. Header controls use their own ring (section 6). Never remove an outline without a replacement.
3. **Sticky header:** `html { scroll-padding-top: 5rem; }`, so keyboard focus and anchor jumps (table of contents!) stop below the 64px header. With reduced motion, `scroll-behavior: auto`. Copy these rules into `globals.css` (replacing the blog's `html { scroll-behavior: smooth; }`); the code is under this list.
4. **Dialogs and panels:** use `useDialogFocus` (section 6): focus moves in, Tab stays inside, Escape closes, focus returns.
5. **Current location:** `aria-current="page"` on the active nav link; `aria-current="location"` on the active table-of-contents entry.
6. **Links that open a new tab** (share buttons, external links): add `<span className="sr-only"> (opens in a new tab)</span>` inside, and a visible ↗ where it fits.
7. **Images:** every content image has meaningful `alt` (the post cover from a "cover description" field, falling back to the post title). Decorative SVGs get `aria-hidden="true"`.
8. **Names:**
   - Icon-only buttons need an `aria-label`.
   - Repeated link texts ("Read more", "Download") need a full name for screen readers: `aria-label="Read more: <post title>"`, or make the whole card the link.
9. **Targets:** at least 24×24px (header buttons are 32px; menu rows 56px).
10. **Headings:** one `<h1>` per page, no skipped levels.
11. **Language:** `<html lang="en">`.

The `html` rules for item 3:

```css
html {
  scroll-behavior: smooth;
  /* Keyboard focus and anchor jumps stop clear of the 64px sticky header
     (WCAG 2.4.11), instead of landing underneath it */
  scroll-padding-top: 5rem;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

---

## 11. What not to do

- Don't use the old tokens or fonts: `#0e7c86`, `#2dd4c7`, `#f5f6f4`, `#0f2438`, `space-grotesk`, `plex-sans`, `Space_Grotesk`, `IBM_Plex_Sans`.
- Don't redraw the logo, use the tile's blue as a UI colour, or put yellow or teal text on white.
- Don't use Tailwind palette colours, `dark:` variants, or `text-justify`.
- Don't use `next/link` for links to the main site (`MainSiteLink` / a plain `<a>`).
- Don't change the `/blog/api/posts` response (see `docs/design-brief.md`, section 8).

---

## 12. Checklist before calling it done

- [ ] Logo files copied to `src/asset/brand/rasel-rana-logo/`; the five icon files in `src/app/` (2.2); the browser tab shows the new blue "R".
- [ ] `src/lib/brand.js`, `components/brand/BrandMark.jsx` and `components/brand/BrandLogo.jsx` match Appendix A. The header shows `BrandLogo` at 32px and the footer `BrandLogo` with tagline at 56px.
- [ ] `globals.css` has the tokens from 3.2 (plus the corrected `--code-comment`), the `@theme` block from 4 and the header-controls block from 6. `fonts.js` loads Poppins + IBM Plex Mono.
- [ ] A search of `src/` finds none of the old values listed in section 11.
- [ ] Open raselrana.com.bd and the blog side by side, in light and dark, at 390px, 768px and 1280px. The header row is pixel-identical (logo position and size, 32px buttons, 64px height). Going Blog → main site and back doesn't jump.
- [ ] Phone menu: opening it moves nothing at the top. Tab stays inside; Escape, a link and the Back button close it; focus returns to the menu button; the Light/Dark switch works.
- [ ] No horizontal scrolling at 320px; nothing breaks at 200% zoom.
- [ ] Badges and chips follow 8.1; nothing is teal except a success message; no blue text that isn't a link.
- [ ] Forms follow 8.4 (visible borders, "(required)", errors under fields).
- [ ] axe-core (or Lighthouse accessibility): 0 violations on the home page, a post page, a topic page and search, in both themes.
- [ ] `npm run lint` and `npm run build` pass. `GET /blog/api/posts?limit=3` still returns the same shape.

---

## Appendix A — logo code (copy exactly)

### `src/lib/brand.js`

```js
/**
 * The brand logo as plain data, shared by every place that draws it:
 * ui/BrandMark and ui/BrandLogo (site and dashboard), the link-preview
 * picture (app/opengraph-image.jsx) and the portfolio PDF
 * (lib/pdf/PortfolioPdf.jsx). Copied from the designer's SVG files
 * (rasel-rana-logo/svg); src/app/icon.svg is the small mark as a file.
 * Client-safe: no imports.
 */

export const BRAND_COLORS = {
  tile: "#1D6FE0",
  letter: "#FFFFFF",
  innerArc: "#5EEAD4",
  outerArc: "#FCD34D",
};

// The mark: drawn in a 100 × 100 box. The tile is a rounded square
// (corner radius 24); the strokes sit inside `transform`.
export const MARK = {
  size: 100,
  radius: 24,
  transform: "translate(50 50) scale(0.92) translate(-53.5 -41.5)",
  strokes: [
    { d: "M28 76V26h18a13 13 0 0 1 0 26H28", color: BRAND_COLORS.letter, width: 10 },
    { d: "M44 52l16 24", color: BRAND_COLORS.letter, width: 10 },
    { d: "M60 15a11 11 0 0 1 11 11", color: BRAND_COLORS.innerArc, width: 6 },
    { d: "M60 5a21 21 0 0 1 21 21", color: BRAND_COLORS.outerArc, width: 6 },
  ],
};

// The mark for small sizes (favicon, under about 24px): thicker strokes and
// one arc, so it stays legible.
export const MARK_SMALL = {
  size: 100,
  radius: 24,
  transform: "translate(50 50) scale(0.94) translate(-52.5 -42.5)",
  strokes: [
    { d: "M28 76V26h18a13 13 0 0 1 0 26H28", color: BRAND_COLORS.letter, width: 12 },
    { d: "M44 52l16 24", color: BRAND_COLORS.letter, width: 12 },
    { d: "M62 8a16 16 0 0 1 16 16", color: BRAND_COLORS.outerArc, width: 10 },
  ],
};

// The name-only lockup: the mark scaled to 68 units tall, then "Rasel Rana"
// as outlined letters (so it looks the same whatever fonts load).
export const LOCKUP = {
  width: 285.86,
  height: 68,
  markScale: 0.68,
  wordmarkTransform: "translate(0 10.7)",
  wordmark: "M101.12 36.51 95.86 26.97H94.39V36.51H88.23V11.24H98.56Q101.55 11.24 103.66 12.28Q105.76 13.32 106.81 15.14Q107.85 16.96 107.85 19.19Q107.85 21.71 106.43 23.69Q105.01 25.67 102.24 26.5L108.07 36.51ZM94.39 22.61H98.2Q99.9 22.61 100.74 21.78Q101.59 20.96 101.59 19.44Q101.59 18 100.74 17.18Q99.9 16.35 98.2 16.35H94.39Z M118.54 16.13Q120.66 16.13 122.26 17Q123.86 17.86 124.73 19.26V16.42H130.88V36.51H124.73V33.66Q123.83 35.07 122.23 35.93Q120.62 36.8 118.5 36.8Q116.05 36.8 114.04 35.52Q112.02 34.24 110.85 31.88Q109.68 29.52 109.68 26.43Q109.68 23.33 110.85 20.99Q112.02 18.65 114.04 17.39Q116.05 16.13 118.54 16.13ZM120.34 21.5Q118.5 21.5 117.22 22.81Q115.94 24.12 115.94 26.43Q115.94 28.73 117.22 30.08Q118.5 31.43 120.34 31.43Q122.17 31.43 123.45 30.1Q124.73 28.77 124.73 26.46Q124.73 24.16 123.45 22.83Q122.17 21.5 120.34 21.5Z M133.47 29.92H139.55Q139.66 30.96 140.52 31.61Q141.39 32.26 142.65 32.26Q143.8 32.26 144.43 31.81Q145.06 31.36 145.06 30.64Q145.06 29.78 144.16 29.36Q143.26 28.95 141.24 28.44Q139.08 27.94 137.64 27.38Q136.2 26.82 135.16 25.62Q134.12 24.41 134.12 22.36Q134.12 20.63 135.07 19.21Q136.02 17.79 137.88 16.96Q139.73 16.13 142.29 16.13Q146.07 16.13 148.25 18Q150.42 19.88 150.75 22.97H145.06Q144.92 21.93 144.14 21.32Q143.37 20.7 142.11 20.7Q141.03 20.7 140.45 21.12Q139.88 21.53 139.88 22.25Q139.88 23.12 140.79 23.55Q141.71 23.98 143.66 24.41Q145.89 24.99 147.29 25.55Q148.7 26.1 149.76 27.35Q150.82 28.59 150.86 30.68Q150.86 32.44 149.87 33.83Q148.88 35.21 147.02 36Q145.17 36.8 142.72 36.8Q140.09 36.8 138.04 35.9Q135.99 35 134.8 33.43Q133.61 31.86 133.47 29.92Z M172.66 27.94H158.73Q158.88 29.81 159.94 30.8Q161 31.79 162.55 31.79Q164.85 31.79 165.75 29.85H172.3Q171.8 31.83 170.49 33.41Q169.17 35 167.19 35.9Q165.21 36.8 162.76 36.8Q159.81 36.8 157.51 35.54Q155.2 34.28 153.91 31.94Q152.61 29.6 152.61 26.46Q152.61 23.33 153.89 20.99Q155.17 18.65 157.47 17.39Q159.78 16.13 162.76 16.13Q165.68 16.13 167.95 17.36Q170.22 18.58 171.49 20.85Q172.77 23.12 172.77 26.14Q172.77 27 172.66 27.94ZM166.47 24.52Q166.47 22.94 165.39 22Q164.31 21.06 162.69 21.06Q161.14 21.06 160.08 21.96Q159.02 22.86 158.77 24.52Z M181.37 9.87V36.51H175.21V9.87Z M204.75 36.51 199.5 26.97H198.02V36.51H191.86V11.24H202.2Q205.18 11.24 207.29 12.28Q209.4 13.32 210.44 15.14Q211.48 16.96 211.48 19.19Q211.48 21.71 210.06 23.69Q208.64 25.67 205.87 26.5L211.7 36.51ZM198.02 22.61H201.84Q203.53 22.61 204.37 21.78Q205.22 20.96 205.22 19.44Q205.22 18 204.37 17.18Q203.53 16.35 201.84 16.35H198.02Z M222.17 16.13Q224.29 16.13 225.89 17Q227.5 17.86 228.36 19.26V16.42H234.52V36.51H228.36V33.66Q227.46 35.07 225.86 35.93Q224.26 36.8 222.13 36.8Q219.68 36.8 217.67 35.52Q215.65 34.24 214.48 31.88Q213.31 29.52 213.31 26.43Q213.31 23.33 214.48 20.99Q215.65 18.65 217.67 17.39Q219.68 16.13 222.17 16.13ZM223.97 21.5Q222.13 21.5 220.85 22.81Q219.58 24.12 219.58 26.43Q219.58 28.73 220.85 30.08Q222.13 31.43 223.97 31.43Q225.8 31.43 227.08 30.1Q228.36 28.77 228.36 26.46Q228.36 24.16 227.08 22.83Q225.8 21.5 223.97 21.5Z M258.16 24.77V36.51H252.04V25.6Q252.04 23.58 251 22.47Q249.95 21.35 248.19 21.35Q246.42 21.35 245.38 22.47Q244.34 23.58 244.34 25.6V36.51H238.18V16.42H244.34V19.08Q245.27 17.75 246.86 16.98Q248.44 16.2 250.42 16.2Q253.95 16.2 256.05 18.49Q258.16 20.78 258.16 24.77Z M269.28 16.13Q271.4 16.13 273 17Q274.6 17.86 275.47 19.26V16.42H281.62V36.51H275.47V33.66Q274.57 35.07 272.97 35.93Q271.36 36.8 269.24 36.8Q266.79 36.8 264.78 35.52Q262.76 34.24 261.59 31.88Q260.42 29.52 260.42 26.43Q260.42 23.33 261.59 20.99Q262.76 18.65 264.78 17.39Q266.79 16.13 269.28 16.13ZM271.08 21.5Q269.24 21.5 267.96 22.81Q266.68 24.12 266.68 26.43Q266.68 28.73 267.96 30.08Q269.24 31.43 271.08 31.43Q272.91 31.43 274.19 30.1Q275.47 28.77 275.47 26.46Q275.47 24.16 274.19 22.83Q272.91 21.5 271.08 21.5Z",
};

// The lockup with the tagline under the name ("ENGINEER · DEVELOPER"), used
// in the footer. Same box and mark as LOCKUP, but the name sits higher to
// make room; both are outlines from rasel-rana-logo.svg.
export const LOCKUP_TAGLINE = {
  width: 285.86,
  height: 68,
  markScale: 0.68,
  label: "Rasel Rana — Engineer · Developer",
  wordmark: "M101.12 36.51 95.86 26.97H94.39V36.51H88.23V11.24H98.56Q101.55 11.24 103.66 12.28Q105.76 13.32 106.81 15.14Q107.85 16.96 107.85 19.19Q107.85 21.71 106.43 23.69Q105.01 25.67 102.24 26.5L108.07 36.51ZM94.39 22.61H98.2Q99.9 22.61 100.74 21.78Q101.59 20.96 101.59 19.44Q101.59 18 100.74 17.18Q99.9 16.35 98.2 16.35H94.39Z M118.54 16.13Q120.66 16.13 122.26 17Q123.86 17.86 124.73 19.26V16.42H130.88V36.51H124.73V33.66Q123.83 35.07 122.23 35.93Q120.62 36.8 118.5 36.8Q116.05 36.8 114.04 35.52Q112.02 34.24 110.85 31.88Q109.68 29.52 109.68 26.43Q109.68 23.33 110.85 20.99Q112.02 18.65 114.04 17.39Q116.05 16.13 118.54 16.13ZM120.34 21.5Q118.5 21.5 117.22 22.81Q115.94 24.12 115.94 26.43Q115.94 28.73 117.22 30.08Q118.5 31.43 120.34 31.43Q122.17 31.43 123.45 30.1Q124.73 28.77 124.73 26.46Q124.73 24.16 123.45 22.83Q122.17 21.5 120.34 21.5Z M133.47 29.92H139.55Q139.66 30.96 140.52 31.61Q141.39 32.26 142.65 32.26Q143.8 32.26 144.43 31.81Q145.06 31.36 145.06 30.64Q145.06 29.78 144.16 29.36Q143.26 28.95 141.24 28.44Q139.08 27.94 137.64 27.38Q136.2 26.82 135.16 25.62Q134.12 24.41 134.12 22.36Q134.12 20.63 135.07 19.21Q136.02 17.79 137.88 16.96Q139.73 16.13 142.29 16.13Q146.07 16.13 148.25 18Q150.42 19.88 150.75 22.97H145.06Q144.92 21.93 144.14 21.32Q143.37 20.7 142.11 20.7Q141.03 20.7 140.45 21.12Q139.88 21.53 139.88 22.25Q139.88 23.12 140.79 23.55Q141.71 23.98 143.66 24.41Q145.89 24.99 147.29 25.55Q148.7 26.1 149.76 27.35Q150.82 28.59 150.86 30.68Q150.86 32.44 149.87 33.83Q148.88 35.21 147.02 36Q145.17 36.8 142.72 36.8Q140.09 36.8 138.04 35.9Q135.99 35 134.8 33.43Q133.61 31.86 133.47 29.92Z M172.66 27.94H158.73Q158.88 29.81 159.94 30.8Q161 31.79 162.55 31.79Q164.85 31.79 165.75 29.85H172.3Q171.8 31.83 170.49 33.41Q169.17 35 167.19 35.9Q165.21 36.8 162.76 36.8Q159.81 36.8 157.51 35.54Q155.2 34.28 153.91 31.94Q152.61 29.6 152.61 26.46Q152.61 23.33 153.89 20.99Q155.17 18.65 157.47 17.39Q159.78 16.13 162.76 16.13Q165.68 16.13 167.95 17.36Q170.22 18.58 171.49 20.85Q172.77 23.12 172.77 26.14Q172.77 27 172.66 27.94ZM166.47 24.52Q166.47 22.94 165.39 22Q164.31 21.06 162.69 21.06Q161.14 21.06 160.08 21.96Q159.02 22.86 158.77 24.52Z M181.37 9.87V36.51H175.21V9.87Z M204.75 36.51 199.5 26.97H198.02V36.51H191.86V11.24H202.2Q205.18 11.24 207.29 12.28Q209.4 13.32 210.44 15.14Q211.48 16.96 211.48 19.19Q211.48 21.71 210.06 23.69Q208.64 25.67 205.87 26.5L211.7 36.51ZM198.02 22.61H201.84Q203.53 22.61 204.37 21.78Q205.22 20.96 205.22 19.44Q205.22 18 204.37 17.18Q203.53 16.35 201.84 16.35H198.02Z M222.17 16.13Q224.29 16.13 225.89 17Q227.5 17.86 228.36 19.26V16.42H234.52V36.51H228.36V33.66Q227.46 35.07 225.86 35.93Q224.26 36.8 222.13 36.8Q219.68 36.8 217.67 35.52Q215.65 34.24 214.48 31.88Q213.31 29.52 213.31 26.43Q213.31 23.33 214.48 20.99Q215.65 18.65 217.67 17.39Q219.68 16.13 222.17 16.13ZM223.97 21.5Q222.13 21.5 220.85 22.81Q219.58 24.12 219.58 26.43Q219.58 28.73 220.85 30.08Q222.13 31.43 223.97 31.43Q225.8 31.43 227.08 30.1Q228.36 28.77 228.36 26.46Q228.36 24.16 227.08 22.83Q225.8 21.5 223.97 21.5Z M258.16 24.77V36.51H252.04V25.6Q252.04 23.58 251 22.47Q249.95 21.35 248.19 21.35Q246.42 21.35 245.38 22.47Q244.34 23.58 244.34 25.6V36.51H238.18V16.42H244.34V19.08Q245.27 17.75 246.86 16.98Q248.44 16.2 250.42 16.2Q253.95 16.2 256.05 18.49Q258.16 20.78 258.16 24.77Z M269.28 16.13Q271.4 16.13 273 17Q274.6 17.86 275.47 19.26V16.42H281.62V36.51H275.47V33.66Q274.57 35.07 272.97 35.93Q271.36 36.8 269.24 36.8Q266.79 36.8 264.78 35.52Q262.76 34.24 261.59 31.88Q260.42 29.52 260.42 26.43Q260.42 23.33 261.59 20.99Q262.76 18.65 264.78 17.39Q266.79 16.13 269.28 16.13ZM271.08 21.5Q269.24 21.5 267.96 22.81Q266.68 24.12 266.68 26.43Q266.68 28.73 267.96 30.08Q269.24 31.43 271.08 31.43Q272.91 31.43 274.19 30.1Q275.47 28.77 275.47 26.46Q275.47 24.16 274.19 22.83Q272.91 21.5 271.08 21.5Z",
  tagline: "M88.27 49.64V52.08H91.15V53.2H88.27V55.76H91.51V56.87H86.9V48.52H91.51V49.64Z M103.04 56.87H101.67L97.56 50.64V56.87H96.19V48.52H97.56L101.67 54.74V48.52H103.04Z M113.88 50.93Q113.55 50.31 112.98 49.99Q112.4 49.67 111.64 49.67Q110.82 49.67 110.17 50.04Q109.52 50.42 109.15 51.1Q108.79 51.78 108.79 52.68Q108.79 53.58 109.15 54.27Q109.52 54.96 110.17 55.34Q110.82 55.71 111.64 55.71Q112.76 55.71 113.46 55.08Q114.15 54.46 114.31 53.39H111.18V52.3H115.77V53.37Q115.64 54.34 115.08 55.16Q114.52 55.97 113.63 56.46Q112.74 56.94 111.64 56.94Q110.47 56.94 109.5 56.4Q108.52 55.85 107.95 54.88Q107.38 53.91 107.38 52.68Q107.38 51.46 107.95 50.49Q108.52 49.52 109.5 48.97Q110.48 48.42 111.64 48.42Q112.98 48.42 114.01 49.08Q115.05 49.73 115.52 50.93Z M121.48 48.53V56.87H120.12V48.53Z M133.14 56.87H131.77L127.65 50.64V56.87H126.28V48.52H127.65L131.77 54.74V48.52H133.14Z M139.3 49.64V52.08H142.18V53.2H139.3V55.76H142.54V56.87H137.94V48.52H142.54V49.64Z M148.59 49.64V52.08H151.47V53.2H148.59V55.76H151.83V56.87H147.22V48.52H151.83V49.64Z M160.84 56.87 158.92 53.54H157.88V56.87H156.51V48.53H159.39Q160.35 48.53 161.02 48.87Q161.68 49.2 162.01 49.77Q162.34 50.33 162.34 51.03Q162.34 51.84 161.87 52.51Q161.4 53.18 160.41 53.42L162.48 56.87ZM157.88 52.44H159.39Q160.16 52.44 160.55 52.06Q160.94 51.68 160.94 51.03Q160.94 50.38 160.56 50.01Q160.17 49.65 159.39 49.65H157.88Z M172.94 52.85Q172.94 52.48 173.19 52.23Q173.44 51.98 173.82 51.98Q174.18 51.98 174.43 52.23Q174.68 52.48 174.68 52.85Q174.68 53.22 174.43 53.48Q174.18 53.73 173.82 53.73Q173.44 53.73 173.19 53.48Q172.94 53.22 172.94 52.85Z M192.42 52.73Q192.42 54 191.87 54.94Q191.32 55.88 190.32 56.37Q189.32 56.87 187.99 56.87H185.26V48.53H187.99Q189.32 48.53 190.32 49.04Q191.32 49.55 191.87 50.51Q192.42 51.46 192.42 52.73ZM191.01 52.73Q191.01 51.28 190.23 50.46Q189.45 49.65 187.99 49.65H186.63V55.76H187.99Q189.45 55.76 190.23 54.96Q191.01 54.17 191.01 52.73Z M198.14 49.64V52.08H201.02V53.2H198.14V55.76H201.38V56.87H196.77V48.52H201.38V49.64Z M213.25 48.53 210.12 56.87H208.53L205.39 48.53H206.85L209.32 55.47L211.81 48.53Z M218.76 49.64V52.08H221.64V53.2H218.76V55.76H222V56.87H217.39V48.52H222V49.64Z M228.04 55.77H230.86V56.87H226.68V48.53H228.04Z M234.55 52.68Q234.55 51.46 235.12 50.49Q235.69 49.52 236.67 48.97Q237.64 48.42 238.81 48.42Q239.98 48.42 240.96 48.97Q241.94 49.52 242.5 50.49Q243.07 51.46 243.07 52.68Q243.07 53.91 242.5 54.89Q241.94 55.86 240.96 56.41Q239.98 56.96 238.81 56.96Q237.64 56.96 236.67 56.41Q235.69 55.86 235.12 54.89Q234.55 53.91 234.55 52.68ZM241.66 52.68Q241.66 51.76 241.3 51.06Q240.93 50.37 240.28 50Q239.64 49.62 238.81 49.62Q237.98 49.62 237.33 50Q236.68 50.37 236.32 51.06Q235.95 51.76 235.95 52.68Q235.95 53.61 236.32 54.31Q236.68 55.01 237.33 55.39Q237.98 55.77 238.81 55.77Q239.64 55.77 240.28 55.39Q240.93 55.01 241.3 54.31Q241.66 53.61 241.66 52.68Z M250.29 53.49H248.78V56.87H247.41V48.53H250.29Q251.25 48.53 251.92 48.86Q252.58 49.19 252.91 49.76Q253.24 50.32 253.24 51.02Q253.24 51.65 252.94 52.22Q252.64 52.78 251.98 53.13Q251.32 53.49 250.29 53.49ZM251.84 51.02Q251.84 49.65 250.29 49.65H248.78V52.37H250.29Q251.07 52.37 251.46 52.02Q251.84 51.66 251.84 51.02Z M258.92 49.64V52.08H261.8V53.2H258.92V55.76H262.16V56.87H257.55V48.52H262.16V49.64Z M271.17 56.87 269.25 53.54H268.21V56.87H266.84V48.53H269.72Q270.68 48.53 271.35 48.87Q272.01 49.2 272.34 49.77Q272.67 50.33 272.67 51.03Q272.67 51.84 272.2 52.51Q271.72 53.18 270.74 53.42L272.8 56.87ZM268.21 52.44H269.72Q270.49 52.44 270.88 52.06Q271.27 51.68 271.27 51.03Q271.27 50.38 270.88 50.01Q270.5 49.65 269.72 49.65H268.21Z",
};
```

### `src/components/brand/BrandMark.jsx`

```jsx
import { MARK, MARK_SMALL, BRAND_COLORS } from "@/lib/brand";

/**
 * BrandMark — the logo mark on its own: the blue tile with the "R" and its
 * two signal arcs. Used in the dashboard (sidebar, login) and as the
 * placeholder on blog cards; the navbar and footer use ui/BrandLogo, which
 * adds the name. Fixed brand colours, so it reads the same in both themes.
 * Below 24px it switches to the small-size mark (thicker strokes, one arc).
 * Geometry lives in lib/brand.js.
 */
export default function BrandMark({ className = "", size = 30 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Rasel Rana"
    >
      <MarkShapes small={size < 24} />
    </svg>
  );
}

// The tile and strokes in a 100 × 100 box; shared with ui/BrandLogo.
export function MarkShapes({ small = false }) {
  const mark = small ? MARK_SMALL : MARK;
  return (
    <>
      <rect width={mark.size} height={mark.size} rx={mark.radius} fill={BRAND_COLORS.tile} />
      <g
        transform={mark.transform}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {mark.strokes.map((stroke) => (
          <path key={stroke.d} d={stroke.d} stroke={stroke.color} strokeWidth={stroke.width} />
        ))}
      </g>
    </>
  );
}
```

### `src/components/brand/BrandLogo.jsx`

```jsx
import { LOCKUP, LOCKUP_TAGLINE } from "@/lib/brand";
import { MarkShapes } from "./BrandMark";

/**
 * BrandLogo — the mark followed by "Rasel Rana": the navbar uses the plain
 * version, the footer the one with "ENGINEER · DEVELOPER" under the name
 * (`tagline`). The name is filled with var(--ink) and the tagline with
 * var(--slate), so one SVG gives the light and the dark version; the blue
 * tile keeps its own colours. Width follows from `height` (both are
 * 285.86 × 68). The tagline needs about 56px of height to stay readable.
 */
export default function BrandLogo({ height = 32, className = "", label, tagline = false }) {
  const lockup = tagline ? LOCKUP_TAGLINE : LOCKUP;
  const width = Math.round((height * lockup.width) / lockup.height);
  return (
    <svg
      viewBox={`0 0 ${lockup.width} ${lockup.height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={label || (tagline ? LOCKUP_TAGLINE.label : "Rasel Rana")}
    >
      <g transform={`scale(${lockup.markScale})`}>
        <MarkShapes />
      </g>
      <path transform={lockup.wordmarkTransform} d={lockup.wordmark} fill="var(--ink)" />
      {tagline && <path d={lockup.tagline} fill="var(--slate)" />}
    </svg>
  );
}
```
