import { container, pageHeading, pageLabel } from "@/lib/ui";

/**
 * The top of a listing page: title, optional description and extras. `label`
 * (Category, Topic, Type…) is shown only when it says something the title does not.
 */
export default function ListingHeader({ label, title, description, count, unit = "post", children }) {
  return (
    <section className={`${container} py-12 md:py-14`}>
      {label && (
        <p className={`${pageLabel} rise mb-6`}>
          <span aria-hidden className="h-px w-10 bg-[var(--signal)]" />
          {label}
        </p>
      )}
      <h1 className={`${pageHeading} rise`} style={{ "--delay": "80ms" }}>
        {title}
      </h1>
      {description && (
        <p
          className="rise mt-6 max-w-2xl text-base leading-relaxed text-[var(--slate)] md:text-xl"
          style={{ "--delay": "160ms" }}
        >
          {description}
        </p>
      )}
      {count != null && (
        <p
          className="rise mt-5 font-mono text-xs text-[var(--slate)]"
          style={{ "--delay": "200ms" }}
        >
          {count} {count === 1 ? unit : `${unit}s`}
        </p>
      )}
      {children}
    </section>
  );
}

export function parsePage(value) {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}
