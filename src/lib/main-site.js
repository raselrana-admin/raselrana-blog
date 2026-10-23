/**
 * Server only. Who is signed in to the main site's dashboard (docs/blog-admin-handover.md §3).
 *
 * The browser sends the main site's `admin_session` cookie with every /blog request
 * (same domain, Path=/). The blog cannot check it: it is signed with a secret only
 * the main site has. So the value is passed on to the main site, which answers
 * whether it is a genuine, current session. Never log, store or return the value,
 * and never name a blog cookie `admin_session`.
 */

export const MAIN_SITE_COOKIE = "admin_session";

const TIMEOUT_MS = 5000;

/** The `admin_session` value from a raw Cookie header, or `null`. */
export function readMainSiteCookie(cookieHeader) {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    if (part.slice(0, index).trim() === MAIN_SITE_COOKIE) {
      return part.slice(index + 1).trim() || null;
    }
  }
  return null;
}

/**
 * `{ email, name }` of the main site's signed-in owner for this cookie value, or
 * `null`. Anything but a 200 with a string email counts as signed out: no cookie,
 * a forged or expired one, MAIN_SITE_URL unset, a timeout, a 5xx, odd JSON.
 */
export async function getMainSiteOwner(cookieValue) {
  const base = process.env.MAIN_SITE_URL;
  if (!cookieValue || !base) return null;

  try {
    const res = await fetch(new URL("/api/admin/session", base), {
      headers: { cookie: `${MAIN_SITE_COOKIE}=${cookieValue}` },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status !== 200) return null;

    const body = await res.json();
    if (typeof body?.email !== "string" || !body.email.trim()) return null;
    return {
      email: body.email.trim().toLowerCase(),
      name: typeof body.name === "string" && body.name.trim() ? body.name.trim() : null,
    };
  } catch {
    // Network error or timeout: treated as signed out. The cookie is not logged.
    return null;
  }
}
