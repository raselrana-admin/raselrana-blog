# Blog admin: sign in from the website dashboard (super admin)

Hand-over for the **blog project** (`raselrana-blog`). It describes what the blog must build so that the website's owner, already signed in to the website dashboard at `raselrana.com.bd/admin`, opens the blog admin with one click and no second password, as the blog's only **super admin**. Everything on the website side is already done (section 11).

## 1. The goal

- The website dashboard has a sidebar link, **Apps → Blog admin**, pointing to `https://raselrana.com.bd/blog/admin/sso`.
- Clicking it signs the owner in to the blog admin as `SUPER_ADMIN` and lands on `/blog/admin`.
- The blog keeps its own login for everyone else. Admins and authors added later sign in to the blog with their own email and password and have nothing to do with the website.
- There is exactly one super admin: whoever is signed in to the website dashboard. The blog cannot create, promote, edit or delete a super admin itself.

## 2. How it works

```
Browser ──GET raselrana.com.bd/blog/admin/sso──▶ website (rewrite /blog/*) ──▶ blog app
         (sends the website's admin_session                                    │
          cookie: it has Path=/)                                               │ server-side
                                                                               ▼
                         website ◀── GET {MAIN_SITE_URL}/api/admin/session ── blog server
                                     Cookie: admin_session=<value from the request>
                         200 { email, name, role: "super_admin" }  or  401
                                                                               │
                                     blog signs the user in (Auth.js), role SUPER_ADMIN
```

- The browser already sends the website's `admin_session` cookie with every `/blog/...` request, because the cookie's path is `/` and the blog is served under the same domain. The website's rewrite forwards it to the blog.
- The blog **must not** try to read or verify that cookie itself. It is signed with the website's `SESSION_SECRET`, which the blog does not have and must never get. It only passes the cookie on to the website's session endpoint, which answers whether it is a genuine, current dashboard session.

## 3. The website's session endpoint (the contract)

`GET {MAIN_SITE_URL}/api/admin/session`

Request: send the cookie exactly as it arrived, and nothing else is needed.

```js
const res = await fetch(`${process.env.MAIN_SITE_URL}/api/admin/session`, {
  headers: { cookie: `admin_session=${value}` },
  cache: "no-store",
  signal: AbortSignal.timeout(5000),
});
```

| Answer | Body | Meaning |
|---|---|---|
| `200` | `{ "email": "…", "name": "…", "role": "super_admin" }` | The website's owner is signed in. `email` is the identity to use. |
| `401` | `{ "error": "Not signed in" }` | No session, an expired or forged cookie, or a session ended by signing out or changing the password. |

- Responses are `Cache-Control: no-store`. Never cache them across requests.
- **Treat anything other than a `200` with a string `email` as "not signed in"**: network errors, timeouts, `5xx`, unexpected JSON.
- Lower-case and trim the email before comparing it with blog users.

## 4. Environment variables (blog)

| Variable | Production | On your computer |
|---|---|---|
| `MAIN_SITE_URL` | `https://raselrana.com.bd` | `http://localhost:3000` |

No secret is shared between the two apps.

## 5. A super admin role

1. Add `SUPER_ADMIN` to the `Role` enum in `prisma/schema.prisma` (`SUPER_ADMIN`, `ADMIN`, `AUTHOR`), then `npx prisma generate`. MongoDB needs no migration.
2. A super admin can do everything an admin can. In `src/lib/authz.js`:
   - `requireRole("ADMIN")` must also accept `SUPER_ADMIN`. A simple way is a rank, `{ AUTHOR: 1, ADMIN: 2, SUPER_ADMIN: 3 }`, where `requireRole(role)` passes when the user's rank is at least the role's rank.
   - `canEditPost` and `canSetStatus`: treat `SUPER_ADMIN` like `ADMIN`.
3. Only a super admin may manage blog users (add admins and authors, disable them, reset their passwords) when that screen is built.
4. The role is given **only** by the bridge in section 6:
   - the blog's own forms, API and `src/scripts/create-admin.js` must never set it;
   - a user with `SUPER_ADMIN` cannot be edited, disabled or deleted from the blog UI.

## 6. Sign-in through the website: a second Auth.js provider

In `src/lib/auth.js`, add a second Credentials provider next to the password one:

```js
Credentials({
  id: "main-site",
  name: "raselrana.com.bd",
  credentials: {},
  async authorize(_credentials, request) {
    const owner = await getMainSiteOwner(request.headers.get("cookie"));
    if (!owner) return null;
    const user = await upsertSuperAdmin(owner); // see below
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },
}),
```

- **`getMainSiteOwner(cookieHeader)`** (e.g. `src/lib/main-site.js`, server-only):
  - takes `admin_session` out of the cookie header;
  - calls the endpoint as in section 3;
  - returns `{ email, name }` or `null`;
  - never logs the cookie value.
