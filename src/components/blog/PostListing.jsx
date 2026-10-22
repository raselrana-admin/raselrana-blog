import Pagination from "@/components/blog/Pagination";
import PostRow from "@/components/blog/PostRow";

/**
 * A dated list of posts with paging, or `empty` when there is nothing to show.
 * `heading` is the post title element (see PostRow).
 */
export default function PostListing({ posts, page, totalPages, hrefFor, empty, heading }) {
  if (posts.length === 0) {
    return <p className="text-[var(--slate)]">{empty}</p>;
  }
  return (
    <>
      <ul>
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} heading={heading} />
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
    </>
  );
}
