import MainSiteLink from "@/components/layout/MainSiteLink";
import { getSiteMessage, hasEverBeenLive, isSiteLive, STANDARD_TEXT } from "@/lib/site-status";
import { MAINTENANCE_HEADER } from "@/lib/site-preview";
import {
  buttonPrimary,
  buttonSecondary,
  container,
  pageHeading,
  pageLabel,
} from "@/lib/ui";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Read on every request: the wording and the message change from the admin.
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const back = await hasEverBeenLive();
  return {
    title: back ? "Back soon" : "Coming soon",
    description: back
      ? "The blog of Rasel Rana is being updated and will be back shortly."
      : "The blog of Rasel Rana is being prepared. Writing on telecommunications and electrical engineering will appear here soon.",
    robots: { index: false, follow: false },
  };
}

// Shown for every public address while the "Site live" switch is off (admin → Site;
// src/lib/site-status.js), through the rewrite in src/proxy.js, which answers 503.
// No menu or footer on purpose: their links lead to pages that are not open yet.
export default async function ComingSoonPage() {
  const shownByProxy = (await headers()).has(MAINTENANCE_HEADER);
  // Opened directly while the blog is live: send them to the blog. Never when the
  // proxy sent them here: right after switching on, one server copy may still
  // remember "off", and a redirect back would loop.
  if (!shownByProxy && (await isSiteLive())) redirect("/");

  const [back, message] = await Promise.all([hasEverBeenLive(), getSiteMessage()]);
  const text = message?.text || (back ? STANDARD_TEXT.backSoon : STANDARD_TEXT.comingSoon);

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <section className={`${container} w-full py-20 md:py-24`}>
        <p className={`${pageLabel} rise`}>
          <span aria-hidden className="h-px w-10 bg-[var(--signal)]" />
          Blog
          <span aria-hidden>·</span>
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--signal)]"
            />
            {back ? "Under maintenance" : "In preparation"}
          </span>
        </p>
        <h1
          className={`${pageHeading} rise mt-6`}
          style={{ "--delay": "80ms" }}
        >
          {back ? "Back soon" : "Coming soon"}
        </h1>
        <p
          className="rise mt-6 max-w-xl whitespace-pre-line text-lg leading-relaxed text-[var(--slate)]"
          style={{ "--delay": "160ms" }}
        >
          {text}
        </p>
        <div
          className="rise mt-9 flex flex-wrap gap-3"
          style={{ "--delay": "240ms" }}
        >
          <MainSiteLink href="/" className={buttonPrimary}>
            Visit the main site
          </MainSiteLink>
          <MainSiteLink href="/contact" className={buttonSecondary}>
            Contact
          </MainSiteLink>
        </div>
        <p
          className="rise mt-16 font-mono text-xs text-[var(--slate)]"
          style={{ "--delay": "320ms" }}
        >
          Rasel Rana · raselrana.com.bd/blog
        </p>
      </section>
    </main>
  );
}
