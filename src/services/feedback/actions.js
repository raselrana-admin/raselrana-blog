"use server";

import { prisma } from "@/lib/prisma";
import { isSiteLive } from "@/lib/site-status";
import { livePostWhere } from "@/services/posts/queries";
import { cookies } from "next/headers";
import { z } from "zod";
import { getPostFeedback, READER_COOKIE } from "./queries";

// Called from public post pages, by anyone: no sign-in, so every input is
// validated and only live posts are touched. Neither action throws to the reader.

const slugSchema = z.string().min(1).max(200);
const voteSchema = z.object({
  slug: slugSchema,
  value: z.enum(["LIKE", "DISLIKE"]),
});

const READER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year

async function livePostId(slug) {
  const post = await prisma.post.findFirst({
    where: { AND: [livePostWhere(), { slug }] },
    select: { id: true },
  });
  return post?.id ?? null;
}

/**
 * One more read of a live post. The browser calls this once per page load, after
 * the page has been visible for a while (components/blog/ReadCounter.jsx).
 */
export async function recordRead(slug) {
  try {
    const parsed = slugSchema.safeParse(slug);
    if (!parsed.success) return;

    // While the site is switched off only signed-in previewers get here; skip them.
    if (process.env.VERCEL_ENV === "production" && !(await isSiteLive())) return;

    const postId = await livePostId(parsed.data);
    if (!postId) return;

    await prisma.postStats.upsert({
      where: { postId },
      create: { postId, reads: 1 },
      update: { reads: { increment: 1 } },
    });
  } catch (error) {
    console.error("recordRead failed:", error.message);
  }
}

/**
 * "Was this helpful?" (components/blog/PostFeedback.jsx, through useActionState).
 * The same button again takes the vote back; the other button changes it.
 * Returns the post's new counts and this reader's vote, or `previous` on failure.
 */
export async function votePost(previous, formData) {
  const parsed = voteSchema.safeParse({
    slug: formData.get("slug"),
    value: formData.get("value"),
  });
  if (!parsed.success) return previous;
  const { slug, value } = parsed.data;

  try {
    const postId = await livePostId(slug);
    if (!postId) return previous;

    const jar = await cookies();
    let readerId = jar.get(READER_COOKIE)?.value;
    if (!readerId || !/^[0-9a-f-]{36}$/.test(readerId)) {
      readerId = crypto.randomUUID();
      jar.set(READER_COOKIE, readerId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: process.env.NEXT_PUBLIC_BASE_PATH || "/blog",
        maxAge: READER_COOKIE_MAX_AGE,
      });
    }

    const key = { postId_readerId: { postId, readerId } };
    const existing = await prisma.postVote.findUnique({
      where: key,
      select: { value: true },
    });

    if (existing?.value === value) {
      await prisma.postVote.delete({ where: key });
    } else {
      await prisma.postVote.upsert({
        where: key,
        create: { postId, readerId, value },
        update: { value },
      });
    }

    return { ...(await getPostFeedback(postId, readerId)), voted: true };
  } catch (error) {
    // A double click can race two upserts into the unique index; the first one won.
    if (error.code !== "P2002" && error.code !== "P2025") {
      console.error("votePost failed:", error.message);
    }
    return previous;
  }
}
