"use server";

import { runAdminAction } from "@/lib/admin-action";
import { setSiteLive } from "@/lib/site-status";
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
        ? "The site is live. Visitors see the blog within 10 minutes."
        : "The site is under development. Visitors see that page within 10 minutes.";
      if (!emailed) message += " The email notification was not sent (check the email settings).";
    },
  });
}
