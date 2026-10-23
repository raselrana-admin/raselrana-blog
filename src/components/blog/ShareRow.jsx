"use client";

import { buttonSmall } from "@/lib/ui";
import { useState } from "react";

/** `url` is the public address of the post (https://raselrana.com.bd/blog/<slug>). */
export default function ShareRow({ url }) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked (old browser or no permission): show the address to copy by hand.
      window.prompt("Copy this link", url);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="mr-1 font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
        Share
      </p>
      <button type="button" onClick={copy} className={buttonSmall}>
        {copied ? "Copied" : "Copy link"}
      </button>
      {/* Outside the button: screen readers often skip changes inside the focused control */}
      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonSmall}
      >
        LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonSmall}
      >
        Facebook ↗<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
