// Imports Markdown posts with a YAML header (content/seed-posts/*.md) as DRAFT posts.
// Matches posts by slug: a new slug is created, an existing draft that was never
// published is updated, and anything else is left alone. Nothing is published:
// add a featured image in the admin and press Publish, so each post passes the
// same checklist as a post written in the editor.
//
// Usage: npm run import:posts [-- <folder>] [-- --dry-run]
//
// Written as .mjs to reuse the pure helpers in src/lib (they use ESM syntax and
// no "@/" imports). It writes with Prisma directly, like seed-categories.js:
// the app's createPost() calls Next's revalidation, which only works inside the
// server. Drafts are not public, so no page needs refreshing.
import dotenv from "dotenv";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import prismaPkg from "@prisma/client";
import { CONTENT_TYPES } from "../lib/content-types.js";
import { readingMinutes, slugify, SLUG_PATTERN } from "../lib/posts.js";

dotenv.config({ path: [".env.local", ".env"], quiet: true });

const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

// The same limits as src/services/posts/validation.js (it cannot be imported
// here: it uses "@/" paths and the Cloudinary SDK).
const LIMITS = { title: 200, slug: 120, excerpt: 300, seoTitle: 60, seoDescription: 160, alt: 200 };
const MAX_TAGS = 8;
const MAX_TAG_LENGTH = 40;
// Top-level routes of the blog (src/services/posts/slugs.js).
const RESERVED_SLUGS = new Set([
  "about", "admin", "api", "author", "category", "coming-soon", "feed", "login",
  "page", "posts", "preview", "search", "sitemap", "tag", "tags", "type",
]);

// ---- A small YAML reader for the header these files use ----
// Supports: `key: value`, quoted strings, `[a, b]` lists, true/false, `# comments`,
// and one level of nesting (an indented map or a `- item` list under `key:`).

function parseScalar(raw) {
  const text = raw.trim();
  const quoted = text.match(/^"((?:[^"\\]|\\.)*)"/);
  if (quoted) return JSON.parse(`"${quoted[1]}"`);
  const value = text.replace(/\s+#.*$/, "").trim();
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map(parseScalar)
      .filter((item) => item !== "");
  }
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}

function parseHeader(yaml) {
  const result = {};
  let parentKey = null;
  for (const line of yaml.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const indented = /^\s+/.test(line);
    if (indented && parentKey) {
      const item = line.trim().match(/^-\s+(.*)$/);
      if (item) {
        if (!Array.isArray(result[parentKey])) result[parentKey] = [];
        result[parentKey].push(parseScalar(item[1]));
      } else {
        const [, key, value] = line.trim().match(/^([\w-]+):\s*(.*)$/) ?? [];
        if (!key) throw new Error(`Cannot read header line: ${line}`);
        const parent = result[parentKey];
        if (!parent || Array.isArray(parent) || typeof parent !== "object") {
          result[parentKey] = {};
        }
        result[parentKey][key] = parseScalar(value);
      }
      continue;
    }
    const [, key, value] = line.match(/^([\w-]+):\s*(.*)$/) ?? [];
    if (!key) throw new Error(`Cannot read header line: ${line}`);
    if (value.trim() === "") {
      parentKey = key;
      result[key] = null;
    } else {
      parentKey = null;
      result[key] = parseScalar(value);
    }
  }
  return result;
}

function parsePostFile(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("No YAML header between --- lines");
  return { header: parseHeader(match[1]), body: match[2].trim() };
}

// ---- Checks, so a bad file stops before anything is written ----

function checkPost(header, body) {
  const problems = [];
  const text = (key) => (typeof header[key] === "string" ? header[key] : "");
  for (const [key, max] of Object.entries(LIMITS)) {
    if (key === "alt") continue;
    if (text(key).length > max) problems.push(`${key} is ${text(key).length} characters (max ${max})`);
  }
  if (!text("title")) problems.push("title is missing");
  if (!SLUG_PATTERN.test(text("slug"))) problems.push(`slug "${text("slug")}" is not lower-case-with-hyphens`);
  if (RESERVED_SLUGS.has(text("slug"))) problems.push(`slug "${text("slug")}" is a blog route`);
  if (!body) problems.push("the post has no content");
  if (!CONTENT_TYPES.some((type) => type.label === header.contentType)) {
    problems.push(`contentType "${header.contentType}" is not one of ${CONTENT_TYPES.map((t) => t.label).join(", ")}`);
  }
  const topics = Array.isArray(header.topics) ? header.topics : [];
  if (topics.length > MAX_TAGS) problems.push(`${topics.length} topics (max ${MAX_TAGS})`);
  for (const topic of topics) {
    if (String(topic).length > MAX_TAG_LENGTH || !slugify(String(topic))) problems.push(`topic "${topic}" is not valid`);
  }
  const alt = header.featuredImage?.alt ?? "";
  if (alt.length > LIMITS.alt) problems.push(`featured image alt text is ${alt.length} characters (max ${LIMITS.alt})`);
  return problems;
}

