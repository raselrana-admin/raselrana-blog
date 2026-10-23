"use server";

import { ActionError, runAdminAction } from "@/lib/admin-action";
import { AuthzError, requireRole } from "@/lib/authz";
import { notifyOwner } from "@/lib/notify";
import { revalidatePath } from "next/cache";

const BACK = "/admin/system";
const MIN_GAP_MS = 30 * 1000;
let lastRun = 0; // per server instance; enough to stop repeated clicks

/**
 * "Check again" (CheckAgainButton, through useActionState): runs the checks again by
 * re-rendering the page. At most once per 30 seconds, so the services the checks
 * call are not hammered. Returns `{ ok, at }` or `{ error }`.
 */
export async function recheckSystemAction() {
  try {
    await requireRole("ADMIN");
  } catch (error) {
    if (error instanceof AuthzError) return { error: "Please sign in again." };
    throw error;
  }

  const now = Date.now();
  if (now - lastRun < MIN_GAP_MS) {
    return { error: "The checks ran less than 30 seconds ago. Please wait a moment." };
  }
  lastRun = now;
  revalidatePath(BACK);
  return { ok: true, at: now };
}

// Sends one notification through the same path as the site switch, so a delivered
// email proves the whole chain (key, sender, domain) works.
export async function sendTestEmailAction() {
  await runAdminAction({
    back: BACK,
    done: "Test email sent",
    work: async (user) => {
      const sent = await notifyOwner({
        to: user.email,
        subject: "Test: blog notifications work",
        text: [
          "This is a test from the blog admin (System → Send test email).",
          "",
          `Requested by: ${user.name} (${user.email})`,
          "",
          "When the site is switched live or back to under development, an email like this tells you who changed it and when. Nothing was changed.",
        ].join("\n"),
      });
      if (!sent) {
        throw new ActionError(
          "The test email was not sent. Check RESEND_API_KEY and NOTIFY_EMAIL_FROM, and that the sender's domain is verified in Resend.",
        );
      }
    },
  });
}
