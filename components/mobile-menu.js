"use client";

import { useEffect, useRef, useState } from "react";

export default function MobileMenu({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleToggle = (event) => {
    event.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <details className="mobile-menu" open={isOpen} ref={rootRef}>
      <summary aria-label="메뉴 열기" onClick={handleToggle}>
        Menu
      </summary>
      <div className="mobile-menu-panel">
        {items.map((item) => (
          <a key={item.href} href={item.href} onClick={handleLinkClick}>
            {item.label}
          </a>
        ))}
      </div>
    </details>
  );
}
