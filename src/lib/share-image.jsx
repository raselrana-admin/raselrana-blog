import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND_COLORS, LOCKUP, MARK } from "@/lib/brand";

/**
 * The 1200 × 630 link-preview picture (Open Graph / social cards) in the brand:
 * a navy panel with the on-dark logo, a title and a short line above it.
 * Used by /api/og (the blog itself) and /api/og/[slug] (a post without a cover).
 *
 * Satori has no CSS variables, so the colours are written out: the navy, light
 * gray and slate are the --inverse / --ink (dark) / --slate (dark) values in
 * globals.css, the blue and arcs are the exact brand colours (--rr-*).
 * Server only: it reads the font files from disk.
 */

const NAVY = "#0f1f3a";
const LIGHT = "#f1f5f9";
const SLATE = "#94a3b8";
const BLUE = "#1f6fe0";

const FONT_DIR = join(process.cwd(), "src/asset/fonts");
let fonts;
function loadFonts() {
  fonts ??= Promise.all([
    readFile(join(FONT_DIR, "Poppins-Medium.ttf")),
    readFile(join(FONT_DIR, "Poppins-SemiBold.ttf")),
  ]).then(([medium, semiBold]) => [
    { name: "Poppins", data: medium, weight: 500, style: "normal" },
    { name: "Poppins", data: semiBold, weight: 600, style: "normal" },
  ]);
  return fonts;
}

// Long titles get smaller type so they stay within three lines.
function titleSize(title) {
  if (title.length <= 40) return 76;
  if (title.length <= 70) return 64;
  return 54;
}

// The logo with the name in white: the guide's on-dark lockup (mark colours unchanged).
function Logo({ height }) {
  const width = Math.round((height * LOCKUP.width) / LOCKUP.height);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${LOCKUP.width} ${LOCKUP.height}`}>
      <g transform={`scale(${LOCKUP.markScale})`}>
        <rect width={MARK.size} height={MARK.size} rx={MARK.radius} fill={BRAND_COLORS.tile} />
        <g transform={MARK.transform} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {MARK.strokes.map((stroke) => (
            <path key={stroke.d} d={stroke.d} stroke={stroke.color} strokeWidth={stroke.width} />
          ))}
        </g>
      </g>
      <path transform={LOCKUP.wordmarkTransform} d={LOCKUP.wordmark} fill={LIGHT} />
    </svg>
  );
}

// The logo's two signal arcs, large, in the corner (same shapes as SignalArcs in header-icons).
function Arcs() {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 24 24"
      style={{ position: "absolute", right: 56, bottom: 48 }}
    >
      <path d="M4 14a6 6 0 0 1 6-6" fill="none" stroke={BRAND_COLORS.innerArc} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4 20a12 12 0 0 1 12-12" fill="none" stroke={BRAND_COLORS.outerArc} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * `title`: the main line. `kicker`: the short line above it (category and type).
 * `footer`: bottom-left text, e.g. the date and reading time.
 */
export async function shareImage({ title, kicker, footer = "raselrana.com.bd/blog" }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: NAVY,
          color: LIGHT,
          fontFamily: "Poppins",
          position: "relative",
        }}
      >
        <Arcs />
        <Logo height={56} />
        {/* Narrow enough to stay clear of the arcs (which start at about x = 880) */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
          <div style={{ width: 88, height: 6, borderRadius: 3, backgroundColor: BLUE }} />
          {kicker && (
            <div style={{ marginTop: 28, fontSize: 28, fontWeight: 500, color: SLATE }}>
              {kicker}
            </div>
          )}
          <div
            style={{
              marginTop: kicker ? 14 : 28,
              fontSize: titleSize(title),
              fontWeight: 600,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ fontSize: 26, fontWeight: 500, color: SLATE }}>{footer}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: await loadFonts(),
      headers: {
        // Titles change rarely; a renamed post shows its new picture within the hour.
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}

/** The blog's own picture: home, listings, about, and every post while "coming soon". */
export function blogShareImage() {
  return shareImage({ kicker: "Blog", title: "Notes on telecom networks, power and engineering." });
}
