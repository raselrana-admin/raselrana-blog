import SignInHeader from "@/components/admin/SignInHeader";
import { signIn } from "@/lib/auth";
import { buttonPrimary } from "@/lib/ui";
import { AuthError } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import AutoSubmit from "./AutoSubmit";

export const metadata = { title: "Continue from raselrana.com.bd" };

// The main site's own sign-in page: another app, so a full address (MainSiteLink
// would be root-relative, which locally points at the blog's port).
const MAIN_SITE_LOGIN = new URL(
  "/admin/login",
  process.env.MAIN_SITE_URL || "https://raselrana.com.bd",
).toString();

/**
 * Signs the main site's owner in as the blog's super admin (docs/blog-admin-handover.md §7).
 * The "main-site" provider in src/lib/auth.js asks the main site whose admin_session
 * cookie this request carries; nothing here reads it.
 */
async function continueFromMainSite() {
  "use server";
  let signedIn = false;
  try {
    const result = await signIn("main-site", { redirect: false });
    signedIn = !(typeof result === "string" && result.includes("error="));
  } catch (error) {
    if (!(error instanceof AuthError)) throw error;
  }
  redirect(signedIn ? "/admin" : "/admin/sso?error=1");
}

// Reached from "Apps → Blog admin" in the main site's dashboard. Outside (panel),
// which needs a blog session; src/proxy.js lets it through.
export default async function MainSiteSignInPage({ searchParams }) {
  const failed = Boolean((await searchParams).error);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <SignInHeader />

        <div className="mt-8 space-y-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7">
          {failed ? (
            <>
              <h1 className="font-display text-2xl font-semibold text-[var(--ink)]">
                Sign in to raselrana.com.bd first
              </h1>
              <p className="text-sm leading-relaxed text-[var(--slate)]">
                The blog admin opens from the website dashboard, and you are not signed
                in there. Sign in, then choose Apps → Blog admin again.
              </p>
              <a href={MAIN_SITE_LOGIN} className={`${buttonPrimary} w-full`}>
                Sign in to raselrana.com.bd
              </a>
            </>
          ) : (
            <form action={continueFromMainSite} className="space-y-5">
              <h1 className="font-display text-2xl font-semibold text-[var(--ink)]">
                Opening the blog admin
              </h1>
              <p className="text-sm leading-relaxed text-[var(--slate)]">
                Signing you in with your raselrana.com.bd account.
              </p>
              <button type="submit" className={`${buttonPrimary} w-full`}>
                Continue
              </button>
              <AutoSubmit />
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-[var(--slate)]">
          Blog-only account?{" "}
          <Link
            href="/admin/login"
            className="underline underline-offset-4 hover:text-[var(--signal)]"
          >
            Sign in with a password
          </Link>
        </p>
      </div>
    </main>
  );
}
