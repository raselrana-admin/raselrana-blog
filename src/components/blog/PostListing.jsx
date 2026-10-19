import Pagination from "@/components/blog/Pagination";
import PostCard from "@/components/blog/PostCard";
import { cardGrid } from "@/lib/ui";

/**
 * A grid of post cards with paging, or `empty` when there is nothing to show.
 * `cardHeading` is the card title element (see PostCard).
 */
export default function PostListing({ posts, page, totalPages, hrefFor, empty, cardHeading }) {
  if (posts.length === 0) {
    return <p className="text-[var(--slate)]">{empty}</p>;
  }
  return (
    <>
      <div className={cardGrid(posts.length)}>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} heading={cardHeading} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
    </>
  );
}
