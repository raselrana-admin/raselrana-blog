import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/posts";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

/**
 * Makes the main site's signed-in owner the blog's one SUPER_ADMIN
 * (docs/blog-admin-handover.md §6). Only the "main-site" sign-in calls this.
 *
 * - An existing account with that email is upgraded, so its posts stay linked;
 *   its name and username are kept (they may have been edited in the profile).
 * - Otherwise a new account is made with a password nobody knows, so it can only
 *   be entered through the main site.
 * - Any other SUPER_ADMIN (an old owner email) goes back to ADMIN.
 */
export async function upsertSuperAdmin({ email, name }) {
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: { role: "SUPER_ADMIN", isActive: true },
      })
    : await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          username: await freeUsername(email.split("@")[0]),
          passwordHash: await bcrypt.hash(randomBytes(32).toString("hex"), 12),
          role: "SUPER_ADMIN",
        },
      });

  await prisma.user.updateMany({
    where: { role: "SUPER_ADMIN", id: { not: user.id } },
    data: { role: "ADMIN" },
  });

  return user;
}

/** `base`, or `base-2`, `base-3`… whichever is not taken. */
async function freeUsername(base) {
  const root = slugify(base) || "owner";
  for (let n = 1; ; n += 1) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    const taken = await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } });
    if (!taken) return candidate;
  }
}
