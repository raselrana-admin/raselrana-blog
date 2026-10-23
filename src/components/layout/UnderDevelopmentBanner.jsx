"use client";

import { PREVIEW_COOKIE } from "@/lib/site-preview";
import Link from "next/link";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** "manage", "view" or null, from the cookie the proxy sets for signed-in users. */
function previewCookie() {
  const entry = document.cookie.split("; ").find((part) => part.startsWith(`${PREVIEW_COOKIE}=`));
  return entry ? entry.slice(PREVIEW_COOKIE.length + 1) : null;
}

/**
 * A slim bar above the menu while the blog is switched off and you are signed in, so
 * it is clear visitors see something else. Read in the browser from the proxy's
 * cookie, so public pages stay static and visitors pay nothing.
 */
export default function UnderDevelopmentBanner() {
  const value = useSyncExternalStore(emptySubscribe, previewCookie, () => null);
  if (!value) return null;

  return (
    <aside
      aria-label="Under development"
      className="on-inverse border-b border-[var(--line)] bg-[var(--inverse)] text-[var(--on-inverse)]"
    >
      <p className="mx-auto max-w-6xl px-6 py-2 text-sm">
        The blog is under development. Visitors see the under-development page; you see the blog
        because you are signed in.{" "}
        {value === "manage" ? (
          <Link href="/admin/site" className="font-medium underline underline-offset-2">
            Manage
          </Link>
        ) : (
          <Link href="/admin" className="font-medium underline underline-offset-2">
            Open the admin
          </Link>
        )}
      </p>
    </aside>
  );
}
