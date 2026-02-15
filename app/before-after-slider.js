"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function BeforeAfterSlider() {
  const trackRef = useRef(null);
  const targetRef = useRef(0.5);
  const rafRef = useRef(0);
  const draggingRef = useRef(false);
  const [ratio, setRatio] = useState(0.5);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const scheduleRender = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setRatio(targetRef.current);
      rafRef.current = 0;
    });
  };

  const updateByClientX = (clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    targetRef.current = Math.max(0.05, Math.min(0.95, raw));
    scheduleRender();
  };

  const onPointerMove = (event) => {
    if (!draggingRef.current) return;
    updateByClientX(event.clientX);
  };

  const onHandlePointerDown = (event) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const onHandlePointerUp = (event) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      targetRef.current = Math.max(0.05, targetRef.current - 0.04);
      scheduleRender();
    }
    if (event.key === "ArrowRight") {
      targetRef.current = Math.min(0.95, targetRef.current + 0.04);
      scheduleRender();
    }
  };

  return (
    <div className="ba-compare-wrap reveal">
      <div
        ref={trackRef}
        className="ba-compare"
        onDragStart={(event) => event.preventDefault()}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
        role="slider"
        aria-label="?꾪썑 ?ъ쭊 鍮꾧탳 ?щ씪?대뜑"
        aria-valuemin={5}
        aria-valuemax={95}
        aria-valuenow={Math.round(ratio * 100)}
        tabIndex={0}
      >
        <div className="ba-layer ba-after">
          <Image
            src="/assets/before-after/2.png"
            alt="?덉뜾臾몄떊 ?쒖닠 ???대?吏"
            fill
            draggable={false}
            quality={76}
            sizes="(max-width: 800px) 100vw, 76vw"
          />
          <span className="ba-tag ba-tag-right">After</span>
        </div>

        <div className="ba-layer ba-before" style={{ clipPath: `inset(0 ${100 - ratio * 100}% 0 0)` }}>
          <Image
            src="/assets/before-after/1.png"
            alt="?덉뜾臾몄떊 ?쒖닠 ???대?吏"
            fill
            draggable={false}
            quality={76}
            sizes="(max-width: 800px) 100vw, 76vw"
          />
          <span className="ba-tag ba-tag-left">Before</span>
        </div>

        <div className="ba-divider" style={{ left: `${ratio * 100}%` }}>
          <div className="ba-line" />
          <div
            className="ba-knob"
            aria-hidden
            onPointerDown={onHandlePointerDown}
            onPointerUp={onHandlePointerUp}
            onPointerCancel={onHandlePointerUp}
            onPointerMove={onPointerMove}
          >
            <span>↔</span>
          </div>
        </div>
      </div>
    </div>
  );
}
