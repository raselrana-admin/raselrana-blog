import Notice from "@/components/admin/Notice";
import { readNotice } from "@/lib/admin-action";
import { getCurrentUser, isAdmin } from "@/lib/authz";
import { formatDateTime } from "@/lib/posts";
import { runSystemChecks, systemVersions } from "@/lib/system-status";
import { buttonPrimary, metaLine } from "@/lib/ui";
import { notFound } from "next/navigation";
import { sendTestEmailAction } from "./actions";
import CheckAgainButton from "./CheckAgainButton";
import StateMark from "./StateMark";

export const metadata = { title: "System" };

/** Live checks of the services the blog depends on (src/lib/system-status.js), one card each. */
export default async function SystemPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!isAdmin(user)) notFound();

  const params = await searchParams;
  const { checks, checkedAt } = await runSystemChecks();
  const versions = systemVersions();
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--ink)]">
            System
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--slate)]">
            Whether everything the blog depends on is working.
          </p>
        </div>
        <CheckAgainButton />
      </div>

      <Notice notice={readNotice(params)} />

      <h2 className="mt-8 font-display text-2xl font-semibold text-[var(--ink)]">{headline}</h2>
      <p className={`${metaLine} mt-1`}>Checked {formatDateTime(checkedAt)}</p>

      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {checks.map((check) => (
          <li
            key={check.id}
            className="flex flex-col gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium text-[var(--ink)]">{check.name}</h3>
              <StateMark state={check.state} />
            </div>
            <p className="text-sm leading-relaxed text-[var(--slate)]">{check.summary}</p>
            {check.detail && <p className={`${metaLine} break-words`}>{check.detail}</p>}
            {check.ms != null && <p className={metaLine}>{check.ms} ms</p>}
          </li>
        ))}
      </ul>

      <p className={`${metaLine} mt-4`}>
        Blog {versions.app} · Next.js {versions.next} · Node {versions.node} · {versions.environment}
      </p>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
        <h2 className="mb-2 font-display text-xl font-medium text-[var(--ink)]">Email delivery</h2>
        <p className="mb-5 max-w-2xl text-sm text-[var(--slate)]">
          The email card proves Resend accepts the key. To prove an email actually arrives, send
          one test notification to{" "}
          {process.env.NOTIFY_EMAIL_TO ? "the notification address" : user.email}.
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
