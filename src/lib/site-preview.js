// Shared by the proxy (src/proxy.js), the under-development page and the banner
// (components/layout/UnderDevelopmentBanner.jsx). Client-safe: no imports.

/**
 * Set by the proxy while the site is switched off and the visitor is signed in to
 * the blog: it only tells the banner to show (no secret; not httpOnly, because the
 * browser reads it). Path is the base path, so it never reaches the main site.
 * Never name it `site_preview`, which belongs to the main site.
 * Values: "manage" (the super admin: the banner links to the Site page) or "view".
 */
export const PREVIEW_COOKIE = "blog_preview";

/** Request header the proxy adds when it rewrites a visitor to the under-development page. */
export const MAINTENANCE_HEADER = "x-blog-maintenance";
