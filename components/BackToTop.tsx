"use client";

import { useCallback, useState } from "react";

/** Small circular "back to top" control for the footer's bottom bar. */
export function BackToTop() {
  const [busy, setBusy] = useState(false);
  const scrollUp = useCallback(() => {
    setBusy(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => setBusy(false), 900);
  }, []);
  return (
    <button type="button" className="back-to-top" aria-label="Back to top" onClick={scrollUp}>
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" style={{ transform: busy ? "translateY(-2px)" : undefined, transition: "transform .3s var(--ease)" }}>
        <path d="M12 19V5" />
        <path d="m5.5 11.5 6.5-6.5 6.5 6.5" />
      </svg>
    </button>
  );
}
