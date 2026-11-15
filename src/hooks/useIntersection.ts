import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const FIRE_COOLDOWN_MS = 420;

/**
 * Observes a sentinel and reports genuine arrivals into view.
 *
 * The observer is created once per `resetKey` and never torn down when `enabled`
 * flips, because re-observing an already-intersecting node delivers a fresh
 * notification and would re-trigger the loader in an unattended loop. `enabled`
 * is read through a ref at fire time instead.
 *
 * A passive, rAF-throttled scroll listener re-arms the trigger for tall viewports
 * where the sentinel never leaves the root margin, so paging still advances while
 * the user scrolls and stops the moment they do.
 */
export function useIntersection<T extends Element>(
  onEnter: () => void,
  enabled: boolean,
  resetKey: number,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const callbackRef = useRef(onEnter);
  const enabledRef = useRef(enabled);

  callbackRef.current = onEnter;
  enabledRef.current = enabled;

  useEffect(() => {
    const node = ref.current;
    if (node === null) return;
    if (typeof IntersectionObserver === "undefined") return;

    let inside = false;
    let lastFire = 0;
    let frame = 0;

    const fire = (): void => {
      if (!inside || !enabledRef.current) return;
      const now = performance.now();
      if (now - lastFire < FIRE_COOLDOWN_MS) return;
      lastFire = now;
      callbackRef.current();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry === undefined) return;
        const wasInside = inside;
        inside = entry.isIntersecting;
        if (inside && !wasInside) fire();
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );

    const onScroll = (): void => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        fire();
      });
    };

    observer.observe(node);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [resetKey]);

  return ref;
}