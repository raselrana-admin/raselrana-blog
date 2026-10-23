import BrandMark from "@/components/brand/BrandMark";

/** The mark and "Blog admin" above the sign-in and the main-site sign-in pages. */
export default function SignInHeader() {
  return (
    <div className="flex items-center gap-3">
      <BrandMark size={40} />
      <div>
        <p className="font-display text-lg font-semibold text-[var(--ink)]">Rasel Rana</p>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--slate)]">
          Blog admin
        </p>
      </div>
    </div>
  );
}
