"use client";

import { useIsMounted } from "@/lib/use-is-mounted";
import { useRef, useState } from "react";

/**
 * A code block with a Copy button (Markdown.jsx renders every <pre> through it).
 * The button appears once JavaScript runs; until then the code is plain and
 * selectable. "Code copied" is announced from a live region outside the button.
 */
export default function CodeBlock({ children, ...props }) {
  const mounted = useIsMounted();
  const preRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = (preRef.current?.textContent ?? "").replace(/\n$/, "");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (old browser or no permission): the code can still be selected by hand.
    }
  };

  return (
    <div className={`code-block${mounted ? " has-copy" : ""}`}>
      {/* Focusable, so a long line can be scrolled sideways with the keyboard (WCAG 2.1.1) */}
      <pre ref={preRef} tabIndex={0} {...props}>
        {children}
      </pre>
      {mounted && (
        <button type="button" onClick={copy} className="code-copy">
          {copied ? "Copied" : "Copy code"}
        </button>
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? "Code copied" : ""}
      </span>
    </div>
  );
}
