"use server";

import { ActionError, runAdminAction } from "@/lib/admin-action";
import { notifyOwner } from "@/lib/notify";

// Sends one notification through the same path as the site switch, so a delivered
// email proves the whole chain (key, sender, domain) works.
export async function sendTestEmailAction() {
  await runAdminAction({
    back: "/admin/system",
    done: "Test email accepted by Resend. Check the inbox it was sent to.",
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
