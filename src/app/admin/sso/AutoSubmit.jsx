"use client";

import { useEffect, useRef } from "react";

/**
 * Submits the surrounding form once, as soon as the page is ready, so the click in
 * the main site's dashboard lands straight in the blog admin. Without JavaScript
 * the visible Continue button does the same.
 */
export default function AutoSubmit() {
  const ref = useRef(null);
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    ref.current?.form?.requestSubmit();
  }, []);

  return <input ref={ref} type="hidden" name="auto" value="1" />;
}
