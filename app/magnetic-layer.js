"use client";

import { useEffect } from "react";

export default function MagneticLayer() {
  useEffect(() => {
    try {
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!finePointer || reduceMotion) return;

      const cards = Array.from(document.querySelectorAll("[data-magnetic='true']"));
      const cleanups = [];

      cards.forEach((card) => {
        if (!(card instanceof HTMLElement)) return;
        let rafId = 0;

        const onMove = (event) => {
          const rect = card.getBoundingClientRect();
          if (!rect.width || !rect.height) return;

          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;

          const rx = (-py * 8).toFixed(2);
          const ry = (px * 10).toFixed(2);
          const mx = (px * 8).toFixed(2);
          const my = (py * 8).toFixed(2);

          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            card.style.willChange = "transform";
            card.style.transform = `translate3d(${mx}px, ${my}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
          });
        };

        const onLeave = () => {
          cancelAnimationFrame(rafId);
          card.style.transform = "";
          card.style.willChange = "";
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          cancelAnimationFrame(rafId);
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    } catch {
      return;
    }
  }, []);

  return null;
}
