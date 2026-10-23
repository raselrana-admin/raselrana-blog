import AdminNav from "@/components/admin/AdminNav";
import AdminTopBar from "@/components/admin/AdminTopBar";
import NoticeToast from "@/components/admin/NoticeToast";
import { ToastProvider } from "@/components/admin/Toast";
import BrandMark from "@/components/brand/BrandMark";
import { getCurrentUser } from "@/lib/authz";
import { isSiteLive } from "@/lib/site-status";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Signed-in pages are personal and must never be served from a cache.
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }) {
  // Reads the user from the database, so a disabled account is locked out at once.
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  // Cached like every reader of the switch, so this is not a database read per page.
  const live = await isSiteLive();

  return (
    <ToastProvider>
      <div className="min-h-screen lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
        {/* Sticky only on wide screens: on phones the top bar is the one that stays. */}
        <aside className="border-b border-[var(--line)] bg-[var(--surface)] lg:sticky lg:top-0 lg:z-40 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col lg:overflow-y-auto">
            <div className="flex h-16 items-center px-6">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 font-display text-base font-semibold tracking-tight text-[var(--ink)]"
              >
                <BrandMark />
                <span>Blog admin</span>
              </Link>
            </div>

            <AdminNav isSuperAdmin={user.role === "SUPER_ADMIN"} />

            <p className="mt-auto hidden break-words border-t border-[var(--line)] p-6 text-xs text-[var(--slate)] lg:block">
              Signed in as
              <span className="block font-medium text-[var(--ink)]">{user.name}</span>
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          <AdminTopBar live={live} canManageSite={user.role === "SUPER_ADMIN"} />
          <main className="px-6 py-10 lg:px-10 lg:py-12">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
      {/* Turns ?ok= from a form action into a pop-up (useSearchParams needs Suspense). */}
      <Suspense fallback={null}>
        <NoticeToast />
      </Suspense>
    </ToastProvider>
  );
}
