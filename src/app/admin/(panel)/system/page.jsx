import Notice from "@/components/admin/Notice";
import { readNotice } from "@/lib/admin-action";
import { getCurrentUser, isAdmin } from "@/lib/authz";
import { formatDateTime } from "@/lib/posts";
import { runSystemChecks, systemVersions } from "@/lib/system-status";
import { buttonPrimary, buttonSecondary, metaLine } from "@/lib/ui";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sendTestEmailAction } from "./actions";
import StateMark from "./StateMark";

export const metadata = { title: "System" };

/** Live checks of the services the blog depends on (src/lib/system-status.js). */
export default async function SystemPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!isAdmin(user)) notFound();

  const params = await searchParams;
  const [{ checks, checkedAt }, versions] = await Promise.all([
    runSystemChecks(),
    systemVersions(),
  ]);
  const problems = checks.filter((check) => check.state === "error").length;
  const warnings = checks.filter((check) => check.state === "warn").length;

  const headline =
    problems > 0
      ? `${problems} ${problems === 1 ? "problem" : "problems"}`
      : warnings > 0
        ? `Working, ${warnings} to check`
        : "All systems working";

  return (
    <>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--ink)]">
        System
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--slate)]">
        Whether everything the blog depends on is working, checked live each time this
        page opens.
      </p>

      <Notice notice={readNotice(params)} />

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">{headline}</h2>
            <p className={`${metaLine} mt-1`}>Checked {formatDateTime(checkedAt)}</p>
          </div>
          <Link href="/admin/system" className={buttonSecondary} prefetch={false}>
            Check again
          </Link>
        </div>

        <ul className="mt-6 divide-y divide-[var(--line)]">
          {checks.map((check) => (
            <li key={check.id} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 py-4">
              <div className="min-w-0">
                <p className="font-medium text-[var(--ink)]">{check.name}</p>
                <p className="mt-0.5 text-sm text-[var(--slate)]">{check.summary}</p>
                {check.detail && (
                  <p className={`${metaLine} mt-1 break-words`}>{check.detail}</p>
                )}
              </div>
              <StateMark state={check.state} />
            </li>
          ))}
        </ul>

        <p className={`${metaLine} mt-4 border-t border-[var(--line)] pt-4`}>
          Blog {versions.app} · Next.js {versions.next} · Node {versions.node} · {versions.environment}
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
        <h2 className="mb-2 font-display text-xl font-medium text-[var(--ink)]">Email delivery</h2>
        <p className="mb-5 max-w-2xl text-sm text-[var(--slate)]">
          The check above proves Resend accepts the key. To prove an email actually
          arrives, send one test notification to {process.env.NOTIFY_EMAIL_TO ? "the notification address" : user.email}.
        </p>
        <form action={sendTestEmailAction}>
          <button type="submit" className={`${buttonPrimary} px-5 py-2.5`}>
            Send test email
          </button>
        </form>
      </section>
    </>
  );
}
