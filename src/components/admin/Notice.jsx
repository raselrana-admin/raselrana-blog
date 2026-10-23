/**
 * Result of the last form action (`readNotice()` in src/lib/admin-action.js).
 * An error stays on the page (role="alert"). A success is a pop-up (NoticeToast in
 * the panel layout); this inline copy is only for visitors without JavaScript.
 */
export default function Notice({ notice }) {
  if (!notice) return null;

  if (notice.kind === "error") {
    return (
      <p
        role="alert"
        className="mt-6 rounded-lg border border-[var(--danger)] px-4 py-3 text-sm text-[var(--danger)]"
      >
        {notice.text}
      </p>
    );
  }

  return (
    <noscript>
      <p
        role="status"
        className="mt-6 rounded-lg border border-[var(--signal)] px-4 py-3 text-sm text-[var(--ink)]"
      >
        {notice.text}
      </p>
    </noscript>
  );
}
