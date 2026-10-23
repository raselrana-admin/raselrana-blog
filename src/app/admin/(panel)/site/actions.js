"use server";

import { runAdminAction } from "@/lib/admin-action";
import { delayText, MESSAGE_MAX_LENGTH, setSiteLive, setSiteMessage } from "@/lib/site-status";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const BACK = "/admin/site";
const liveSchema = z.enum(["true", "false"], "Choose live or under development");

// Only the super admin may switch the site (docs/blog-admin-handover.md §5).
export async function setSiteLiveAction(formData) {
  let message = "";
  await runAdminAction({
    back: BACK,
    role: "SUPER_ADMIN",
    done: () => message,
    work: async (user) => {
      const live = liveSchema.parse(formData.get("live")) === "true";
      const { changed, emailed } = await setSiteLive(user, live);
      revalidatePath(BACK);

      if (!changed) {
        message = live ? "The site was already live." : "The site was already under development.";
        return;
      }
      message = live
        ? `The site is live. Visitors see the blog ${delayText(true)}.`
        : `The site is under development. Visitors see that page ${delayText(false)}.`;
      if (!emailed) message += " The email notification was not sent (check the email settings).";
    },
  });
}

const messageSchema = z
  .string("The message must be text")
  .transform((text) => text.replace(/\r\n/g, "\n").trim())
  .pipe(z.string().max(MESSAGE_MAX_LENGTH, `The message must be ${MESSAGE_MAX_LENGTH} characters or fewer`));

// The text visitors see while the site is off ("" = the standard text). Super admin only.
export async function setSiteMessageAction(formData) {
  await runAdminAction({
    back: BACK,
    role: "SUPER_ADMIN",
    done: "Message saved.",
    work: async (user) => {
      await setSiteMessage(user, messageSchema.parse(formData.get("message") ?? ""));
      revalidatePath(BACK);
    },
  });
}
