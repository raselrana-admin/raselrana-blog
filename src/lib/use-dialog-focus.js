"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keyboard behaviour for a dialog or slide-in panel (WCAG 2.1.1 / 2.4.3):
 * while `active`, focus moves to the first focusable element inside `ref`,
 * Tab and Shift+Tab stay inside it, Escape calls `onClose`, and on close
 * focus goes back to whatever had it before (usually the button that opened
 * it). Used by layout/MobileMenu.
 */
export function useDialogFocus(ref, onClose, active = true) {
  // Kept in a ref so a new onClose on every render does not re-run the effect
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!active || !ref.current) return;
    const panel = ref.current;
    const previous = document.activeElement;
    panel.querySelector(FOCUSABLE)?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...panel.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, [active, ref]);
}
