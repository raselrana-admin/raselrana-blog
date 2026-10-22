import ListingHeader from "@/components/blog/ListingHeader";
import { tagPath } from "@/lib/posts";
import { container } from "@/lib/ui";
import { getTagCounts } from "@/services/posts/queries";
import Link from "next/link";

// Rebuilt at most every 5 minutes, so a scheduled post shows up by itself.
export const revalidate = 300;

export const metadata = {
  title: "Topics",
  description: "Every topic on Rasel Rana's blog, with the posts in each.",
};

export default async function TopicsPage() {
  const topics = await getTagCounts();

  return (
    <>
      <ListingHeader
        title="Topics"
        description="Every topic on the blog, with how many posts it has."
        count={topics.length}
        unit="topic"
      />

      <section className="border-t border-[var(--line)]">
        <div className={`${container} py-16 md:py-20`}>
          {topics.length === 0 ? (
            <p className="text-[var(--slate)]">No topics yet.</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map(({ name, slug, count }) => (
                <li key={slug}>
                  <Link
                    href={tagPath(slug)}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--signal)]"
                  >
                    <span className="font-display text-xl font-medium text-[var(--ink)] transition-colors group-hover:text-[var(--signal)]">
                      {name}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-[var(--slate)]">
                      {count} {count === 1 ? "post" : "posts"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
