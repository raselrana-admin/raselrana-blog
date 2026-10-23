"use client";

import SignOutButton from "@/components/auth/sign-out-button";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { adminPageTitle } from "@/lib/admin-nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The bar across the top of the admin content, like the main site's dashboard:
 * the page title, then "Under development" (while the site is switched off), View
 * site, the theme and sign-out. `live` comes from isSiteLive() in the layout;
 * `canManageSite` links the pill to the Site page (super admin only).
 */
export default function AdminTopBar({ live, canManageSite }) {
  const pathname = usePathname();
  const pill =
    "shrink-0 rounded-full border border-[var(--danger)] px-3 py-1 text-xs font-medium text-[var(--danger)]";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--paper)]/90 px-6 backdrop-blur-sm lg:px-10">
      <p className="min-w-0 truncate font-display text-lg font-semibold text-[var(--ink)]">
        {adminPageTitle(pathname)}
      </p>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {!live &&
          (canManageSite ? (
            <Link href="/admin/site" className={`${pill} hover:bg-[var(--surface)]`}>
              Under development
            </Link>
          ) : (
            <span className={pill}>Under development</span>
          ))}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-sm font-medium text-[var(--slate)] transition-colors hover:text-[var(--ink)] sm:inline"
        >
          View site <span aria-hidden>↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </Link>
        <ThemeToggle className="h-9 w-9 rounded-lg" />
        <SignOutButton icon />
      </div>
    </header>
  );
}
