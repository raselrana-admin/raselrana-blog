import { LOCKUP, LOCKUP_TAGLINE } from "@/lib/brand";
import { MarkShapes } from "./BrandMark";

/**
 * BrandLogo — the mark followed by "Rasel Rana": the header uses the plain
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
