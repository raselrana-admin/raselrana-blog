"use client";

import { useRef } from "react";

/**
 * The switch button. It is a link to the confirm step (`href`), so it works without
 * JavaScript; with JavaScript it opens the same warning (`children`) in a native
 * <dialog> instead, which sits in the browser's top layer.
 */
export default function SwitchDialog({ href, label, className, titleId, children }) {
  const dialogRef = useRef(null);

  return (
    <>
      <a
        href={href}
        className={className}
        onClick={(event) => {
          event.preventDefault();
          dialogRef.current?.showModal();
        }}
      >
        {label}
      </a>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto w-[min(92vw,30rem)] rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7 text-[var(--ink)]"
      >
        {children}
      </dialog>
    </>
  );
}
