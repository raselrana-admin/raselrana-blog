import { delayText } from "@/lib/site-status";
import { buttonPrimary } from "@/lib/ui";
import { setSiteLiveAction } from "./actions";

const dangerButton =
  "inline-flex items-center justify-center rounded-full bg-[var(--danger)] px-6 py-3 text-sm font-medium text-[var(--paper)] transition-opacity hover:opacity-90";

/**
 * The warning shown before the switch changes, in the direction being switched,
 * with the confirm form. Used inside the dialog and on the no-JavaScript confirm
 * step; `cancel` is the way out that fits each (close the dialog, or a link back).
 */
export default function SwitchWarning({ goLive, counts, message, cancel, titleId }) {
  return (
    <div>
      <h2 id={titleId} className="font-display text-xl font-medium text-[var(--ink)]">
        {goLive ? "Make the site live?" : "Switch the site to under development?"}
      </h2>

      {goLive ? (
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--slate)]">
          <p>
            Visitors will see the blog {delayText(true)}. Every published
            post becomes public, the main site&apos;s home page starts showing your newest
            posts, and the sitemap fills.
          </p>
          <p className="text-[var(--ink)]">
            {counts.PUBLISHED} published, {counts.SCHEDULED} scheduled, {counts.DRAFT} drafts.
            Check that only finished posts are published.
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--slate)]">
          <p>
            {delayText(false)[0].toUpperCase()}{delayText(false).slice(1)} visitors will see the
            under-development page instead of the blog. Links people have shared will show that
            page, and the main site&apos;s home page stops showing your posts.
          </p>
          <p>
            They will read:{" "}
            {message ? (
              <span className="whitespace-pre-line text-[var(--ink)]">“{message}”</span>
            ) : (
              <span className="text-[var(--ink)]">the standard text</span>
            )}
            .
          </p>
          <p className="text-[var(--ink)]">
            You and other signed-in blog users still see the blog, with a banner. The admin keeps
            working, and nothing is deleted.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        {cancel}
        <form action={setSiteLiveAction}>
          <input type="hidden" name="live" value={goLive ? "true" : "false"} />
          <button type="submit" className={goLive ? buttonPrimary : dangerButton}>
            {goLive ? "Yes, make it live" : "Yes, switch it off"}
          </button>
        </form>
      </div>
    </div>
  );
}
