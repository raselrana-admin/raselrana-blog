import Pagination from "@/components/blog/Pagination";
import { FeatureCard } from "@/components/blog/PostCard";
import PostRow from "@/components/blog/PostRow";
import SearchForm from "@/components/blog/SearchForm";
import TagChip from "@/components/blog/TagChip";
import TypeIndex from "@/components/blog/TypeIndex";
import { container, pageHeading, sectionHeading } from "@/lib/ui";
import {
  getContentTypeCounts,
  getPublishedPosts,
  getTagCounts,
} from "@/services/posts/queries";
import Link from "next/link";

const MAX_TOPIC_CHIPS = 8;

function parsePage(value) {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

export default async function BlogHome({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";
  const page = parsePage(params.page);

  const [{ posts, total, totalPages }, topics, typeCounts] = await Promise.all([
    getPublishedPosts({ page, q }),
    getTagCounts(),
    getContentTypeCounts(),
  ]);

  // The newest post gets the large card, but only on the plain first page.
  const feature = !q && page === 1 ? posts[0] : null;
  const rest = feature ? posts.slice(1) : posts;

  const hrefFor = (n) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (n > 1) query.set("page", String(n));
    const text = query.toString();
    return text ? `/?${text}` : "/";
  };

  return (
    <>
      {/* Intro and search beside the way in by need (TypeIndex); stacked on phones. */}
      <section
        className={`${container} grid gap-12 py-14 md:py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-16`}
      >
        <div>
          <h1 className={`${pageHeading} rise max-w-4xl`}>
            Notes on telecom networks, power and engineering.
          </h1>
          <p
            className="rise mt-6 max-w-2xl text-base leading-relaxed text-[var(--slate)] md:text-xl"
            style={{ "--delay": "80ms" }}
          >
            Practical writing from day-to-day work on telecommunications
            infrastructure and the electrical systems behind it.
          </p>

          <div className="mt-10 space-y-6">
            <SearchForm defaultValue={q} />
            {topics.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {topics.slice(0, MAX_TOPIC_CHIPS).map((tag) => (
                  <TagChip key={tag.slug} tag={tag} count={tag.count} />
                ))}
                {topics.length > MAX_TOPIC_CHIPS && (
                  <Link
                    href="/tags"
                    className="px-2 font-mono text-xs text-[var(--signal)] underline underline-offset-4"
                  >
                    All topics
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {!q && (
          <div className="rise" style={{ "--delay": "240ms" }}>
            <TypeIndex counts={typeCounts} />
          </div>
        )}
      </section>

      <section className="border-t border-[var(--line)]">
        <div className={`${container} py-16 md:py-20`}>
          {q && (
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
              <h2 className={sectionHeading}>
                {total} {total === 1 ? "result" : "results"} for “{q}”
              </h2>
              <Link
                href="/"
                className="text-sm font-medium text-[var(--signal)] underline underline-offset-4"
              >
                Clear search
              </Link>
            </div>
          )}

          {posts.length === 0 ? (
            <p className="text-[var(--slate)]">
              {q
                ? "No posts match that search. Try a different word."
                : "No posts yet. The first one is on its way."}
            </p>
          ) : (
            <>
              {feature && <FeatureCard post={feature} />}
              {rest.length > 0 && (
                <ul className={feature ? "mt-10" : ""}>
                  {rest.map((post) => (
                    <PostRow
                      key={post.slug}
                      post={post}
                      heading={q ? "h3" : "h2"}
                    />
                  ))}
                </ul>
              )}
            </>
          )}

          <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
        </div>
      </section>
    </>
  );
}
