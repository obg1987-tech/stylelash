"use client";

import Link from "next/link";

function applyMagnetic(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  const maxShift = 8;
  event.currentTarget.style.setProperty("--mag-x", `${(px * maxShift).toFixed(2)}px`);
  event.currentTarget.style.setProperty("--mag-y", `${(py * maxShift).toFixed(2)}px`);
}

function resetMagnetic(event) {
  event.currentTarget.style.setProperty("--mag-x", "0px");
  event.currentTarget.style.setProperty("--mag-y", "0px");
}

export default function SnapFloatingHomeButton() {
  return (
    <Link
      href="/"
      className="snap-floating-home-btn"
      aria-label="Go to home"
      onMouseMove={applyMagnetic}
      onMouseLeave={resetMagnetic}
    >
      <span>Home</span>
      <small>Main</small>
    </Link>
  );
}

