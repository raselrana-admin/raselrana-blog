import BrandLogo from "@/components/brand/BrandLogo";
import Link from "next/link";
import MainSiteLink from "./MainSiteLink";

const blogLinks = [
  { href: "/", label: "Posts" },
  { href: "/tags", label: "Topics" },
];

const mainSiteLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact" },
];

const heading =
  "font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]";
const link =
  "text-sm text-[var(--ink)] transition-colors hover:text-[var(--signal)]";

export default function SiteFooter() {
  return (
    <footer id="site-footer" className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <MainSiteLink
              href="/"
              aria-label="Rasel Rana — main site"
              className="inline-flex"
            >
              <BrandLogo height={56} tagline />
            </MainSiteLink>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--slate)]">
              Manager (Technical), BTCL — writing and building at the
              intersection of telecommunications and electrical engineering.
            </p>
          </div>

          <nav aria-label="Blog pages">
            <p className={heading}>Blog</p>
            <ul className="mt-4 space-y-2.5">
              {blogLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Main site">
            <p className={heading}>Rasel Rana</p>
            <ul className="mt-4 space-y-2.5">
              {mainSiteLinks.map((item) => (
                <li key={item.href}>
                  <MainSiteLink href={item.href} className={link}>
                    {item.label}
                  </MainSiteLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6 font-mono text-xs text-[var(--slate)]">
          <p>© {new Date().getFullYear()} Rasel Rana</p>
          {/* No element has id="top", so the browser scrolls to the start of the page */}
          <a href="#top" className="transition-colors hover:text-[var(--signal)]">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
