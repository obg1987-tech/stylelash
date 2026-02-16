"use client";

/* eslint-disable react-hooks/purity */
// This component uses wall-clock time only inside event handlers/timers to manage autoplay idling.
// The `react-hooks/purity` rule can false-positive by flagging time calls that are not executed during render.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function applyDragResistance(rawSlides, maxPreview) {
  const abs = Math.abs(rawSlides);
  if (abs <= 1) return rawSlides;
  const beyond = abs - 1;
  const resisted = 1 + beyond / (1 + beyond * 0.85);
  return clamp(Math.sign(rawSlides) * resisted, -maxPreview, maxPreview);
}

function estimateVelocityPxMs(samples, now, windowMs) {
  if (!samples || samples.length < 2) return 0;
  const cutoff = now - windowMs;
  const recent = samples.filter((s) => s.t >= cutoff);
  if (recent.length < 2) return 0;

  // Weighted average where newer samples have more influence.
  let weighted = 0;
  let weightSum = 0;
  for (let i = 1; i < recent.length; i += 1) {
    const prev = recent[i - 1];
    const curr = recent[i];
    const dt = Math.max(1, curr.t - prev.t);
    const vx = (curr.x - prev.x) / dt;
    const w = i;
    weighted += vx * w;
    weightSum += w;
  }
  return weightSum > 0 ? weighted / weightSum : 0;
}

function isIOSLikeDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function inferTrackpadLike(samples) {
  if (!samples || samples.length < 5) return false;
  let dxSum = 0;
  let dtSum = 0;
  let n = 0;
  for (let i = 1; i < samples.length; i += 1) {
    const prev = samples[i - 1];
    const curr = samples[i];
    dxSum += Math.abs(curr.x - prev.x);
    dtSum += Math.max(1, curr.t - prev.t);
    n += 1;
  }
  if (!n) return false;
  const avgDx = dxSum / n;
  const avgDt = dtSum / n;
  return avgDx < 2.6 && avgDt < 12;
}

function getDragProfile(pointerType, viewportWidth, options = {}) {
  const { isIOS = false, isTrackpadLike = false } = options;
  const type = pointerType || "mouse";
  const isNarrow = viewportWidth > 0 && viewportWidth <= 440;

  if (type === "touch") {
    const iosBoost = isIOS ? 0.03 : 0;
    return {
      basisScale: isNarrow ? 0.71 : 0.76,
      threshold: (isNarrow ? 0.14 : 0.17) - (isIOS ? 0.01 : 0),
      flickVelocity: 0.32,
      flickSlidesPerSec: 1.12,
      velocityDeadzone: 0.045,
      velocityWindowMs: isIOS ? 110 : 90,
      momentumSeconds: 0.21 + iosBoost,
      snapBias: 0.12,
      maxPreview: 2.15,
      followLerp: isIOS ? 0.84 : 0.78,
      maxSteps: 2
    };
  }

  if (type === "pen") {
    return {
      basisScale: 0.84,
      threshold: 0.19,
      flickVelocity: 0.4,
      flickSlidesPerSec: 1.2,
      velocityDeadzone: 0.04,
      velocityWindowMs: 85,
      momentumSeconds: 0.18,
      snapBias: 0.1,
      maxPreview: 2.3,
      followLerp: 0.72,
      maxSteps: 2
    };
  }

  if (isTrackpadLike) {
    return {
      basisScale: 0.84,
      threshold: 0.2,
      flickVelocity: 0.4,
      flickSlidesPerSec: 1.06,
      velocityDeadzone: 0.03,
      velocityWindowMs: 96,
      momentumSeconds: 0.19,
      snapBias: 0.1,
      maxPreview: 2.45,
      followLerp: 0.74,
      maxSteps: 3
    };
  }

  return {
    basisScale: 0.9,
    threshold: 0.22,
    flickVelocity: 0.5,
    flickSlidesPerSec: 1.28,
    velocityDeadzone: 0.035,
    velocityWindowMs: 80,
    momentumSeconds: 0.16,
    snapBias: 0.08,
    maxPreview: 2.8,
    followLerp: 0.66,
    maxSteps: 3
  };
}

