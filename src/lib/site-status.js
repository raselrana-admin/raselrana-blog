import { revalidatePath } from "next/cache";
import { formatDateTime } from "./posts";
import { notifyOwner } from "./notify";
import { prisma } from "./prisma";

/**
 * Server only. The "Site live" switch and the message visitors see (admin → Site).
 *
 * Off: visitors to the production deployment see the under-development page (rewrite
 * with status 503 in src/proxy.js), /api/posts returns no posts, the sitemap is empty
 * and share images show the blog picture. Signed-in blog users still see the blog,
 * with a banner. /admin and /preview keep working.
 * On: the blog is public. Local runs and preview deployments always show the blog.
 *
 * Each server instance (and each bundle in it: the proxy has its own copy) asks the
 * database at most once per LIVE_CHECK_MINUTES while live and once per
 * OFF_CHECK_MINUTES while off, not on every page view: switching off reaches every
 * visitor within 10 minutes, switching back on within a minute. No row yet, or a
 * database error, means not live: an unfinished site is never shown by accident.
 */

export const LIVE_CHECK_MINUTES = 10;
export const OFF_CHECK_MINUTES = 1;
const RETRY_AFTER_ERROR_MS = 60 * 1000;
const ttlFor = (live) => (live ? LIVE_CHECK_MINUTES : OFF_CHECK_MINUTES) * 60 * 1000;

/** How long until visitors see a switch, in words ("within 10 minutes"). */
export function delayText(goingLive) {
  return goingLive
    ? `within ${OFF_CHECK_MINUTES === 1 ? "a minute" : `${OFF_CHECK_MINUTES} minutes`}`
    : `within ${LIVE_CHECK_MINUTES} minutes`;
}

export const MESSAGE_MAX_LENGTH = 400;

// What the under-development page says when no message is saved: before the first
// launch, and after the blog has been live (src/app/coming-soon/page.jsx).
export const STANDARD_TEXT = {
  comingSoon:
    "I am preparing this blog. Explainers, how-to guides and troubleshooting notes on telecommunications, fiber networks and electrical engineering will be published here soon.",
  backSoon:
    "The blog is being updated and will be back shortly. Thank you for your patience.",
};
const MESSAGE_ID = "under-development";

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
    cached = { live, expires: Date.now() + ttlFor(live) };
  } catch (error) {
    console.error("Site status check failed; showing the under-development page:", error?.name);
    cached = { live: false, expires: Date.now() + RETRY_AFTER_ERROR_MS };
  }
  return cached.live;
}

/**
 * The current state straight from the database, for the admin pages (no cache).
 * `everLive`: whether the blog has ever been switched live (the visitor page then
 * says "Back soon" instead of "Coming soon").
 */
export async function getSiteStatus() {
  const [latest, history, firstLive] = await Promise.all([
    prisma.siteStatusChange.findFirst({ orderBy: { changedAt: "desc" } }),
    prisma.siteStatusChange.findMany({ orderBy: { changedAt: "desc" }, take: 10 }),
    prisma.siteStatusChange.findFirst({ where: { live: true }, select: { id: true } }),
  ]);
  return {
    live: latest?.live === true,
    everLive: Boolean(firstLive),
    latest,
    history,
    usesSwitch: usesSwitch(),
  };
}

/** Whether the blog was ever switched live (one small read). Never throws: false on error. */
export async function hasEverBeenLive() {
  try {
    return Boolean(
      await prisma.siteStatusChange.findFirst({ where: { live: true }, select: { id: true } }),
    );
  } catch {
    return false;
  }
}

/** `{ text, updatedAt, userName }` of the message for visitors, or `null`. Never throws. */
export async function getSiteMessage() {
  try {
    const message = await prisma.siteMessage.findUnique({ where: { id: MESSAGE_ID } });
    return message ? { text: message.text, updatedAt: message.updatedAt, userName: message.userName } : null;
  } catch (error) {
    console.error("Reading the visitor message failed:", error?.name);
    return null;
  }
}

/** Saves the message as `user`; "" goes back to the standard text. The caller checks the role. */
export async function setSiteMessage(user, text) {
  const clean = String(text ?? "").replace(/\r\n/g, "\n").trim();
  if (clean.length > MESSAGE_MAX_LENGTH) {
    throw new Error(`The message must be ${MESSAGE_MAX_LENGTH} characters or fewer`);
  }
  await prisma.siteMessage.upsert({
    where: { id: MESSAGE_ID },
    create: { id: MESSAGE_ID, text: clean, userName: user.name },
    update: { text: clean, userName: user.name },
  });
  return clean;
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
  // separately and keeps its own, so visitors see the change once that expires.
  cached = { live, expires: Date.now() + ttlFor(live) };
  revalidatePath("/sitemap.xml");

  const message = live ? null : (await getSiteMessage())?.text;
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
        ? `Visitors see the blog ${delayText(true)}.`
        : `${delayText(false)[0].toUpperCase()}${delayText(false).slice(1)} visitors see the under-development page instead. Signed-in blog users still see the blog.`,
      ...(live ? [] : ["", `Message shown to visitors: ${message || "(the standard text)"}`]),
      "",
      "If this was not you, sign in to the website dashboard, open Apps → Blog admin → Site and switch it back.",
    ].join("\n"),
  });

  return { changed: true, emailed };
}
