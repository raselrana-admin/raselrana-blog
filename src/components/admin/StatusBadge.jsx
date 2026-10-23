import { chip } from "@/lib/ui";

export const STATUS_LABELS = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

// One colour rule (docs/brand-guide.md §8.1): the live state is Brand Blue, the
// in-between state navy, everything else slate. Never teal.
const STATUS_STYLES = {
  PUBLISHED: "border-[var(--signal)] text-[var(--signal)]",
  SCHEDULED: "border-[var(--ink)] text-[var(--ink)]",
  ARCHIVED: "border-dashed border-[var(--slate)] text-[var(--slate)]",
};
const OTHER = "border-[var(--slate)] text-[var(--slate)]";

export default function StatusBadge({ status }) {
  return (
    <span className={`${chip} whitespace-nowrap ${STATUS_STYLES[status] ?? OTHER}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
