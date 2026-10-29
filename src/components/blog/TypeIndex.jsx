import { contentTypeByValue } from "@/lib/content-types";
import { typePath } from "@/lib/posts";
import Link from "next/link";

// Most readers arrive with a fault to fix, so that door comes first.
const ORDER = ["TROUBLESHOOTING", "HOWTO", "EXPLAINER", "COMPARISON"];

/**
 * The way into the archive by what a reader needs, on the blog home.
 * A navy panel that stays dark in both themes (--inverse, docs/brand-guide.md §5);
 * its links are underlined on hover, not blue, because blue text fails contrast on navy.
 * Each row leads with the need (the type's `summary`); the type name is the detail.
 * `counts` is getContentTypeCounts(); types without posts are left out.
 */
export default function TypeIndex({ counts }) {
  const types = ORDER.map(contentTypeByValue).filter((type) => counts.get(type.value) > 0);
  if (types.length === 0) return null;

  return (
    <section
      aria-labelledby="type-index-title"
      className="on-inverse rounded-2xl bg-[var(--inverse)] p-7 text-[var(--on-inverse)] md:p-8"
    >
      <h2
        id="type-index-title"
        className="font-display text-xl font-semibold leading-tight tracking-tight"
      >
        Start from what you need
      </h2>
      <p className="mt-2 text-sm leading-relaxed opacity-75">
        Posts grouped by the job they help with.
      </p>
      <ul className="mt-6 border-t border-[var(--on-inverse)]/20">
        {types.map((type) => {
          const count = counts.get(type.value);
          return (
            <li
              key={type.value}
              className="border-b border-[var(--on-inverse)]/20 last:border-b-0 [&:last-child>a]:pb-0"
            >
              <Link
                href={typePath(type.slug)}
                className="group flex items-start justify-between gap-6 py-4"
              >
                <span className="min-w-0">
                  <span className="block text-[1.0625rem] font-medium leading-snug underline-offset-4 group-hover:underline">
                    {type.summary}
                  </span>
                  <span className="mt-1 block text-[0.8125rem] leading-snug opacity-75">
                    {type.label}
                  </span>
                </span>
                <span className="shrink-0 pt-0.5 font-mono text-[0.8125rem] tabular-nums opacity-75">
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
