"use client";

import { useToast } from "@/components/admin/Toast";
import { buttonSecondary } from "@/lib/ui";
import { useActionState, useEffect } from "react";
import { recheckSystemAction } from "./actions";

/**
 * Runs the System checks again. "Checking…" while it runs, then the pop-up "Checks
 * updated"; a refusal (pressed again within 30 seconds) shows under the button.
 * Without JavaScript the form still posts and the page comes back with fresh checks.
 */
export default function CheckAgainButton() {
  const [state, formAction, pending] = useActionState(recheckSystemAction, null);
  const toast = useToast();

  useEffect(() => {
    if (state?.ok) toast("Checks updated");
  }, [state?.ok, state?.at, toast]);

  return (
    <form action={formAction} className="flex flex-col items-start gap-2 sm:items-end">
      <button type="submit" disabled={pending} className={buttonSecondary}>
        {pending ? "Checking…" : "Check again"}
      </button>
      <p aria-live="polite" className="max-w-xs text-sm text-[var(--danger)] sm:text-right">
        {state?.error ?? ""}
      </p>
    </form>
  );
}
