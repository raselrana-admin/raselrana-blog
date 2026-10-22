import { SignalArcs } from "@/components/layout/header-icons";
import { contentTypeByValue } from "@/lib/content-types";
import { typePath } from "@/lib/posts";
import Link from "next/link";

// Most readers arrive with a fault to fix, so that door comes first.
const ORDER = ["TROUBLESHOOTING", "HOWTO", "EXPLAINER", "COMPARISON"];

/**
 * The way into the archive by what a reader needs, on the blog home.
 * A navy panel that stays dark in both themes (--inverse, docs/brand-guide.md §5);
 * its links are underlined on hover, not blue, because blue text fails contrast on navy.
 * `counts` is getContentTypeCounts(); types without posts are left out.
 */
export default function TypeIndex({ counts }) {
  const types = ORDER.map(contentTypeByValue).filter((type) => counts.get(type.value) > 0);
  if (types.length === 0) return null;

  return (
    <section
      aria-labelledby="type-index-title"
      className="on-inverse rounded-2xl bg-[var(--inverse)] p-7 text-[var(--on-inverse)]"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id="type-index-title" className="font-display text-xl font-semibold tracking-tight">
          Start from what you need
        </h2>
        <SignalArcs />
      </div>
      <ul className="mt-5">
        {types.map((type) => {
          const count = counts.get(type.value);
          return (
            <li key={type.value} className="border-t border-[var(--on-inverse)]/20 first:border-t-0">
              <Link
                href={typePath(type.slug)}
                className="group flex items-baseline justify-between gap-4 py-3.5"
              >
                <span>
                  <span className="block font-medium underline-offset-4 group-hover:underline">
                    {type.label}
                  </span>
                  <span className="mt-0.5 block text-sm opacity-75">{type.summary}</span>
                </span>
                <span className="shrink-0 font-mono text-xs opacity-75">
                  {count} {count === 1 ? "post" : "posts"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
