# Starter posts for raselrana.com.bd/blog

Six posts that together cover every category and every content type in the writing guide.

| File | Category | Type |
|---|---|---|
| ont-red-los-light.md | GPON & Fiber Optics | Troubleshooting |
| mikrotik-pppoe-server.md | MikroTik | How-to |
| how-vlan-tagging-works.md | Networking | Explainer |
| lead-acid-vs-lithium-bts-battery.md | Telecommunications | Comparison |
| sip-one-way-audio-nat.md | VoIP & IP-PBX | Troubleshooting |
| size-ups-small-server-rack.md | IT & Technology | How-to |

Each file has a YAML header that maps 1:1 to the admin editor fields (title, slug, excerpt,
SEO title, SEO description, category, content type, topics, featured image alt text,
show on main site, noindex). Everything below the header is the post body in Markdown.

`reviewNotes` is for you only. Do not import it. `featuredImage.url` is empty: every post
needs a featured image before it can be published.

## Option A: paste into the admin editor

For each file: New post → copy each header field into its editor field → paste the body
into the Markdown editor → upload a featured image and paste the alt text → Publish.

## Option B: import with Claude Code in VS Code

Copy this folder to `content/seed-posts/` in the blog repo, open Claude Code and paste:

```
Read every .md file in content/seed-posts/ (skip README.md). Each has YAML frontmatter
and a Markdown body. Look at prisma/schema.prisma and how the admin editor saves a post,
then write scripts/import-posts.js that upserts each file as a DRAFT post by slug:
map title, slug, excerpt, seoTitle, seoDescription, category (by name), contentType,
topics (create missing ones, match existing case-insensitively), body -> content,
featuredImage.alt, showOnMainSite, noindex. Ignore reviewNotes and suggestion.
If featuredImage.url is empty, leave the image empty. Do not publish anything.
Add an npm script "import:posts", run it against my dev database, and show me the result.
```

The posts arrive as drafts. Add a featured image to each in the admin and press Publish,
so they pass the same checklist as any post you write yourself.