- **`upsertSuperAdmin({ email, name })`:** find the blog user by email.
  - **Exists:** set `role: "SUPER_ADMIN"` and `isActive: true`. The owner's existing blog account, made with `create-admin`, is upgraded, so its posts stay linked.
  - **Does not exist:** create it with the name, the email, a username from the part before `@` (add a number if it is taken), `role: "SUPER_ADMIN"`, and a `passwordHash` of a random 32-byte value hashed with bcrypt. Nobody knows that password, so this account can only be entered through the website.
- Any other user who has `SUPER_ADMIN` but a different email (an old owner email) is set back to `ADMIN`. That keeps exactly one super admin.

## 7. The `/blog/admin/sso` page

- **Route:** `src/app/admin/sso/page.jsx`. Put it outside `(panel)`, because the panel layout requires a blog session.
- **Proxy:** allow it in `src/proxy.js` without a blog session, the same way as the login page: `onLoginPage || pathname.endsWith("/admin/sso")`.
- **What it does:**
  - a Server Action that calls `signIn("main-site", { redirectTo: "/blog/admin" })`;
  - a small client component submits the form once on load, so the click in the website dashboard lands straight in the blog admin;
  - inside `<noscript>`, or simply visible, a **Continue** button as the fallback.
- **When it fails** (Auth.js comes back with an error): show "Sign in to raselrana.com.bd first", with a link to `/admin/login` (the website's login, so a plain `<a href="https://raselrana.com.bd/admin/login">`, not a path inside the blog), and a link to the blog's own login.
- **Login page:** on `/blog/admin/login`, when the request carries an `admin_session` cookie, also show a **Continue with raselrana.com.bd** button that goes to `/blog/admin/sso`.
- **Robots:** the page needs `robots: { index: false }`, which the admin layout already gives.

## 8. Ending the super admin's access

The blog's session lasts longer than a click, so the website's sign-out has to reach it:

- In `getCurrentUser()` (`src/lib/authz.js`), when the database user has `role === "SUPER_ADMIN"`, call `getMainSiteOwner()` with the incoming request's cookie: `(await cookies()).get("admin_session")`.
- If it returns `null`, or an email different from the user's, return `null` (signed out).
- It is already wrapped in React `cache`, so this is one call per request.
- **Result:** signing out of the website dashboard, or changing its password, ends super-admin access to the blog on the next page load. Blog-only admins and authors are not affected.

## 9. Rules

- Never log, store or return the `admin_session` value. Never name a blog cookie `admin_session`, because that name belongs to the website.
- Don't set a `Domain` on any blog cookie. Leave the Auth.js cookies as they are.
- **Server Actions behind the rewrite:** `next.config` should allow the website's address, or the SSO and login forms may be refused with "Invalid Server Actions request":

  ```js
  experimental: {
    serverActions: {
      allowedOrigins: ["raselrana.com.bd", "www.raselrana.com.bd", "localhost:3000"],
    },
  },
  ```

- **`AUTH_URL`:** keep it at the public address including the base path (`https://raselrana.com.bd/blog/api/auth` or as already set), so Auth.js builds its redirects under `/blog`.

## 10. Testing

**On your computer, both apps together**

1. Start the blog on port 3001: `npm run dev -- -p 3001`, with `MAIN_SITE_URL=http://localhost:3000` in its `.env.local`.
2. In the website's `.env.local`, set `BLOG_DOMAIN=http://localhost:3001`, then run `npm run dev` (port 3000).
3. Sign in at `http://localhost:3000/admin`, then click **Apps → Blog admin**.

**Checklist**

- [ ] Signed in to the website, **Apps → Blog admin** opens `/blog/admin` signed in, and the user's role is `SUPER_ADMIN`.
- [ ] Signed out of the website, `/blog/admin/sso` shows "Sign in to raselrana.com.bd first" and does not sign anyone in.
- [ ] After signing out of the website dashboard, the next blog admin page goes to the blog login.
- [ ] A blog-only `ADMIN` signs in with a password as before, can do everything admins can, and cannot reach super-admin-only screens.
- [ ] A changed or made-up `admin_session` cookie is refused (the website answers 401).
- [ ] The owner's old blog account (same email) is the one used, and its posts still show it as the author.
- [ ] Nothing in the blog's logs contains the cookie value.

## 11. On the website (already done, for reference)

- `GET /api/admin/session` (`src/app/api/admin/session/route.js`) answers as in section 3. It uses the dashboard's full session check: a genuine cookie, plus the same email and session version as the account.
- The dashboard sidebar's **Apps** group shows **Blog admin** (→ `/blog/admin/sso`, opens in a new tab) whenever `BLOG_DOMAIN` is set.
- `robots.txt` disallows `/blog/admin`.
- The website does **not** gate `/blog/admin` itself (unlike `/shonchoy`), so blog-only admins can still reach the blog's login.
