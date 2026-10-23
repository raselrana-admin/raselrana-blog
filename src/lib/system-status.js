import nextPackage from "next/package.json";
import appPackage from "../../package.json";
import { prisma } from "./prisma";
import { getSiteStatus } from "./site-status";

/**
 * Server only. Live checks of everything the blog depends on, for the admin's
 * System page and the summary on the Overview. Each check runs in parallel with a
 * timeout and never throws; it returns
 * `{ id, name, state: "ok" | "warn" | "error", summary, detail? }`.
 * Nothing secret is returned: settings are reported as set or missing.
 */

const TIMEOUT_MS = 5000;

function withTimeout(promise) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`No answer within ${TIMEOUT_MS / 1000} s`)), TIMEOUT_MS),
    ),
  ]);
}

async function timed(fn) {
  const start = performance.now();
  const value = await withTimeout(fn());
  return { value, ms: Math.round(performance.now() - start) };
}

const missing = (names) => names.filter((name) => !process.env[name]);

async function checkDatabase() {
  const base = { id: "database", name: "Database (MongoDB Atlas)" };
  try {
    const { ms } = await timed(() => prisma.$runCommandRaw({ ping: 1 }));
    return {
      ...base,
      state: ms > 1500 ? "warn" : "ok",
      summary: ms > 1500 ? `Connected, but slow (${ms} ms)` : `Connected (${ms} ms)`,
    };
  } catch (error) {
    return { ...base, state: "error", summary: "Cannot reach the database", detail: error.message };
  }
}

async function checkCloudinary() {
  const base = { id: "cloudinary", name: "Image uploads (Cloudinary)" };
  const unset = missing(["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]);
  if (unset.length) {
    return { ...base, state: "error", summary: "Not configured", detail: `Missing: ${unset.join(", ")}` };
  }
  try {
    // Imported here: src/lib/cloudinary.js throws on import when settings are missing.
    const { default: cloudinary } = await import("./cloudinary");
    const { ms } = await timed(() => cloudinary.api.ping());
    return { ...base, state: "ok", summary: `Connected (${ms} ms)` };
  } catch (error) {
    const message = error?.error?.message || error?.message || "Unknown error";
    return { ...base, state: "error", summary: "Cloudinary refused the settings", detail: message };
  }
}

async function checkEmail() {
  const base = { id: "email", name: "Email notifications (Resend)" };
  const unset = missing(["RESEND_API_KEY", "NOTIFY_EMAIL_FROM"]);
  if (unset.length) {
    return {
      ...base,
      state: "warn",
      summary: "Not configured: switching the site sends no email",
      detail: `Missing: ${unset.join(", ")}`,
    };
  }
  try {
    // Called directly rather than through the resend package, which logs every
    // refused request as an error, including the expected one below.
    const { value: res } = await timed(() =>
      fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        cache: "no-store",
      }),
    );
    const body = await res.json().catch(() => ({}));
    const value = { error: res.ok ? null : { name: body.name, message: body.message ?? `HTTP ${res.status}` } };
    const sender = process.env.NOTIFY_EMAIL_FROM;
    // A key limited to sending (the recommended kind) may not list domains: Resend
    // answers "restricted_api_key", which still proves the key is genuine.
    if (!value.error || value.error.name === "restricted_api_key") {
      return {
        ...base,
        state: "ok",
        summary: "API key accepted",
        detail: `Sends from ${sender}. Use "Send test email" to confirm delivery.`,
      };
    }
    return { ...base, state: "error", summary: "Resend refused the API key", detail: value.error.message };
  } catch (error) {
    return { ...base, state: "error", summary: "Cannot reach Resend", detail: error.message };
  }
}

async function checkMainSite() {
  const base = { id: "main-site", name: "Sign-in from the website (raselrana.com.bd)" };
  const url = process.env.MAIN_SITE_URL;
  if (!url) {
    return { ...base, state: "error", summary: "MAIN_SITE_URL is not set", detail: "Nobody can sign in from the website dashboard." };
  }
  try {
    // Without a cookie a working endpoint answers 401 ("Not signed in").
    const { value: res, ms } = await timed(() =>
      fetch(new URL("/api/admin/session", url), { cache: "no-store" }),
    );
    if (res.status === 401) {
      return { ...base, state: "ok", summary: `Website reachable (${ms} ms)`, detail: url };
    }
    return {
      ...base,
      state: "error",
      summary: `Unexpected answer from the website (${res.status})`,
      detail:
        res.status === 404
          ? `${url} has no /api/admin/session. Is MAIN_SITE_URL the main site, and is it running?`
          : url,
    };
  } catch (error) {
    return { ...base, state: "error", summary: "Cannot reach the website", detail: `${url}: ${error.message}` };
  }
}

function checkAuth() {
  const base = { id: "auth", name: "Admin sign-in settings (Auth.js)" };
  const unset = missing(["AUTH_SECRET", "AUTH_URL"]);
  if (unset.length) {
    return { ...base, state: "error", summary: "Not configured", detail: `Missing: ${unset.join(", ")}` };
  }
  const url = process.env.AUTH_URL;
  if (process.env.VERCEL_ENV === "production" && !url.endsWith("/blog/api/auth")) {
    return { ...base, state: "warn", summary: "AUTH_URL looks wrong for production", detail: `${url} (expected …/blog/api/auth)` };
  }
  return { ...base, state: "ok", summary: "Configured", detail: url };
}

async function checkSite() {
  const base = { id: "site", name: "Public site" };
  try {
    const { live, usesSwitch } = await withTimeout(getSiteStatus());
    if (!usesSwitch) {
      return { ...base, state: "ok", summary: "Not production: this copy always shows the blog", detail: `Production switch: ${live ? "live" : "under development"}` };
    }
    return {
      ...base,
      state: "ok",
      summary: live ? "Live: visitors see the blog" : "Under development: visitors see that page",
      detail: process.env.BLOG_INDEXABLE === "true" ? "Search engines may index it." : "Hidden from search engines (BLOG_INDEXABLE is not true).",
    };
  } catch (error) {
    return { ...base, state: "error", summary: "Could not read the site switch", detail: error.message };
  }
}

/** All checks, in display order, plus when they ran. */
export async function runSystemChecks() {
  const checks = await Promise.all([
    checkDatabase(),
    checkCloudinary(),
    checkEmail(),
    checkMainSite(),
    Promise.resolve(checkAuth()),
    checkSite(),
  ]);
  return { checks, checkedAt: new Date() };
}

/** Versions shown under the checks. */
export function systemVersions() {
  return {
    app: appPackage.version,
    next: nextPackage.version,
    node: process.version,
    environment: process.env.VERCEL_ENV ?? "local",
  };
}
