// The state of one check as a word plus a mark, never colour alone (WCAG 1.4.1).
// Teal (--pulse) is the brand's success colour; a warning is navy, a problem --danger.
const STYLES = {
  ok: { label: "Working", className: "border-[var(--pulse)] text-[var(--pulse)]", mark: "✓" },
  warn: { label: "Check", className: "border-[var(--ink)] text-[var(--ink)]", mark: "!" },
  error: { label: "Problem", className: "border-[var(--danger)] text-[var(--danger)]", mark: "✕" },
};

export default function StateMark({ state }) {
  const style = STYLES[state] ?? STYLES.error;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs ${style.className}`}
    >
      <span aria-hidden>{style.mark}</span>
      {style.label}
    </span>
  );
}
