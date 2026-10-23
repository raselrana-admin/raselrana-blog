import { contentTypeByValue } from "@/lib/content-types";
import { formatDate, postDate } from "@/lib/posts";
import { blogShareImage, shareImage } from "@/lib/share-image";
import { isSiteLive } from "@/lib/site-status";
import { getLivePostBySlug } from "@/services/posts/queries";

/**
 * Public: the link-preview picture of a post that has no cover or share image
 * of its own. Only live posts; while the blog is under development every post gets
 * the blog's picture, so nothing unpublished leaks through it.
 */
export async function GET(request, { params }) {
  // Before the post lookup, so it does not tell which addresses exist either.
  if (!(await isSiteLive())) return blogShareImage();

  const { slug } = await params;
  const post = await getLivePostBySlug(slug);
  if (!post) return new Response("Not found", { status: 404 });

  const type = contentTypeByValue(post.contentType);
  return shareImage({
    kicker: [post.category?.name, type?.label].filter(Boolean).join(" · "),
    title: post.title,
    footer: `${formatDate(postDate(post))} · ${post.readingTime} min read · raselrana.com.bd/blog`,
  });
}
