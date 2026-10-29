import { categoryPath } from "@/lib/posts";
import { getCategories } from "@/services/posts/queries";
import Link from "next/link";

const link =
  "block whitespace-nowrap py-3 text-sm text-[var(--slate)] transition-colors hover:text-[var(--ink)]";

/**
 * The categories in their admin order, under the top bar. The top bar itself stays
 * as docs/design-brief.md describes it; this row scrolls sideways on phones,
 * without a visible scrollbar.
 */
export default async function CategoryBar() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <nav
      aria-label="Categories"
      className="border-b border-[var(--line)] bg-[var(--paper)]"
    >
      <ul className="no-scrollbar mx-auto flex max-w-6xl items-center gap-x-7 overflow-x-auto overflow-y-hidden px-6">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={categoryPath(category.slug)} className={link}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
