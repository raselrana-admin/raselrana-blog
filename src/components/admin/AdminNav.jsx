"use client";

import { ADMIN_LINKS, isActiveLink } from "@/lib/admin-nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function NavList({ pathname, onNavigate, isSuperAdmin }) {
  return (
    <ul className="space-y-1">
      {ADMIN_LINKS.filter((link) => isSuperAdmin || !link.superAdmin).map((link) => {
        const active = isActiveLink(link, pathname);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--paper)] text-[var(--signal)]"
                  : "text-[var(--slate)] hover:bg-[var(--paper)] hover:text-[var(--ink)]"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Sidebar links: always open on wide screens, a collapsible menu on phones.
 * `isSuperAdmin` adds the links only the super admin may use (the pages check too).
 * "View site", the theme and sign-out live in the top bar (AdminTopBar).
 */
export default function AdminNav({ isSuperAdmin = false }) {
  const pathname = usePathname();
  const menuRef = useRef(null);

  const closeMenu = () => {
    if (menuRef.current) menuRef.current.open = false;
  };

  useEffect(closeMenu, [pathname]);

  return (
    <>
      <nav aria-label="Admin" className="hidden px-3 py-2 lg:block">
        <NavList pathname={pathname} isSuperAdmin={isSuperAdmin} />
      </nav>

      <details
        ref={menuRef}
        className="border-t border-[var(--line)] lg:hidden"
      >
        <summary className="cursor-pointer px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
          Menu
        </summary>
        <nav aria-label="Admin" className="px-3 pb-4">
          <NavList pathname={pathname} onNavigate={closeMenu} isSuperAdmin={isSuperAdmin} />
        </nav>
      </details>
    </>
  );
}
