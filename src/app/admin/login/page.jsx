import { MAIN_SITE_COOKIE } from "@/lib/main-site";
import { cookies } from "next/headers";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in" };

// Only whether the main site's cookie is present is passed on, never its value;
// /admin/sso asks the main site whether it is genuine.
export default async function LoginPage() {
  const hasMainSiteSession = (await cookies()).has(MAIN_SITE_COOKIE);
  return <LoginForm hasMainSiteSession={hasMainSiteSession} />;
}
