import BrandLogo from "@/components/brand/BrandLogo";
import { toolsMenu } from "@/lib/tools";
import Link from "next/link";
import HeaderControls from "./HeaderControls";
import MainSiteLink from "./MainSiteLink";

const links = [
  { href: "/", label: "Posts" },
  { href: "/tags", label: "Topics" },
  // Another app (raselrana.com.bd/tools): a plain <a>, never next/link, so no /blog in front
  { href: "/tools", label: "Tools", zone: true },
  { href: "/about", label: "About the author" },
];

export default async function SiteHeader() {
  // The tools API, cached for an hour; [] when it is down (plain "Tools" link then).
  const tools = await toolsMenu();

  return (
    // Same height and look as the main site's bar (docs/brand-guide.md §6), so it does not jump between the two.
    <header className="sticky top-0 z-50 h-16 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-sm">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-[var(--signal)] focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-[var(--paper)]"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-6">
        <div className="flex min-w-0 items-center gap-3">
          <MainSiteLink
            href="/"
            aria-label="Rasel Rana — main site"
            className="flex shrink-0 items-center"
          >
            <BrandLogo height={32} />
          </MainSiteLink>
          <span aria-hidden className="h-5 w-px bg-[var(--line)]" />
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--signal)]"
          >
            Blog
          </Link>
        </div>

        <HeaderControls links={links} tools={tools} />
      </div>
    </header>
  );
}
