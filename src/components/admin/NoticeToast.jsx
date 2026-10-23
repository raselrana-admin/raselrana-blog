"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useToast } from "./Toast";

/**
 * Turns the `?ok=` that runAdminAction() redirects with into a pop-up, then takes it
 * out of the address so a reload does not show it again. `?error=` is left alone:
 * errors stay inline. Without JavaScript, <Notice> shows `ok` instead (in <noscript>).
 * Rendered once in the panel layout, inside <Suspense> (useSearchParams needs it).
 */
export default function NoticeToast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const shown = useRef(null);
  const ok = params.get("ok");

  useEffect(() => {
    if (!ok || shown.current === ok) return;
    shown.current = ok;
    toast(ok.slice(0, 300));

    const rest = new URLSearchParams(params);
    rest.delete("ok");
    const query = rest.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [ok, params, pathname, router, toast]);

  return null;
}
