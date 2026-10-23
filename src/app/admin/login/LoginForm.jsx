"use client";

import SignInHeader from "@/components/admin/SignInHeader";
import { buttonPrimary, buttonSecondary, fieldLabel, input } from "@/lib/ui";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * The blog's own sign-in (email + password). `hasMainSiteSession` is true when the
 * request carries the main site's dashboard cookie; then the owner is offered the
 * one-click way in as well (docs/blog-admin-handover.md §7).
 */
export default function LoginForm({ hasMainSiteSession }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.code === "rate_limited"
            ? "Too many attempts. Please try again in 15 minutes."
            : result.code === "use_main_site"
              ? "This account signs in through raselrana.com.bd. Sign in there, then choose Apps → Blog admin."
              : "Invalid email or password.",
        );
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <SignInHeader />

        {hasMainSiteSession && (
          <Link href="/admin/sso" className={`${buttonSecondary} mt-8 w-full`}>
            Continue with raselrana.com.bd
          </Link>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7"
        >
          <h1 className="font-display text-2xl font-semibold text-[var(--ink)]">
            Sign in
          </h1>
          <div>
            <label htmlFor="login-email" className={fieldLabel}>
              Email (required)
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={input}
            />
          </div>
          <div>
            <label htmlFor="login-password" className={fieldLabel}>
              Password (required)
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={input}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-[var(--danger)]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className={`${buttonPrimary} w-full`}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link
            href="/"
            className="text-[var(--slate)] underline underline-offset-4 hover:text-[var(--signal)]"
          >
            Back to the blog
          </Link>
        </p>
      </div>
    </main>
  );
}
