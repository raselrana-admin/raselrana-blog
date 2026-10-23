import { cookies } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";
import { getMainSiteOwner, MAIN_SITE_COOKIE } from "./main-site";
import { prisma } from "./prisma";

// A higher rank can do everything a lower one can.
const RANK = { AUTHOR: 1, ADMIN: 2, SUPER_ADMIN: 3 };

/** ADMIN or SUPER_ADMIN: may publish, archive, delete drafts and manage taxonomy. */
export function isAdmin(user) {
  return (RANK[user?.role] ?? 0) >= RANK.ADMIN;
}

/** Thrown by the helpers below. `status` is the HTTP status to answer with. */
export class AuthzError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "AuthzError";
    this.status = status;
  }
}

/**
 * The signed-in user, read from the database (not from the session cookie), so a
 * changed role or a disabled account takes effect at once. `null` when signed out
 * or inactive. Cached for the length of one request.
 *
 * A SUPER_ADMIN is only signed in while the same person is signed in to the main
 * site's dashboard: signing out there, or changing the password, ends access here on
 * the next request (docs/blog-admin-handover.md §8).
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user?.isActive) return null;

  if (user.role === "SUPER_ADMIN") {
    const cookie = (await cookies()).get(MAIN_SITE_COOKIE)?.value;
    const owner = await getMainSiteOwner(cookie);
    if (!owner || owner.email !== user.email.toLowerCase()) return null;
  }

  return user;
});

/** Signed in and active, or throws AuthzError(401). */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new AuthzError(401, "Unauthorized");
  return user;
}

/**
 * Signed in with at least the given role, or throws AuthzError(401 / 403).
 * requireRole("ADMIN") also lets a SUPER_ADMIN through.
 */
export async function requireRole(role) {
  // A misspelled role would otherwise compare with undefined and let everyone in.
  if (!(role in RANK)) throw new Error(`Unknown role: ${role}`);
  const user = await requireUser();
  if ((RANK[user.role] ?? 0) < RANK[role]) throw new AuthzError(403, "Forbidden");
  return user;
}

/**
 * ADMIN and SUPER_ADMIN can edit any post. AUTHOR can edit only their own posts, and only while
 * the post is not published.
 */
export function canEditPost(user, post) {
  if (!user || !post) return false;
  if (isAdmin(user)) return true;
  return (
    user.role === "AUTHOR" &&
    post.authorId === user.id &&
    post.status !== "PUBLISHED"
  );
}

/** Only ADMIN and SUPER_ADMIN may publish, schedule or archive. */
export function canSetStatus(user, status) {
  return status === "DRAFT" || isAdmin(user);
}
