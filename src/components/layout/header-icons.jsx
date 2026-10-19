// Icons for the header controls (layout/ThemeToggle, layout/HeaderControls,
// layout/MobileMenu): 22px, round caps, currentColor except the brand
// accents (sun core yellow, moon sparkle teal, signal arcs teal + yellow).

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function SunIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="var(--rr-yellow)" stroke="currentColor" strokeWidth="1.8" />
      <path
        {...stroke}
        strokeWidth="1.8"
        d="M12 2.8v1.8M12 19.4v1.8M2.8 12h1.8M19.4 12h1.8M5.5 5.5l1.3 1.3M17.2 17.2l1.3 1.3M5.5 18.5l1.3-1.3M17.2 6.8l1.3-1.3"
      />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} strokeWidth="1.8" d="M19.5 14.6A7.6 7.6 0 0 1 9.4 4.5a7.6 7.6 0 1 0 10.1 10.1z" />
      <path {...stroke} stroke="var(--rr-teal)" strokeWidth="1.6" d="M17 3.2v3.2M15.4 4.8h3.2" />
    </svg>
  );
}

// Middle line shorter and right-aligned
export function BarsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} strokeWidth="2" d="M4 7h16M9 12h11M4 17h16" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} strokeWidth="2" d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

export function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} strokeWidth="2" d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} strokeWidth="2" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// The logo's two signal arcs, as a small decorative mark
export function SignalArcs() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} stroke="var(--rr-teal)" strokeWidth="2" d="M4 14a6 6 0 0 1 6-6" />
      <path {...stroke} stroke="var(--rr-yellow)" strokeWidth="2" d="M4 20a12 12 0 0 1 12-12" />
    </svg>
  );
}
