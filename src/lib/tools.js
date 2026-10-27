/**
 * Server only. The tools app's public list (raselrana-tools, served at
 * raselrana.com.bd/tools; docs/tools-handover.md). Never throws: when the API is
 * down it returns empty lists, so the header still renders a plain "Tools" link.
 */

const TIMEOUT_MS = 5000;

/** `TOOLS_API_URL` if set (local testing), else the main site's /tools/api/tools. */
export function toolsApiUrl() {
  if (process.env.TOOLS_API_URL) return process.env.TOOLS_API_URL;
  const base = process.env.MAIN_SITE_URL || "https://raselrana.com.bd";
  return `${base.replace(/\/$/, "")}/tools/api/tools`;
}

/** The whole answer (`{ version, categories, tools }`), cached for an hour. */
export async function getTools() {
  try {
    const res = await fetch(toolsApiUrl(), {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`Tools API ${res.status}`);
    const data = await res.json();
    if (data?.version !== 1 || !Array.isArray(data.tools)) throw new Error("Unexpected shape");
    return data;
  } catch {
    return { version: 1, categories: [], tools: [] };
  }
}

const isUrl = (value) => typeof value === "string" && /^https?:\/\//.test(value);

/**
 * What the header's Tools menu shows: `[{ title, url, items: [{ title, url }] }]`.
 * Only tools whose page exists (`available: true`, absolute URL); categories with
 * none are left out. Small and serialisable, for the client components.
 */
export async function toolsMenu() {
  const { categories = [], tools } = await getTools();
  return categories
    .map((category) => ({
      title: String(category.title ?? ""),
      url: isUrl(category.url) ? category.url : null,
      items: tools
        .filter((tool) => tool.category === category.slug && tool.available === true && isUrl(tool.url))
        .map((tool) => ({ title: String(tool.title ?? tool.shortTitle ?? ""), url: tool.url })),
    }))
    .filter((category) => category.title && category.items.length > 0);
}
