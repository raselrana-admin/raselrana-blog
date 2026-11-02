// Reads a post written as a file: a header between --- lines, then the Markdown body.
// Used by the editor's "Import .md file" button and by src/scripts/import-posts.mjs,
// so it has no "@/" imports and nothing that needs the browser or Node.
//
// Two header styles are accepted, and both come out in the same shape:
//   Content type: Explainer             (the writing style, "Key: value")
//   contentType: "Explainer"            (YAML, content/seed-posts)
// Supported: quoted strings, `[a, b]` lists, true/false, `# comments`, and one level
// of nesting (an indented map or a `- item` list under `key:`).

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
  for (const line of yaml.split("\n")) {
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
    // The first colon ends the key: values have colons of their own.
    const [, key, value] = line.match(/^([^:]+):\s*(.*)$/) ?? [];
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

const text = (value) => {
  if (value === null || value === undefined || value === "") return undefined;
  return String(value);
};

const list = (value) => {
  const items = Array.isArray(value) ? value : (text(value)?.split(",") ?? []);
  return items.map((item) => String(item).trim()).filter(Boolean);
};

const yesNo = (value) => {
  const word = String(value).trim().toLowerCase();
  if (word === "yes" || word === "true") return true;
  if (word === "no" || word === "false") return false;
  return undefined;
};

/** The header with one spelling per field. Unknown keys (Status, reviewNotes) are dropped. */
function normalizeHeader(raw) {
  const field = {};
  for (const [key, value] of Object.entries(raw)) {
    field[key.toLowerCase().replace(/[\s_-]/g, "")] = value;
  }

  const image = field.featuredimage;
  const nested = image && typeof image === "object" && !Array.isArray(image) ? image : {};
  const alt = text(field.featuredalt ?? nested.alt);
  const suggestion = text(field.featuredimageidea ?? nested.suggestion);
  const url = text(nested.url);

  return {
    title: text(field.title),
    slug: text(field.slug),
    excerpt: text(field.excerpt),
    contentType: text(field.contenttype),
    category: text(field.category),
    topics: list(field.topics),
    seoTitle: text(field.seotitle),
    seoDescription: text(field.seodescription),
    showOnMainSite: yesNo(field.showonmainsite),
    noindex: yesNo(field.noindex),
    publishDate: text(field.publishdate),
    // A slug, sometimes with a note for the writer: "how-gpon-works (once published)".
    relatedPosts: list(field.relatedposts).map((item) => item.replace(/\s*\(.*\)$/, "")),
    featuredImage: alt || suggestion || url ? { url, alt, suggestion } : undefined,
  };
}

/** `{ header, body }`. A file with no header is all body. Throws on a header line it cannot read. */
export function parsePostFile(fileText) {
  const clean = fileText.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = clean.match(/^---\n([\s\S]*?)\n---(?:\n([\s\S]*))?$/);
  if (!match) return { header: normalizeHeader({}), body: clean.trim() };
  return {
    header: normalizeHeader(parseHeader(match[1])),
    body: (match[2] ?? "").trim(),
  };
}
