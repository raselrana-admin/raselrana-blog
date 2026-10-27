"use client";

import MainSiteLink from "@/components/layout/MainSiteLink";
import { useIsMounted } from "@/lib/use-is-mounted";
import { useEffect, useId, useRef, useState } from "react";

const linkClass =
  "text-sm font-medium text-[var(--slate)] transition-colors hover:text-[var(--ink)]";

/**
 * "Tools" in the desktop header. The tools are another app (raselrana.com.bd/tools),
 * so every entry is a plain <a> (no /blog in front, a full page load).
 * With `menu` from the tools API it is a disclosure button opening a small panel:
 * All tools, then each category with its available tools. Closes on Escape (focus
 * back on the button), an outside click or Tab leaving it. Without JavaScript, or
 * when the API had nothing, it is a plain "Tools" link.
 */
export default function ToolsMenu({ menu }) {
  const mounted = useIsMounted();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted || menu.length === 0) {
    return (
      <MainSiteLink href="/tools" className={linkClass}>
        Tools
      </MainSiteLink>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      // Tab out of the menu closes it
      onBlur={(event) => {
        if (!wrapRef.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`${linkClass} inline-flex items-center gap-1 ${open ? "text-[var(--ink)]" : ""}`}
      >
        Tools
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 shadow-lg"
      >
        <MainSiteLink
          href="/tools"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--signal)]"
        >
          All tools
        </MainSiteLink>
        {menu.map((category) => (
          <div key={category.title} className="mt-1 border-t border-[var(--line)] pt-2">
            {category.url ? (
              <a
                href={category.url}
                className="block px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-[var(--slate)] transition-colors hover:text-[var(--ink)]"
              >
                {category.title}
              </a>
            ) : (
              <p className="px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-[var(--slate)]">
                {category.title}
              </p>
            )}
            <ul>
              {category.items.map((tool) => (
                <li key={tool.url}>
                  <a
                    href={tool.url}
                    className="block rounded-lg px-3 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--signal)]"
                  >
                    {tool.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
