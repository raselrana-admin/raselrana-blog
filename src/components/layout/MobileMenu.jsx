"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import BrandLogo from "@/components/brand/BrandLogo";
import MainSiteLink from "@/components/layout/MainSiteLink";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useDialogFocus } from "@/lib/use-dialog-focus";
import { useIsMounted } from "@/lib/use-is-mounted";
import { ArrowIcon, ChevronIcon, CloseIcon, SignalArcs } from "./header-icons";

const CONTACT_EMAIL = "contact@raselrana.com.bd";

/**
 * The full-screen phone menu (styles: .hc-* in globals.css). Rendered into
 * <body>: the sticky header has a backdrop blur, which would otherwise make
 * this fixed panel position itself against the header instead of the screen.
 * useDialogFocus moves focus in, keeps Tab inside, closes on Escape and
 * returns focus to the menu button; the header also closes it on a route change.
 * `links` are the blog's links: [{ label, href, zone? }]; a `zone` link (Tools) is another
 * app, so a plain <a>. `tools` (from the tools API) adds a Tools section of plain links.
 */
export default function MobileMenu({ links, tools = [], pathname, onClose }) {
  const mounted = useIsMounted();
  const panelRef = useRef(null);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  useDialogFocus(panelRef, onClose, mounted);

  // The page behind does not scroll while the menu is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="hc-panel md:hidden" /* use the same breakpoint as the header */
    >
      {/* Same row as the header (logo, 32px buttons, height, padding), so
          opening the menu does not move or resize anything at the top */}
      <div className="hc-panel-head">
        <MainSiteLink href="/" aria-label="Rasel Rana — main site" className="flex shrink-0 items-center">
          <BrandLogo height={32} />
        </MainSiteLink>
        <div className="flex shrink-0 items-center gap-2.5">
          <ThemeToggle className="hc-btn-sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            aria-expanded="true"
            aria-controls="mobile-menu"
            className="hc-btn hc-btn-sm hc-menu"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <nav aria-label="Blog" className="hc-nav">
        <div className="flex items-center justify-between px-3.5 pb-2.5">
          <span className="hc-eyebrow">Menu</span>
          <SignalArcs />
        </div>
        {links.map((link, i) => {
          if (link.zone) {
            return (
              <MainSiteLink key={link.href} href={link.href} className="hc-link">
                <span className="hc-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">{link.label}</span>
                <ChevronIcon />
              </MainSiteLink>
            );
          }
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className="hc-link"
            >
              <span className="hc-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1">{link.label}</span>
              <ChevronIcon />
            </Link>
          );
        })}

        {tools.length > 0 && (
          <div className="mt-4 border-t border-[var(--hc-border)] pt-4">
            <p className="hc-eyebrow px-3.5 pb-1.5">Tools</p>
            <ul>
              {tools.flatMap((category) =>
                category.items.map((tool) => (
                  <li key={tool.url}>
                    <a href={tool.url} className="hc-link text-base font-medium">
                      <span className="flex-1">{tool.title}</span>
                      <ChevronIcon />
                    </a>
                  </li>
                )),
              )}
            </ul>
          </div>
        )}
      </nav>

      <div className="hc-foot">
        <div className="flex items-center justify-between gap-4">
          <span className="hc-eyebrow">Appearance</span>
          <div className="hc-seg" role="group" aria-label="Theme">
            <button type="button" aria-pressed={!isDark} onClick={() => setTheme("light")}>
              Light
            </button>
            <button type="button" aria-pressed={isDark} onClick={() => setTheme("dark")}>
              Dark
            </button>
          </div>
        </div>
        {/* The main site's contact page (another app, so a plain <a>) */}
        <MainSiteLink className="hc-cta" href="/contact">
          Get in touch
          <ArrowIcon />
        </MainSiteLink>
        <p className="hc-email">{CONTACT_EMAIL}</p>
      </div>
    </div>,
    document.body,
  );
}
