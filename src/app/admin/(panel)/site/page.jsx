import Notice from "@/components/admin/Notice";
import { readNotice } from "@/lib/admin-action";
import { getCurrentUser } from "@/lib/authz";
import { formatDateTime } from "@/lib/posts";
import { CHECK_EVERY_MINUTES, getSiteStatus } from "@/lib/site-status";
import { buttonPrimary, buttonSecondary, metaLine } from "@/lib/ui";
import { getPostCounts } from "@/services/posts/queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import SwitchDialog from "./SwitchDialog";
import SwitchWarning from "./SwitchWarning";

export const metadata = { title: "Site" };

// A plain link (the no-JavaScript confirm step) does not get the base path added.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const panel = "mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6";

/** The "Site live" switch (src/lib/site-status.js). Super admin only. */
export default async function SitePage({ searchParams }) {
  const user = await getCurrentUser();
  if (user?.role !== "SUPER_ADMIN") notFound();

  const params = await searchParams;
  const [status, counts] = await Promise.all([getSiteStatus(), getPostCounts()]);
  const goLive = !status.live;
  const confirming = params.confirm === "1";

  return (
    <>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--ink)]">
        Site
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--slate)]">
        Whether visitors see the blog or the under-development page. The admin and draft
        previews work either way.
      </p>

      <Notice notice={readNotice(params)} />

      <section className={panel} aria-labelledby="site-state">
        <h2 id="site-state" className="font-display text-2xl font-semibold text-[var(--ink)]">
          {status.live ? "The site is live" : "The site is under development"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">
          {status.live
            ? "Visitors see the blog."
            : "Visitors see the under-development page instead of the blog."}{" "}
          A change reaches every visitor within {CHECK_EVERY_MINUTES} minutes, and you get an
          email each time it is switched.
        </p>
        {status.latest && (
          <p className={`${metaLine} mt-3`}>
            Last changed {formatDateTime(status.latest.changedAt)} by {status.latest.userName}
          </p>
        )}
        {!status.usesSwitch && (
          <p className="mt-3 text-sm text-[var(--ink)]">
            This is not the production deployment, so this copy of the blog always shows the
            site. The switch still saves, and production follows it.
          </p>
        )}

        <div className="mt-6">
          {confirming ? (
            // Without JavaScript the button leads here: the same warning, as a page.
            <div className="rounded-2xl border border-[var(--field)] bg-[var(--paper)] p-6">
              <SwitchWarning
                goLive={goLive}
                counts={counts}
                titleId="switch-confirm-title"
                cancel={
                  <Link href="/admin/site" className={buttonSecondary}>
                    Cancel
                  </Link>
                }
              />
            </div>
          ) : (
            <SwitchDialog
              href={`${basePath}/admin/site?confirm=1`}
              label={goLive ? "Make the site live" : "Switch to under development"}
              className={goLive ? buttonPrimary : buttonSecondary}
              titleId="switch-dialog-title"
            >
              <SwitchWarning
                goLive={goLive}
                counts={counts}
                titleId="switch-dialog-title"
                cancel={
                  // Closes the dialog without JavaScript-side code; focused first.
                  <form method="dialog">
                    <button type="submit" autoFocus className={buttonSecondary}>
                      Cancel
                    </button>
                  </form>
                }
              />
            </SwitchDialog>
          )}
        </div>
      </section>

      <section className={panel} aria-labelledby="site-history">
        <h2 id="site-history" className="mb-4 font-display text-xl font-medium text-[var(--ink)]">
          Recent changes
        </h2>
        {status.history.length === 0 ? (
          <p className="text-sm text-[var(--slate)]">
            Not switched yet. Until it is, the site is under development.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {status.history.map((change) => (
              <li
                key={change.id}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 text-sm"
              >
                <span className="font-medium text-[var(--ink)]">
                  {change.live ? "Made live" : "Switched to under development"}
                </span>
                <span className={metaLine}>
                  {formatDateTime(change.changedAt)} · {change.userName}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
