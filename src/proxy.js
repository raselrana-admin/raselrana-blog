// Next.js 16 request proxy (replaces middleware.js)
import { auth } from "@/lib/auth";
import { MAINTENANCE_HEADER, PREVIEW_COOKIE } from "@/lib/site-preview";
import { isSiteLive } from "@/lib/site-status";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// The request Auth.js hands over has lost the Next.js basePath, so add it back.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const LOGIN_PATH = "/admin/login";
const SSO_PATH = "/admin/sso";
const COOKIE_PATH = BASE_PATH || "/";

const adminProxy = auth((req) => {
  // Depending on the wrapper, the path may or may not still carry the base path.
  const onLoginPage = req.nextUrl.pathname.endsWith(LOGIN_PATH);
  // Signing in through the main site happens there, so it needs no blog session either.
  const onMainSitePage = req.nextUrl.pathname.endsWith(SSO_PATH);
  const to = (path) =>
    NextResponse.redirect(new URL(`${BASE_PATH}${path}`, req.nextUrl.origin));

  // The cookie is only a first filter here; pages and handlers check the user
  // against the database (src/lib/authz.js).
  // (No redirect away from the sign-in page for a signed-in visitor: a disabled
  // account still has a cookie, and would bounce between the two pages forever.)
  if (!req.auth && !onLoginPage && !onMainSitePage) return to(LOGIN_PATH);
});

/**
 * While the site is switched off: signed-in blog users (session cookie, no database)
 * see the real blog plus a banner (PREVIEW_COOKIE); everyone else gets the
 * under-development page with status 503, so search engines keep the pages.
 * The pages shown are the public ones; drafts still go through /preview, which checks
 * the user against the database.
 * getToken() only reads the session cookie: unlike the auth() wrapper it sets no
 * Auth.js cookies on visitors' responses (those would have Path=/ and reach the main site).
 */
async function offProxy(req) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: req.nextUrl.protocol === "https:",
  }).catch(() => null);

  if (token?.sub) {
    const res = NextResponse.next();
    res.cookies.set(PREVIEW_COOKIE, token.role === "SUPER_ADMIN" ? "manage" : "view", {
      path: COOKIE_PATH,
      sameSite: "lax",
      maxAge: 60 * 60,
    });
    return res;
  }

  // A rewrite, not a redirect: the address stays, and it works again at launch.
  const forwarded = new Headers(req.headers);
  forwarded.set(MAINTENANCE_HEADER, "1");
  return NextResponse.rewrite(new URL(`${BASE_PATH}/coming-soon`, req.nextUrl.origin), {
    status: 503,
    headers: { "Retry-After": "600", "Cache-Control": "no-store" },
    request: { headers: forwarded },
  });
}

// Still reachable while the blog is closed. /admin (with the sign-in page) is handled
// above; a draft preview checks the signed-in user itself.
const isOpenWhileComingSoon = (pathname) =>
  pathname === "/coming-soon" || pathname.startsWith("/preview/");

export default async function proxy(req, event) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return adminProxy(req, event);
  }
  if (isOpenWhileComingSoon(pathname)) return;

  // The "Site live" switch (admin → Site); checked at most every 10 minutes per server
  // while live, every minute while off.
  if (await isSiteLive()) {
    // Live again: the banner's cookie has no use any more.
    if (req.cookies.has(PREVIEW_COOKIE)) {
      const res = NextResponse.next();
      res.cookies.delete({ name: PREVIEW_COOKIE, path: COOKIE_PATH });
      return res;
    }
    return;
  }

  return offProxy(req);
}

export const config = {
  // Every page, but not the API, Next.js internals or files (anything with a dot).
  // The home page is listed by itself: with a basePath the pattern does not match it.
  matcher: ["/", "/((?!api|_next|.*\\..*).*)"],
};
