import { runSystemChecks } from "@/lib/system-status";
import Link from "next/link";

const card = "rounded-2xl border bg-[var(--surface)] p-6";

/**
 * The System checks in one line, for the Overview. Rendered inside <Suspense> so
 * the Overview shows at once and this streams in when the checks finish.
 */
export default async function SystemSummary() {
  const { checks } = await runSystemChecks();
  const failing = checks.filter((check) => check.state === "error");
  const toCheck = checks.filter((check) => check.state === "warn");
  const ok = failing.length === 0;

  return (
    <section
      aria-labelledby="system-summary"
      className={`${card} ${ok ? "border-[var(--line)]" : "border-[var(--danger)]"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="system-summary" className="font-display text-lg font-medium text-[var(--ink)]">
            {ok ? "All systems working" : `${failing.length} ${failing.length === 1 ? "service has" : "services have"} a problem`}
          </h2>
          <p className="mt-1 text-sm text-[var(--slate)]">
            {ok
              ? toCheck.length > 0
                ? `To check: ${toCheck.map((check) => check.name).join(", ")}.`
                : "Database, image uploads, email, website sign-in and the public site."
              : failing.map((check) => `${check.name}: ${check.summary}`).join(" · ")}
          </p>
        </div>
        <Link
          href="/admin/system"
          className="text-sm font-medium text-[var(--signal)] underline underline-offset-4"
        >
          Open System
        </Link>
      </div>
    </section>
  );
}

/** Shown while the checks run. */
export function SystemSummaryLoading() {
  return (
    <section aria-busy="true" className={`${card} border-[var(--line)]`}>
      <p className="font-display text-lg font-medium text-[var(--ink)]">Checking services…</p>
      <p className="mt-1 text-sm text-[var(--slate)]">Database, image uploads, email and website sign-in.</p>
    </section>
  );
}
