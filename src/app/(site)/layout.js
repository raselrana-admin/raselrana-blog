import CategoryBar from "@/components/layout/CategoryBar";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import UnderDevelopmentBanner from "@/components/layout/UnderDevelopmentBanner";

export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Only for signed-in blog users while the site is switched off (src/proxy.js). */}
      <UnderDevelopmentBanner />
      <SiteHeader />
      <CategoryBar />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
