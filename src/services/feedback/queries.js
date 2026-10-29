import { prisma } from "@/lib/prisma";

// Reader feedback: reads (PostStats) and "Was this helpful?" votes (PostVote).
// Totals are counted from the votes themselves, so there is one source of truth.

/** The anonymous reader id cookie; set the first time someone votes. */
export const READER_COOKIE = "blog_reader";

const EMPTY = { reads: 0, likes: 0, dislikes: 0 };

/** Reads, likes and dislikes of one post, plus this reader's vote (`null` if none). */
export async function getPostFeedback(postId, readerId) {
  const [stats, votes, mine] = await Promise.all([
    prisma.postStats.findUnique({ where: { postId }, select: { reads: true } }),
    prisma.postVote.groupBy({
      by: ["value"],
      where: { postId },
      _count: { _all: true },
    }),
    readerId
      ? prisma.postVote.findUnique({
          where: { postId_readerId: { postId, readerId } },
          select: { value: true },
        })
      : null,
  ]);

  const count = (value) =>
    votes.find((row) => row.value === value)?._count._all ?? 0;

  return {
    reads: stats?.reads ?? 0,
    likes: count("LIKE"),
    dislikes: count("DISLIKE"),
    myVote: mine?.value ?? null,
  };
}

/**
 * Feedback for many posts at once, for the admin lists: a Map from post id to
 * `{ reads, likes, dislikes }`. Posts without any feedback are not in the map;
 * read them through `feedbackOf()`.
 */
export async function getFeedbackByPost(postIds) {
  const [stats, votes] = await Promise.all([
    prisma.postStats.findMany({
      where: { postId: { in: postIds } },
      select: { postId: true, reads: true },
    }),
    prisma.postVote.groupBy({
      by: ["postId", "value"],
      where: { postId: { in: postIds } },
      _count: { _all: true },
    }),
  ]);

  const map = new Map();
  const entry = (postId) => {
    if (!map.has(postId)) map.set(postId, { ...EMPTY });
    return map.get(postId);
  };
  for (const row of stats) entry(row.postId).reads = row.reads;
  for (const row of votes) {
    entry(row.postId)[row.value === "LIKE" ? "likes" : "dislikes"] =
      row._count._all;
  }
  return map;
}

export function feedbackOf(map, postId) {
  return map.get(postId) ?? EMPTY;
}

/** Totals across every post, for the Overview. */
export async function getFeedbackTotals() {
  const [reads, votes] = await Promise.all([
    prisma.postStats.aggregate({ _sum: { reads: true } }),
    prisma.postVote.groupBy({ by: ["value"], _count: { _all: true } }),
  ]);
  const count = (value) =>
    votes.find((row) => row.value === value)?._count._all ?? 0;

  return {
    reads: reads._sum.reads ?? 0,
    likes: count("LIKE"),
    dislikes: count("DISLIKE"),
  };
}

/** The most read posts with their feedback, for the Overview. */
export async function getMostReadPosts(limit = 5) {
  const top = await prisma.postStats.findMany({
    where: { reads: { gt: 0 } },
    orderBy: { reads: "desc" },
    take: limit,
    select: { postId: true },
  });
  if (top.length === 0) return [];

  const ids = top.map((row) => row.postId);
  const [posts, feedback] = await Promise.all([
    prisma.post.findMany({
      where: { id: { in: ids } },
      select: { id: true, title: true, status: true, publishedAt: true },
    }),
    getFeedbackByPost(ids),
  ]);

  // findMany does not keep the order of `in`; put them back in reads order.
  return ids
    .map((id) => posts.find((post) => post.id === id))
    .filter(Boolean)
    .map((post) => ({ ...post, feedback: feedbackOf(feedback, post.id) }));
}
