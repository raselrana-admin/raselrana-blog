"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/layout/header-icons";
import { useIsMounted } from "@/lib/use-is-mounted";

// Brand theme button (.hc-btn .hc-theme in globals.css): a sun in light mode,
// a moon in dark mode. The icon waits for the client so the server HTML and
// the first render agree (the theme is only known in the browser).
// In the header bar pass className="hc-btn-sm" for the 32px size.
export default function ThemeToggle({ className = "" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={!mounted ? "Switch theme" : isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`hc-btn hc-theme ${className}`}
    >
      {mounted ? isDark ? <MoonIcon /> : <SunIcon /> : <span className="h-[22px] w-[22px]" />}
    </button>
  );
}
