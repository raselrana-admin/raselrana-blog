// The admin's pages, shared by the sidebar (components/admin/AdminNav.jsx) and the
// top bar's page title (components/admin/AdminTopBar.jsx). Client-safe.

export const ADMIN_LINKS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/posts", label: "Posts", exact: true },
  { href: "/admin/posts/new", label: "New post" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/system", label: "System" },
  // The "Site live" switch; only the super admin may use it.
  { href: "/admin/site", label: "Site", superAdmin: true },
];

/** Whether `link` is the current page (a post being edited counts as "Posts"). */
export function isActiveLink(link, pathname) {
  if (link.href === "/admin/posts") {
    return (
      pathname === "/admin/posts" ||
      (pathname.startsWith("/admin/posts/") && pathname !== "/admin/posts/new")
    );
  }
  return link.exact
    ? pathname === link.href
    : pathname === link.href || pathname.startsWith(`${link.href}/`);
}

/** The title of the current admin page, for the top bar. */
export function adminPageTitle(pathname) {
  if (/^\/admin\/posts\/[^/]+\/edit$/.test(pathname)) return "Edit post";
  return ADMIN_LINKS.find((link) => isActiveLink(link, pathname))?.label ?? "Blog admin";
}
