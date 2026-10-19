import NotFoundSection from "@/components/blog/NotFoundSection";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export const metadata = { title: "Page not found" };

// Lives outside the (site) group, so it brings the menu and footer itself.
// A notFound() inside (site) uses (site)/not-found.jsx instead, which has the layout's.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <NotFoundSection />
      </main>
      <SiteFooter />
    </div>
  );
}
