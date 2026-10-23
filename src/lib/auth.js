import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  isLoginBlocked,
  loginAttemptKey,
  recordLoginAttempt,
} from "./login-rate-limit";
import { getMainSiteOwner, readMainSiteCookie } from "./main-site";
import { prisma } from "./prisma";
import { upsertSuperAdmin } from "@/services/users/super-admin";

// Auth.js uses these paths verbatim, so the Next.js basePath has to be included.
const LOGIN_PATH = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/admin/login`;

// Compared against when the email is unknown, so both failure cases take the same time.
const DUMMY_HASH = bcrypt.hashSync("invalid-password-placeholder", 12);

// The login page reads `code` to show "too many attempts". The same answer is given
// whether or not the email exists.
class RateLimitedSignin extends CredentialsSignin {
  code = "rate_limited";
}

// The super admin signs in only through the main site (its session is checked on
// every request in src/lib/authz.js), so the password form points there instead.
class MainSiteOnlySignin extends CredentialsSignin {
  code = "use_main_site";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  basePath: "/api/auth",
  session: { strategy: "jwt" },
  pages: {
    signIn: LOGIN_PATH,
    error: LOGIN_PATH,
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const rawEmail = credentials?.email;
        const password = credentials?.password;
        if (typeof rawEmail !== "string" || typeof password !== "string") {
          return null;
        }
        if (!rawEmail || !password || password.length > 200) return null;

        const email = rawEmail.trim().toLowerCase();
        const key = loginAttemptKey(email, request);

        if (await isLoginBlocked(key)) throw new RateLimitedSignin();

        const user = await prisma.user.findUnique({ where: { email } });

        const valid = await bcrypt.compare(
          password,
          user?.passwordHash ?? DUMMY_HASH,
        );
        const success = Boolean(user && valid && user.isActive);

        await recordLoginAttempt(key, success);
        if (!success) return null;
        if (user.role === "SUPER_ADMIN") throw new MainSiteOnlySignin();

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    // One click from the main site's dashboard (docs/blog-admin-handover.md §6).
    // Server-side signIn() forwards the browser's headers, so the main site's
    // admin_session cookie is here; the main site says whose it is.
    Credentials({
      id: "main-site",
      name: "raselrana.com.bd",
      credentials: {},
      async authorize(_credentials, request) {
        const owner = await getMainSiteOwner(
          readMainSiteCookie(request.headers.get("cookie")),
        );
        if (!owner) return null;

        const user = await upsertSuperAdmin(owner);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    // The role here is only a hint for the UI. Permission checks read the user
    // from the database (src/lib/authz.js).
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
