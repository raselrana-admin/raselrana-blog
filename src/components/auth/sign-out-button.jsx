"use client";

import { buttonSmall } from "@/lib/ui";
import { signOut } from "next-auth/react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const iconButton =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]";

/** `icon`: the compact version for the admin top bar, named for screen readers. */
export default function SignOutButton({ icon = false }) {
  const leave = () => signOut({ callbackUrl: `${basePath}/admin/login` });

  if (icon) {
    return (
      <button type="button" onClick={leave} aria-label="Sign out" title="Sign out" className={iconButton}>
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
          <path d="M10 16l-4-4 4-4M6 12h10" />
        </svg>
      </button>
    );
  }

  return (
    <button type="button" onClick={leave} className={buttonSmall}>
      Sign out
    </button>
  );
}
