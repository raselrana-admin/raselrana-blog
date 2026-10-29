"use client";

import { recordRead } from "@/services/feedback/actions";
import { useEffect } from "react";

const READ_AFTER_MS = 10_000;

/**
 * Counts one read of the post on this page load, once the page has been visible
 * for 10 seconds in total. Renders nothing. Bots that run no JavaScript and
 * visitors who leave at once are not counted.
 */
export default function ReadCounter({ slug }) {
  useEffect(() => {
    let remaining = READ_AFTER_MS;
    let startedAt = 0;
    let timer = null;

    const start = () => {
      if (timer || document.visibilityState !== "visible") return;
      startedAt = Date.now();
      timer = setTimeout(() => {
        timer = null;
        remaining = 0;
        document.removeEventListener("visibilitychange", onVisibility);
        recordRead(slug).catch(() => {});
      }, remaining);
    };
    const pause = () => {
      if (!timer) return;
      clearTimeout(timer);
      timer = null;
      remaining -= Date.now() - startedAt;
    };
    function onVisibility() {
      if (document.visibilityState === "visible") start();
      else pause();
    }

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [slug]);

  return null;
}