// ---- Database ----

async function findAuthor() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const user =
    (email && (await prisma.user.findUnique({ where: { email }, select: { id: true, name: true } }))) ||
    (await prisma.user.findFirst({
      where: { role: { in: ["SUPER_ADMIN", "ADMIN"] }, isActive: true },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }));
  if (!user) throw new Error("No admin user found. Run node src/scripts/create-admin.js first.");
  return user;
}

/** Topic ids for these names, matching existing topics by slug and creating the rest. */
async function topicIds(names, dryRun) {
  const ids = [];
  const created = [];
  for (const name of names) {
    const slug = slugify(name);
    const existing = await prisma.tag.findUnique({ where: { slug }, select: { id: true } });
    if (existing) {
      ids.push(existing.id);
    } else if (dryRun) {
      created.push(name);
    } else {
      const tag = await prisma.tag.create({ data: { name, slug }, select: { id: true } });
      ids.push(tag.id);
      created.push(name);
    }
  }
  return { ids, created };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const folder = args.find((arg) => !arg.startsWith("--")) ?? "content/seed-posts";

  const files = (await readdir(folder))
    .filter((name) => name.endsWith(".md") && name.toLowerCase() !== "readme.md")
    .sort();
  if (files.length === 0) throw new Error(`No .md files in ${folder}`);

  // Read and check every file first, so a mistake in one writes nothing.
  const posts = [];
  for (const file of files) {
    const { header, body } = parsePostFile(await readFile(join(folder, file), "utf8"));
    const problems = checkPost(header, body);
    if (problems.length) throw new Error(`${file}:\n  - ${problems.join("\n  - ")}`);
    posts.push({ file, header, body });
  }

  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  for (const { file, header } of posts) {
    if (!categories.some((c) => c.name.toLowerCase() === String(header.category).toLowerCase())) {
      throw new Error(`${file}: category "${header.category}" does not exist (run npm run seed:categories?)`);
    }
  }

  const author = await findAuthor();
  console.log(`${dryRun ? "Dry run: " : ""}importing ${posts.length} posts as drafts by ${author.name}\n`);

  for (const { file, header, body } of posts) {
    const slug = header.slug;
    const category = categories.find((c) => c.name.toLowerCase() === header.category.toLowerCase());
    const contentType = CONTENT_TYPES.find((type) => type.label === header.contentType).value;

    const existing = await prisma.post.findUnique({
      where: { slug },
      select: { id: true, status: true, publishedAt: true },
    });
    if (existing && (existing.status !== "DRAFT" || existing.publishedAt)) {
      console.log(`  skipped  ${slug}  (exists as ${existing.status}; edit it in the admin)`);
      continue;
    }
    const formerOwner = await prisma.post.findFirst({
      where: { previousSlugs: { has: slug } },
      select: { slug: true },
    });
    if (formerOwner) {
      console.log(`  skipped  ${slug}  (an old address of "${formerOwner.slug}"; choose another slug)`);
      continue;
    }

    const { ids, created } = await topicIds(header.topics ?? [], dryRun);
    // The image itself is uploaded in the admin; the header only carries its description.
    const imageNote = header.featuredImage?.url ? " (featuredImage.url ignored: upload it in the admin)" : "";

    const fields = {
      title: header.title,
      excerpt: header.excerpt ?? "",
      content: body,
      contentType,
      readingTime: readingMinutes(body),
      seoTitle: header.seoTitle || null,
      seoDescription: header.seoDescription || null,
      showOnMainSite: header.showOnMainSite !== false,
      noindex: header.noindex === true,
      category: { connect: { id: category.id } },
    };

    if (!dryRun) {
      if (existing) {
        await prisma.post.update({
          where: { id: existing.id },
          data: { ...fields, tags: { set: ids.map((id) => ({ id })) } },
        });
      } else {
        await prisma.post.create({
          data: {
            ...fields,
            slug,
            status: "DRAFT",
            author: { connect: { id: author.id } },
            tags: { connect: ids.map((id) => ({ id })) },
          },
        });
      }
    }

    const verb = existing ? "updated" : "created";
    const newTopics = created.length ? `, new topics: ${created.join(", ")}` : "";
    console.log(`  ${verb}  ${slug}  (${header.category}, ${header.contentType}, ${fields.readingTime} min${newTopics})${imageNote}`);
    if (header.featuredImage?.alt) console.log(`           alt text to paste: ${header.featuredImage.alt}`);
  }

  console.log(
    `\n${dryRun ? "Nothing was written." : "Done."} Each draft needs a featured image before it can be published.`,
  );
}

main()
  .catch((error) => {
    console.error(error.message ?? error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
