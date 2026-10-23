// The one place that maps the ContentType enum (prisma/schema.prisma) to its label
// and address slug. Safe to import from client code.

// `summary` says what a reader comes to that type for (the index on the blog home).
export const CONTENT_TYPES = [
  { value: "EXPLAINER", label: "Explainer", slug: "explainer", summary: "Understand how it works" },
  { value: "HOWTO", label: "How-to", slug: "how-to", summary: "Set something up" },
  { value: "TROUBLESHOOTING", label: "Troubleshooting", slug: "troubleshooting", summary: "Fix a fault" },
  { value: "COMPARISON", label: "Comparison", slug: "comparison", summary: "Choose between options" },
];

export const CONTENT_TYPE_VALUES = CONTENT_TYPES.map((type) => type.value);

export const DEFAULT_CONTENT_TYPE = "EXPLAINER";

export function contentTypeByValue(value) {
  return CONTENT_TYPES.find((type) => type.value === value) ?? null;
}

export function contentTypeBySlug(slug) {
  return CONTENT_TYPES.find((type) => type.slug === slug) ?? null;
}