function getSettleProfile(pointerType) {
  const type = pointerType || "mouse";
  if (type === "touch") {
    return { k: 40, d: 12.5, velocityGain: 0.5, maxSeedVelocity: 4.8 };
  }
  if (type === "pen") {
    return { k: 42, d: 13, velocityGain: 0.46, maxSeedVelocity: 5.2 };
  }
  return { k: 46, d: 14.5, velocityGain: 0.42, maxSeedVelocity: 5.8 };
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
  // Continuous offset (in slides) relative to activeIndex. May be >1 during drag, but we commit steps during settle.
  const [offsetSlides, setOffsetSlides] = useState(0);
  const [settling, setSettling] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const dragPxRef = useRef(0);
  const dragStateRef = useRef(null);
  const rafRef = useRef(0);
  const settleRafRef = useRef(0);
  const offsetRef = useRef(0);
  const settleTargetRef = useRef(0);
  const settleVelRef = useRef(0);
  const settleTimeRef = useRef(0);
  const settleKRef = useRef(44);
  const settleDRef = useRef(14);
  const idleUntilRef = useRef(0);

  const length = items.length;

  // Visible items are derived at render-time from (activeIndex + offsetSlides) so we don't memoize a stale window.

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

  const stopRaf = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  };

  const stopSettle = () => {
    if (settleRafRef.current) cancelAnimationFrame(settleRafRef.current);
    settleRafRef.current = 0;
    settleVelRef.current = 0;
    settleTargetRef.current = 0;
    settleTimeRef.current = 0;
    setSettling(false);
  };

  const basisBase = Math.max(1, stageSize.nearX || stageSize.cardW * 0.64);

  const tension = useCallback(
    (rawSlides, maxPreview) => applyDragResistance(rawSlides, maxPreview),
    []
  );

  const setOffset = useCallback((value) => {
    offsetRef.current = value;
    setOffsetSlides(value);
  }, []);

  const startDragLoop = useCallback(() => {
    if (rafRef.current) return;

    const tick = () => {
      const s = dragStateRef.current;
      if (!s) {
        rafRef.current = 0;
        return;
      }

      const viewportWidth = s.viewportWidth || (typeof window !== "undefined" ? window.innerWidth : 0);
      const profile = getDragProfile(s.pointerType, viewportWidth, {
        isIOS: s.isIOS,
        isTrackpadLike: s.isTrackpadLike
      });
      const dragBasis = basisBase * profile.basisScale;
      const rawSlides = -s.pendingDx / Math.max(1, dragBasis);
      const targetOffset = tension(rawSlides, profile.maxPreview);
      const smoothedOffset = offsetRef.current + (targetOffset - offsetRef.current) * profile.followLerp;
      setOffset(smoothedOffset);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [basisBase, setOffset, tension]);

  const startSettleLoop = useCallback(() => {
    if (settleRafRef.current) return;
    setSettling(true);

    const tick = (now) => {
      const last = settleTimeRef.current || now;
      const dt = clamp((now - last) / 1000, 0.008, 0.05);
      settleTimeRef.current = now;

      const current = offsetRef.current;
      let target = settleTargetRef.current;
      let v = settleVelRef.current;

      // Critically-damped-ish spring. v is in slides/sec.
      const diff = target - current;
      const k = settleKRef.current; // stiffness
      const d = settleDRef.current; // damping
      v += diff * k * dt;
      v *= Math.exp(-d * dt);
      let next = current + v * dt;

      // Commit whole-slide steps as we cross them (supports multi-step target smoothly).
      let committed = 0;
      if (next >= 1 || next <= -1) {
        committed = next > 0 ? Math.floor(next) : Math.ceil(next);
        next -= committed;
        target -= committed;
      }
      if (committed) {
        setActiveIndex((prev) => mod(prev + committed, length));
      }

      settleTargetRef.current = target;
      settleVelRef.current = v;
      setOffset(next);

      const done = Math.abs(target) < 0.001 && Math.abs(next) < 0.001 && Math.abs(v) < 0.02;
      if (done) {
        settleRafRef.current = 0;
        settleVelRef.current = 0;
        settleTargetRef.current = 0;
        settleTimeRef.current = 0;
        setOffset(0);
        setSettling(false);
        return;
      }

      settleRafRef.current = requestAnimationFrame(tick);
    };

    settleRafRef.current = requestAnimationFrame(tick);
  }, [length, setOffset]);

  const navigateBy = useCallback(
    (delta) => {
      if (!length) return;
      idleUntilRef.current = Date.now() + 3500;
      const d = clamp(delta, -3, 3);

      if (reducedMotion) {
        setActiveIndex((prev) => mod(prev + d, length));
        setOffset(0);
        stopSettle();
        return;
      }

      // Accumulate rapid clicks (prevents "no response" feel).
      settleKRef.current = 44;
      settleDRef.current = 14;
      settleTargetRef.current = clamp(settleTargetRef.current + d, -12, 12);
      startSettleLoop();
    },
    [length, reducedMotion, setOffset, startSettleLoop]
  );

  const navigateToSteps = useCallback(
    (steps, options = {}) => {
      if (!length) return;
      idleUntilRef.current = Date.now() + 3500;
      const s = clamp(steps, -3, 3);

      if (reducedMotion) {
        if (s) setActiveIndex((prev) => mod(prev + s, length));
        setOffset(0);
        stopSettle();
        return;
      }

      // Override target (used for drag release or "bring to center" click).
      settleKRef.current = options.k || 44;
      settleDRef.current = options.d || 14;
      if (typeof options.seedVelocity === "number") {
        settleVelRef.current = options.seedVelocity;
      }
      settleTargetRef.current = s;
      startSettleLoop();
    },
    [length, reducedMotion, setOffset, startSettleLoop]
  );

  const onPointerDown = (event) => {
    if (!length) return;
    event.preventDefault();
    stopSettle();
    setDragging(true);
    idleUntilRef.current = Date.now() + 4000;

    dragStateRef.current = {
      id: event.pointerId,
      pointerType: event.pointerType || "mouse",
      startX: event.clientX,
      lastX: event.clientX,
      startTime: performance.now(),
      lastTime: performance.now(),
      vx: 0,
      samples: [{ x: event.clientX, t: performance.now() }],
      pendingDx: 0,
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : 0,
      isIOS: isIOSLikeDevice(),
      isTrackpadLike: false
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
    startDragLoop();
  };

  const onPointerMove = (event) => {
    const s = dragStateRef.current;
    if (!s || s.id !== event.pointerId) return;
    event.preventDefault();

    s.viewportWidth = typeof window !== "undefined" ? window.innerWidth : s.viewportWidth;
    const now = performance.now();
    const dx = event.clientX - s.startX;
    s.samples.push({ x: event.clientX, t: now });
    if (s.samples.length > 9) s.samples.shift();
    if (s.pointerType === "mouse") {
      s.isTrackpadLike = inferTrackpadLike(s.samples);
    }
    const profile = getDragProfile(s.pointerType, s.viewportWidth, {
      isIOS: s.isIOS,
      isTrackpadLike: s.isTrackpadLike
    });
    s.vx = estimateVelocityPxMs(s.samples, now, profile.velocityWindowMs);
    s.lastX = event.clientX;
    s.lastTime = now;
    s.pendingDx = dx;
    dragPxRef.current = dx;
    startDragLoop();
  };

  const finishDrag = (event) => {
    const s = dragStateRef.current;
    if (!s || (event && s.id !== event.pointerId)) return;

    const profile = getDragProfile(s.pointerType, s.viewportWidth, {
      isIOS: s.isIOS,
      isTrackpadLike: s.isTrackpadLike
    });
    const latestDx = event ? event.clientX - s.startX : dragPxRef.current;
    const dx = Number.isFinite(latestDx) ? latestDx : dragPxRef.current;
    const releaseBasis = basisBase * profile.basisScale;
    const rawSlides = -dx / Math.max(1, releaseBasis);
    const velocitySlidesPerSec = (-s.vx * 1000) / Math.max(1, releaseBasis);
    const projectedSlides = rawSlides + velocitySlidesPerSec * profile.momentumSeconds;
    const flick = Math.abs(s.vx) > profile.flickVelocity;
    const farEnough = Math.abs(projectedSlides) > profile.threshold;
    const velocityDirection = Math.abs(s.vx) >= profile.velocityDeadzone ? Math.sign(-s.vx) : 0;
    const projectedDirection = Math.sign(projectedSlides);
    const direction = farEnough ? Math.sign(projectedSlides) : velocityDirection;
    let steps = 0;
    if (farEnough || flick) {
      const snapBase = projectedSlides + profile.snapBias * projectedDirection;
      const velocityPower = Math.max(0, Math.abs(velocitySlidesPerSec) - profile.flickSlidesPerSec) * 0.42;
      const baseSteps = Math.round(Math.abs(snapBase) + velocityPower);
      const flickStrong = Math.abs(velocitySlidesPerSec) > profile.flickSlidesPerSec;
      const minFlickStep = flickStrong ? 1 : 0;
      steps = clamp(Math.max(baseSteps, minFlickStep), 1, profile.maxSteps);
    }
    const target = direction ? direction * steps : 0;
    const settleProfile = getSettleProfile(s.pointerType);
    const seedVelocity = clamp(
      velocitySlidesPerSec * settleProfile.velocityGain,
      -settleProfile.maxSeedVelocity,
      settleProfile.maxSeedVelocity
    );

    stopRaf();
    dragStateRef.current = null;
    setDragging(false);
    dragPxRef.current = 0;

    navigateToSteps(target, {
      seedVelocity: target ? seedVelocity : 0,
      k: settleProfile.k,
      d: settleProfile.d
    });
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateBy(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateBy(1);
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
      navigateBy(1);
    }, 4200);

    return () => window.clearInterval(id);
  }, [dragging, hovered, length, lightboxOpen, navigateBy, reducedMotion]);

  const onCenterClick = () => {
    setLightboxOpen(true);
    idleUntilRef.current = Date.now() + 5000;
  };

  const onLightboxNavigate = useCallback(
    (delta) => {
      setActiveIndex((prev) => mod(prev + delta, length || 1));
    },
    [length]
  );

  const slotStyleMap = useMemo(() => {
    const map = new Map();
    for (const style of SLOT_STYLES) map.set(style.rel, style);
    return map;
  }, []);

  const styleAt = (pos) => {
    const clamped = clamp(pos, -2, 2);
    const a = Math.floor(clamped);
    const b = Math.ceil(clamped);
    const alpha = b === a ? 0 : clamped - a;

    const sa = slotStyleMap.get(a) || slotStyleMap.get(0);
    const sb = slotStyleMap.get(b) || slotStyleMap.get(0);

    const lerp = (x, y) => x + (y - x) * alpha;

    const absPos = Math.abs(clamped);
    const xDist =
      absPos <= 1
        ? basisBase * absPos
        : basisBase + (stageSize.farX - basisBase) * clamp(absPos - 1, 0, 1);
    const x = clamped === 0 ? 0 : (clamped < 0 ? -1 : 1) * xDist;

    const shadow =
      absPos <= 1 ? 1 - 0.22 * absPos : 0.78 - 0.18 * clamp(absPos - 1, 0, 1);
    const zIndex = 100 - Math.round(absPos * 12);
    const motionSoft = dragging || settling ? 0.34 : 0;
    const baseScale = lerp(sa.scale, sb.scale);
    const baseBrightness = lerp(sa.brightness, sb.brightness);
    const baseBlur = lerp(sa.blur, sb.blur);
    const baseOpacity = lerp(sa.opacity, sb.opacity);

    return {
      x,
      y: lerp(sa.y, sb.y),
      scale: baseScale + (1 - baseScale) * motionSoft * 0.2,
      brightness: baseBrightness + (1 - baseBrightness) * motionSoft * 0.45,
      blur: baseBlur * (1 - motionSoft * 0.42),
      opacity: baseOpacity + (1 - baseOpacity) * motionSoft * 0.28,
      shadow,
      zIndex
    };
  };

  // Render window derived from current continuous offset.
  const shift = Math.trunc(offsetSlides);
  const local = offsetSlides - shift; // (-1..1)
  const baseIndex = mod(activeIndex + shift, length || 1);

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
          ["--card-w"]: `${stageSize.cardW}px`,
          ["--card-h"]: `${stageSize.cardH}px`,
          ["--near-x"]: `${stageSize.nearX}px`,
          ["--far-x"]: `${stageSize.farX}px`
        }}
      >
        <button
          type="button"
          className="premium-gallery-nav premium-gallery-nav--left"
          aria-label="Previous photo"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => navigateBy(-1)}
        >
          Prev
        </button>
        <button
          type="button"
          className="premium-gallery-nav premium-gallery-nav--right"
          aria-label="Next photo"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => navigateBy(1)}
        >
          Next
        </button>

        <div className="premium-gallery-edge premium-gallery-edge--left" aria-hidden="true" />
        <div className="premium-gallery-edge premium-gallery-edge--right" aria-hidden="true" />

        {SLOT_STYLES.map((slot) => {
          const index = mod(baseIndex + slot.rel, length || 1);
          const item = items[index];
          const virtual = slot.rel - local;
          const computed = styleAt(virtual);
          const isCenter = Math.abs(virtual) < 0.45;
          // Keep center emphasis stable during movement to avoid a "focus-stop" feeling.
          const emphasizeCenter = !dragging && !settling && isCenter;
          const eagerLoad = slot.rel === 0;
          const stepsToCenter = shift + slot.rel;

          // Fill the container with 5 visible slides without gaps by allowing controlled overlap.
          return (
            <button
              key={`${item.id}-${slot.rel}`}
              type="button"
              className={`premium-slide${emphasizeCenter ? " premium-slide--center" : ""}`}
              aria-label={isCenter ? "Open fullscreen photo" : "Bring photo to center"}
              onClick={() => (isCenter ? onCenterClick() : navigateToSteps(stepsToCenter))}
              style={{
                zIndex: computed.zIndex,
                ["--slot-x"]: `${computed.x.toFixed(2)}px`,
                ["--slot-y"]: `${computed.y}px`,
                ["--slot-scale"]: computed.scale,
                ["--slot-brightness"]: computed.brightness,
                ["--slot-blur"]: `${computed.blur}px`,
                ["--slot-opacity"]: computed.opacity,
                ["--slot-shadow"]: computed.shadow,
                transition: dragging || settling || reducedMotion ? "none" : undefined
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
                    priority={eagerLoad}
                    loading={eagerLoad ? "eager" : "lazy"}
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
