import { revalidatePath } from "next/cache";
import { formatDateTime } from "./posts";
import { notifyOwner } from "./notify";
import { prisma } from "./prisma";

/**
 * Server only. The "Site live" switch (admin → Site).
 *
 * Off: visitors to the production deployment see the under-development page
 * (rewrite in src/proxy.js), /api/posts returns no posts, the sitemap is empty and
 * share images show the blog picture. /admin and /preview keep working.
 * On: the blog is public. Local runs and preview deployments always show the blog.
 *
 * Each server instance (and each bundle in it: the proxy has its own copy) asks the
 * database at most once per CHECK_EVERY_MS, not on every page view, so a flip reaches
 * every visitor within that time. No row yet, or
 * a database error, means not live: an unfinished site is never shown by accident.
 */

export const CHECK_EVERY_MINUTES = 10;
const CHECK_EVERY_MS = CHECK_EVERY_MINUTES * 60 * 1000;
const RETRY_AFTER_ERROR_MS = 60 * 1000;

const usesSwitch = () => process.env.VERCEL_ENV === "production";

let cached = null; // { live, expires }

async function readLive() {
  const latest = await prisma.siteStatusChange.findFirst({
    orderBy: { changedAt: "desc" },
    select: { live: true },
  });
  return latest?.live === true;
}

/** Whether visitors see the blog. Cached per server instance (see above). */
export async function isSiteLive() {
  if (!usesSwitch()) return true;
  if (cached && cached.expires > Date.now()) return cached.live;

  try {
    const live = await readLive();
    cached = { live, expires: Date.now() + CHECK_EVERY_MS };
  } catch (error) {
    console.error("Site status check failed; showing the under-development page:", error?.name);
    cached = { live: false, expires: Date.now() + RETRY_AFTER_ERROR_MS };
  }
  return cached.live;
}

/** The current state straight from the database, for the admin page (no cache). */
export async function getSiteStatus() {
  const [latest, history] = await Promise.all([
    prisma.siteStatusChange.findFirst({ orderBy: { changedAt: "desc" } }),
    prisma.siteStatusChange.findMany({ orderBy: { changedAt: "desc" }, take: 10 }),
  ]);
  return { live: latest?.live === true, latest, history, usesSwitch: usesSwitch() };
}

/**
 * Flips the switch as `user` (the super admin; the caller checks the role).
 * Returns `{ changed, emailed }`. Nothing is written when the state is already `live`.
 */
export async function setSiteLive(user, live) {
  if ((await getSiteStatus()).live === live) return { changed: false, emailed: false };

  const change = await prisma.siteStatusChange.create({
    data: { live, userId: user.id, userName: user.name, userEmail: user.email },
  });

  // Only this module's copy of the cache. The proxy (src/proxy.js) is bundled
  // separately and keeps its own, so visitors see the change once that expires:
  // within CHECK_EVERY_MINUTES everywhere, including on this server.
  cached = { live, expires: Date.now() + CHECK_EVERY_MS };
  revalidatePath("/sitemap.xml");

  const when = formatDateTime(change.changedAt);
  const emailed = await notifyOwner({
    to: user.email,
    subject: live ? "The blog is now live" : "The blog is now under development",
    text: [
      live
        ? "The blog at raselrana.com.bd/blog was switched live."
        : "The blog at raselrana.com.bd/blog was switched to under development.",
      "",
      `Changed by: ${user.name} (${user.email})`,
      `When: ${when} (Dhaka time)`,
      "",
      live
        ? `Visitors see the blog within ${CHECK_EVERY_MINUTES} minutes.`
        : `Within ${CHECK_EVERY_MINUTES} minutes visitors see the under-development page instead.`,
      "If this was not you, sign in to the website dashboard, open Apps → Blog admin → Site and switch it back.",
    ].join("\n"),
  });

  return { changed: true, emailed };
}
