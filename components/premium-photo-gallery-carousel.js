"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(Boolean(media.matches));
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

const SLOT_STYLES = [
  {
    rel: -2,
    scale: 0.58,
    y: 6,
    brightness: 0.65,
    blur: 2,
    opacity: 0.78,
    z: 1
  },
  {
    rel: -1,
    scale: 0.72,
    y: 6,
    brightness: 0.82,
    blur: 1,
    opacity: 0.9,
    z: 3
  },
  {
    rel: 0,
    scale: 1,
    y: -8,
    brightness: 1,
    blur: 0,
    opacity: 1,
    z: 6
  },
  {
    rel: 1,
    scale: 0.72,
    y: 6,
    brightness: 0.82,
    blur: 1,
    opacity: 0.9,
    z: 3
  },
  {
    rel: 2,
    scale: 0.58,
    y: 6,
    brightness: 0.65,
    blur: 2,
    opacity: 0.78,
    z: 1
  }
];

function Lightbox({ open, items, index, onClose, onNavigate }) {
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigate(-1);
      if (event.key === "ArrowRight") onNavigate(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, onNavigate]);

  const pointerStateRef = useRef(null);

  const onPointerDown = (event) => {
    if (!open) return;
    pointerStateRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startTime: performance.now(),
      dx: 0
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    const state = pointerStateRef.current;
    if (!open || !state || state.id !== event.pointerId) return;
    state.dx = event.clientX - state.startX;
  };

  const onPointerUp = (event) => {
    const state = pointerStateRef.current;
    if (!open || !state || state.id !== event.pointerId) return;
    const dt = Math.max(1, performance.now() - state.startTime);
    const vx = state.dx / dt; // px/ms

    const threshold = 70;
    const flick = 0.65;
    if (Math.abs(state.dx) > threshold || Math.abs(vx) > flick) {
      onNavigate(state.dx > 0 ? -1 : 1);
    }
    pointerStateRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  if (!open) return null;

  const current = items[index];
  const alt = current?.alt || "Customer photo";

  return (
    <div
      className="premium-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen photo viewer"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <button className="premium-lightbox-close" type="button" onClick={onClose} aria-label="Close lightbox">
        Close
      </button>

      <div
        className="premium-lightbox-nav premium-lightbox-nav--left"
        aria-hidden="true"
        onClick={() => onNavigate(-1)}
      />
      <div
        className="premium-lightbox-nav premium-lightbox-nav--right"
        aria-hidden="true"
        onClick={() => onNavigate(1)}
      />

      <div className="premium-lightbox-media">
        <div className="premium-lightbox-frame">
          <Image
            src={current.src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function PremiumPhotoGalleryCarousel({ items, initialIndex = 0, ariaLabel = "Customer photo gallery" }) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(() => mod(initialIndex, items.length || 1));
  const [stageSize, setStageSize] = useState({ w: 0, h: 0, cardW: 0, cardH: 0, nearX: 0, farX: 0 });
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const dragXRef = useRef(0);
  const dragStateRef = useRef(null);
  const rafRef = useRef(0);
  const idleUntilRef = useRef(0);

  const length = items.length;

  const visible = useMemo(() => {
    if (!length) return [];
    return SLOT_STYLES.map((slot) => {
      const i = mod(activeIndex + slot.rel, length);
      return { slot, index: i, item: items[i] };
    });
  }, [activeIndex, items, length]);

  const go = useCallback(
    (delta) => {
      if (!length) return;
      setActiveIndex((prev) => mod(prev + delta, length));
      idleUntilRef.current = Date.now() + 3500;
    },
    [length]
  );

  const setActiveByIndex = useCallback(
    (index) => {
      if (!length) return;
      setActiveIndex(mod(index, length));
      idleUntilRef.current = Date.now() + 3500;
    },
    [length]
  );

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const w = rect.width || 1;

    // We intentionally oversubscribe total visible width so the 5 photos fill the frame without "gaps".
    const cardW = clamp(w * 0.38, 250, 520);
    const cardH = Math.round(cardW * (5 / 4)); // fixed aspect ratio prevents layout shift
    const nearX = Math.round(cardW * 0.64);
    const farX = Math.round(cardW * 1.12);
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    const desired = clamp(vh * 0.72, 520, 860);
    const h = Math.round(Math.max(cardH + 80, desired));

    setStageSize({ w, h, cardW, cardH, nearX, farX });
  }, []);

  useEffect(() => {
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const setDragX = useCallback((value) => {
    dragXRef.current = value;
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--drag-x", `${value}px`);
  }, []);

  const stopRaf = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  };

  const onPointerDown = (event) => {
    if (!length) return;
    event.preventDefault();
    setDragging(true);
    idleUntilRef.current = Date.now() + 4000;

    dragStateRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      startTime: performance.now(),
      lastTime: performance.now(),
      vx: 0
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    const s = dragStateRef.current;
    if (!s || s.id !== event.pointerId) return;
    event.preventDefault();

    const now = performance.now();
    const dx = event.clientX - s.startX;
    const dt = Math.max(1, now - s.lastTime);
    const step = event.clientX - s.lastX;
    s.vx = step / dt; // px/ms
    s.lastX = event.clientX;
    s.lastTime = now;

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        setDragX(dx);
      });
    }
  };

  const finishDrag = (event) => {
    const s = dragStateRef.current;
    if (!s || (event && s.id !== event.pointerId)) return;

    const dx = dragXRef.current;
    const dt = Math.max(1, performance.now() - s.startTime);
    const vx = dx / dt; // px/ms
    const flick = Math.abs(vx) > 0.7 || Math.abs(s.vx) > 0.7;

    // Snap to nearest slide(s) based on drag distance, with a small flick override.
    const basis = Math.max(1, stageSize.nearX || stageSize.cardW * 0.64);
    const stepsByDistance = clamp(Math.round(dx / basis), -3, 3);
    const threshold = Math.max(40, stageSize.cardW * 0.1);
    const steps = Math.abs(dx) > threshold ? stepsByDistance : 0;

    if (steps !== 0) {
      go(-steps);
    } else if (flick) {
      go(dx > 0 ? -1 : 1);
    }

    stopRaf();
    dragStateRef.current = null;
    setDragX(0);
    setDragging(false);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
    if (event.key === "Enter" || event.key === " ") {
      // If focused on the carousel container, open the center slide.
      event.preventDefault();
      setLightboxOpen(true);
      idleUntilRef.current = Date.now() + 5000;
    }
  };

  // Optional autoplay (disabled for reduced motion). Pauses on hover/drag/lightbox, resumes after inactivity.
  useEffect(() => {
    if (reducedMotion) return;
    if (!length) return;

    const id = window.setInterval(() => {
      const now = Date.now();
      if (hovered || dragging || lightboxOpen) return;
      if (now < idleUntilRef.current) return;
      go(1);
    }, 4200);

    return () => window.clearInterval(id);
  }, [dragging, go, hovered, length, lightboxOpen, reducedMotion]);

  const onCenterClick = () => {
    setLightboxOpen(true);
    idleUntilRef.current = Date.now() + 5000;
  };

  const onSlideClick = (slotRel, index) => {
    if (slotRel === 0) return onCenterClick();
    setActiveByIndex(index);
  };

  const onLightboxNavigate = useCallback(
    (delta) => {
      setActiveIndex((prev) => mod(prev + delta, length || 1));
    },
    [length]
  );

  return (
    <section className="premium-gallery" ref={containerRef} aria-label={ariaLabel}>
      <div
        className="premium-gallery-frame"
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        style={{
          height: stageSize.h ? `${stageSize.h}px` : undefined,
          // default drag-x for CSS calc
          ["--drag-x"]: "0px",
          ["--card-w"]: `${stageSize.cardW}px`,
          ["--card-h"]: `${stageSize.cardH}px`
        }}
      >
        <button
          type="button"
          className="premium-gallery-nav premium-gallery-nav--left"
          aria-label="Previous photo"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => go(-1)}
        >
          Prev
        </button>
        <button
          type="button"
          className="premium-gallery-nav premium-gallery-nav--right"
          aria-label="Next photo"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => go(1)}
        >
          Next
        </button>

        <div className="premium-gallery-edge premium-gallery-edge--left" aria-hidden="true" />
        <div className="premium-gallery-edge premium-gallery-edge--right" aria-hidden="true" />

        {visible.map(({ slot, index, item }) => {
          const x = Math.abs(slot.rel) === 2 ? stageSize.farX : stageSize.nearX;
          const signedX = slot.rel === 0 ? 0 : slot.rel < 0 ? -x : x;
          const isCenter = slot.rel === 0;

          // Fill the container with 5 visible slides without gaps by allowing controlled overlap.
          return (
            <button
              key={`${item.id}-${slot.rel}`}
              type="button"
              className={`premium-slide${isCenter ? " premium-slide--center" : ""}`}
              aria-label={isCenter ? "Open fullscreen photo" : "Bring photo to center"}
              onClick={() => onSlideClick(slot.rel, index)}
              style={{
                zIndex: slot.z,
                ["--slot-x"]: `${signedX}px`,
                ["--slot-y"]: `${slot.y}px`,
                ["--slot-scale"]: slot.scale,
                ["--slot-brightness"]: slot.brightness,
                ["--slot-blur"]: `${slot.blur}px`,
                ["--slot-opacity"]: slot.opacity,
                ["--slot-shadow"]: isCenter ? 1 : Math.abs(slot.rel) === 1 ? 0.78 : 0.6,
                transition: dragging || reducedMotion ? "none" : undefined
              }}
            >
              <span className="premium-slide-frame" aria-hidden="true" />
              <span className="premium-slide-media" aria-hidden="true">
                <span className="premium-slide-aspect">
                  <Image
                    src={item.src}
                    alt={item.alt || "Customer photo"}
                    fill
                    sizes={isCenter ? "60vw" : "26vw"}
                    priority={isCenter}
                    loading={isCenter ? "eager" : "lazy"}
                    quality={82}
                    style={{ objectFit: "cover" }}
                  />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <Lightbox
        open={lightboxOpen}
        items={items}
        index={activeIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={onLightboxNavigate}
      />
    </section>
  );
}
