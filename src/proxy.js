// Next.js 16 request proxy (replaces middleware.js)
import { auth } from "@/lib/auth";
import { COMING_SOON } from "@/lib/coming-soon";
import { NextResponse } from "next/server";

// The request Auth.js hands over has lost the Next.js basePath, so add it back.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const LOGIN_PATH = "/admin/login";

const adminProxy = auth((req) => {
  // Depending on the wrapper, the path may or may not still carry the base path.
  const onLoginPage = req.nextUrl.pathname.endsWith(LOGIN_PATH);
  const to = (path) =>
    NextResponse.redirect(new URL(`${BASE_PATH}${path}`, req.nextUrl.origin));

  // The cookie is only a first filter here; pages and handlers check the user
  // against the database (src/lib/authz.js).
  // (No redirect away from the sign-in page for a signed-in visitor: a disabled
  // account still has a cookie, and would bounce between the two pages forever.)
  if (!req.auth && !onLoginPage) return to(LOGIN_PATH);
});

// Still reachable while the blog is closed. /admin (with the sign-in page) is handled
// above; a draft preview checks the signed-in user itself.
const isOpenWhileComingSoon = (pathname) =>
  pathname === "/coming-soon" || pathname.startsWith("/preview/");

export default function proxy(req, event) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return adminProxy(req, event);
  }

  if (COMING_SOON && !isOpenWhileComingSoon(pathname)) {
    // A rewrite, not a redirect: the address stays, and it works again at launch.
    const url = req.nextUrl.clone();
    url.pathname = "/coming-soon";
    url.search = "";
    return NextResponse.rewrite(url);
  }
}

export const config = {
  // Every page, but not the API, Next.js internals or files (anything with a dot).
  // The home page is listed by itself: with a basePath the pattern does not match it.
  matcher: ["/", "/((?!api|_next|.*\\..*).*)"],
};
