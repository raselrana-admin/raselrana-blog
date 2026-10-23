import { formatDate, postPath } from "@/lib/posts";
import { metaLine } from "@/lib/ui";
import Link from "next/link";

/**
 * One post in an archive list (home, category, topic, type, author, search):
 * date, title and excerpt, then category and reading time. The whole row is one
 * link. Denser than PostCard, which stays for the feature and related posts.
 * `heading` is the title element: h3 under a section heading, h2 when the page
 * h1 is the only heading above it.
 */
export default function PostRow({ post, heading: Heading = "h3" }) {
  const published = new Date(post.publishedAt);
  return (
    <li className="border-t border-[var(--line)] first:border-t-0">
      <Link
        href={postPath(post.slug)}
        className="group grid gap-x-8 gap-y-2 py-7 md:grid-cols-[8rem_minmax(0,1fr)_9rem]"
      >
        <p className={`${metaLine} md:pt-1.5`}>
          <time dateTime={published.toISOString()}>{formatDate(published)}</time>
        </p>
        <div className="min-w-0">
          <Heading className="font-display text-xl font-medium text-[var(--ink)] transition-colors group-hover:text-[var(--signal)]">
            {post.title}
          </Heading>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 max-w-[65ch] text-sm leading-relaxed text-[var(--slate)]">
              {post.excerpt}
            </p>
          )}
        </div>
        <p className={`${metaLine} md:pt-1.5 md:text-right`}>
          {post.category && <span className="md:block">{post.category.name}</span>}
          {post.category && <span aria-hidden className="md:hidden"> · </span>}
          <span className="md:block">{post.readingMinutes} min read</span>
        </p>
      </Link>
    </li>
  );
}
