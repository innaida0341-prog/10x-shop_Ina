import { useEffect, useRef } from "react";
import type { RefObject } from "react";

export function useIntersection<T extends Element>(
  onEnter: () => void,
  enabled: boolean,
  resetKey: number,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const callback = useRef(onEnter);
  callback.current = onEnter;

  useEffect(() => {
    const node = ref.current;
    if (node === null || !enabled) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) callback.current();
      },
      { rootMargin: "360px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, resetKey]);

  return ref;
}