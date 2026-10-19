import { MARK, MARK_SMALL, BRAND_COLORS } from "@/lib/brand";

/**
 * BrandMark — the logo mark on its own: the blue tile with the "R" and its
 * two signal arcs. Used in the admin (sidebar, login), the author card and
 * the about/author pages; the header and footer use brand/BrandLogo, which
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

// The tile and strokes in a 100 × 100 box; shared with brand/BrandLogo.
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
