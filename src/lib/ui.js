// Ready-made class strings from docs/brand-guide.md (sections 5 and 8), so every page uses the same ones.

export const container = "mx-auto max-w-6xl px-6";

export const label =
  "font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]";

export const pageLabel =
  "flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]";

export const pageHeading =
  "font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--ink)] md:text-6xl";

export const sectionHeading =
  "font-display text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl";

export const card =
  "rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7 transition-colors hover:border-[var(--signal)]";

export const chip =
  "rounded-full border border-[var(--line)] px-3 py-1 font-mono text-xs text-[var(--slate)]";

export const buttonPrimary =
  "inline-flex items-center justify-center rounded-full bg-[var(--signal)] px-6 py-3 text-sm font-medium text-[var(--paper)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

export const buttonSecondary =
  "inline-flex items-center justify-center rounded-full border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)] disabled:cursor-not-allowed disabled:opacity-50";

export const buttonSmall =
  "inline-flex items-center justify-center rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)] disabled:cursor-not-allowed disabled:opacity-50";

export const input =
  "w-full rounded-md border border-[var(--field)] bg-[var(--paper)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--slate)] outline-none transition-colors focus:border-[var(--signal)]";

export const fieldLabel =
  "mb-1.5 block font-mono text-xs uppercase tracking-[0.15em] text-[var(--slate)]";

export const metaLine = "font-mono text-xs text-[var(--slate)]";

/**
 * A grid of post cards whose column count fills the rows (docs/brand-guide.md §8.2),
 * so a grid never leaves one card alone on a row when it can avoid it.
 */
export function cardGrid(count) {
  if (count === 4) return "grid gap-6 md:grid-cols-2 lg:grid-cols-4";
  if (count === 2) return "grid gap-6 md:grid-cols-2";
  return "grid gap-6 md:grid-cols-3";
}
