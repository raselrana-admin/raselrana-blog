import NotFoundSection from "@/components/blog/NotFoundSection";

export const metadata = { title: "Page not found" };

// For notFound() in the public pages (an unknown article, topic, category…).
// The (site) layout already has the menu and footer around it.
export default function SiteNotFound() {
  return <NotFoundSection />;
}
