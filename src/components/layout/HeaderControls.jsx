"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarsIcon } from "./header-icons";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";
import ToolsMenu from "./ToolsMenu";
import { useIsMounted } from "@/lib/use-is-mounted";

/**
 * The right side of the header (docs/brand-guide.md §6): the blog's links and
 * the theme button on wide screens, the theme and menu buttons on phones.
 * `links` are [{ label, href, zone? }], written without /blog; a `zone` link (Tools)
 * belongs to another app and is drawn by ToolsMenu with plain <a> links.
 * `tools` is the menu from the tools API (src/lib/tools.js; [] when it is down).
 *
 * Until JavaScript runs the menu button is a plain link to the footer, which
 * lists the same pages, so the phone menu still leads somewhere without it.
 */
export default function HeaderControls({ links, tools = [] }) {
  const mounted = useIsMounted();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  // Close the menu when the page changes, without an effect
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <div className="flex shrink-0 items-center gap-2.5 md:gap-7">
      <nav aria-label="Blog" className="hidden md:block">
        <ul className="flex items-center gap-7">
          {links.map((link) => {
            if (link.zone) {
              return (
                <li key={link.href}>
                  <ToolsMenu menu={tools} />
                </li>
              );
            }
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-medium transition-colors hover:text-[var(--ink)] ${
                    active ? "text-[var(--ink)]" : "text-[var(--slate)]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <ThemeToggle className="hc-btn-sm" />

      <div className="md:hidden">
        {mounted ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="hc-btn hc-btn-sm hc-menu"
          >
            <BarsIcon />
          </button>
        ) : (
          <a href="#site-footer" aria-label="Menu" className="hc-btn hc-btn-sm hc-menu">
            <BarsIcon />
          </a>
        )}
      </div>

      {open && <MobileMenu links={links} tools={tools} pathname={pathname} onClose={() => setOpen(false)} />}
    </div>
  );
}
