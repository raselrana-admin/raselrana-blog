import MainSiteLink from "@/components/layout/MainSiteLink";
import {
  buttonPrimary,
  buttonSecondary,
  container,
  pageHeading,
  pageLabel,
} from "@/lib/ui";
import Link from "next/link";

/** The "Page not found" text, shared by app/not-found.jsx and app/(site)/not-found.jsx. */
export default function NotFoundSection() {
  return (
    <section className={`${container} py-20 md:py-24`}>
      <p className={pageLabel}>
        <span aria-hidden className="h-px w-10 bg-[var(--signal)]" />
        Error 404
      </p>
      <h1 className={`${pageHeading} mt-6`}>Page not found</h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--slate)]">
        The page you are looking for does not exist or may have been
        moved.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/" className={buttonPrimary}>
          Go to the blog
        </Link>
        <MainSiteLink href="/" className={buttonSecondary}>
          Visit the main site
        </MainSiteLink>
      </div>
    </section>
  );
}
