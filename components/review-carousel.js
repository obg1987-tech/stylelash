"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ReviewCarousel({ cards }) {
  const loopRef = useRef(null);
  const setRef = useRef(null);
  const offsetRef = useRef(0);
  const speedRef = useRef(0.24);
  const momentumRef = useRef(0);
  const halfWidthRef = useRef(1);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const measure = () => {
      const width = setRef.current?.offsetWidth || 1;
      halfWidthRef.current = width;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [cards]);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const loop = loopRef.current;
      if (!loop) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (!draggingRef.current) {
        if (Math.abs(momentumRef.current) > 0.02) {
          offsetRef.current += momentumRef.current;
          momentumRef.current *= 0.94;
        } else {
          momentumRef.current = 0;
          if (!hovered) {
            offsetRef.current -= speedRef.current;
          }
        }
      }

      const limit = halfWidthRef.current;
      if (offsetRef.current <= -limit) offsetRef.current += limit;
      if (offsetRef.current >= 0) offsetRef.current -= limit;
      loop.style.transform = `translateX(${offsetRef.current}px)`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [hovered]);

  const onPointerDown = (event) => {
    event.preventDefault();
    draggingRef.current = true;
    lastXRef.current = event.clientX;
    lastTimeRef.current = performance.now();
    momentumRef.current = 0;
    setHovered(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!draggingRef.current) return;
    event.preventDefault();
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const delta = event.clientX - lastXRef.current;
    lastXRef.current = event.clientX;
    lastTimeRef.current = now;
    offsetRef.current += delta * 1.1;
    const velocity = delta / dt; // px/ms
    momentumRef.current = velocity * 16 * 1.35; // px/frame with gain
  };

  const onPointerUp = (event) => {
    draggingRef.current = false;
    setHovered(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const onWheel = (event) => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    offsetRef.current -= delta * 0.45;
  };

  return (
    <div className="review-carousel-viewport">
      <div
        className="review-carousel-track review-carousel-track--interactive"
        ref={loopRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onDragStart={(event) => event.preventDefault()}
      >
        <div className="review-carousel-set" ref={setRef}>
          {cards.map((card, index) => (
            <article className="review-slide-card" key={`a-${card.image}-${index}`}>
              <div className="review-slide-media">
                <Image src={card.image} alt={card.title} fill quality={72} sizes="280px" />
                <span className="snap-star snap-star--a" aria-hidden />
                <span className="snap-star snap-star--b" aria-hidden />
                <span className="snap-star snap-star--c" aria-hidden />
              </div>
            </article>
          ))}
        </div>
        <div className="review-carousel-set" aria-hidden>
          {cards.map((card, index) => (
            <article className="review-slide-card" key={`b-${card.image}-${index}`}>
              <div className="review-slide-media">
                <Image src={card.image} alt="" fill quality={72} sizes="280px" />
                <span className="snap-star snap-star--a" aria-hidden />
                <span className="snap-star snap-star--b" aria-hidden />
                <span className="snap-star snap-star--c" aria-hidden />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
