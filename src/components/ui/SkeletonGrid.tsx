import type { CSSProperties, ReactElement } from "react";
import { SkeletonCard } from "./SkeletonCard";

export type SkeletonView = "grid" | "list";

interface SkeletonGridProps {
  /** Number of placeholders. Clamped to 1–24. */
  count?: number;
  /** Matches the catalog's active view so the swap keeps the same footprint. */
  view?: SkeletonView;
  className?: string;
  /** Announced to assistive technology while content resolves. */
  label?: string;
}

const SLOT_KEYS = [
  "slot-01", "slot-02", "slot-03", "slot-04", "slot-05", "slot-06",
  "slot-07", "slot-08", "slot-09", "slot-10", "slot-11", "slot-12",
  "slot-13", "slot-14", "slot-15", "slot-16", "slot-17", "slot-18",
  "slot-19", "slot-20", "slot-21", "slot-22", "slot-23", "slot-24",
] as const;

const CHIP_WIDTHS = ["w-16", "w-20", "w-14", "w-24", "w-28", "w-20"] as const;
const TITLE_WIDTHS = ["w-11/12", "w-4/5", "w-3/4", "w-5/6", "w-2/3", "w-10/12"] as const;
const META_WIDTHS = ["w-1/2", "w-2/5", "w-3/5", "w-1/3", "w-7/12", "w-2/5"] as const;
const PRICE_WIDTHS = ["w-20", "w-16", "w-24", "w-28", "w-20", "w-16"] as const;

const GRID_CLASS =
  "grid grid-cols-1 gap-5 min-[481px]:grid-cols-2 md:grid-cols-3 min-[1025px]:grid-cols-4";

function pick<T>(list: readonly T[], index: number): T {
  return list[index % list.length] as T;
}

/** Horizontal placeholder mirroring ProductRow so switching views never jumps. */
function SkeletonRow({ index }: { index: number }): ReactElement {
  return (
    <article
      aria-hidden
      style={{ "--slot": index } as CSSProperties}
      className="card flex items-stretch gap-4 p-3"
    >
      <div className="sk-lane size-28 shrink-0 rounded-xl sm:size-32" />

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <div className={`sk-block h-3 rounded-full [--sk-offset:70ms] ${pick(CHIP_WIDTHS, index)}`} />
        <div className={`sk-block h-4 rounded [--sk-offset:120ms] ${pick(TITLE_WIDTHS, index)}`} />
        <div className="sk-block h-3 w-full max-w-md rounded [--sk-offset:170ms]" />
        <div className={`sk-block h-3 rounded [--sk-offset:220ms] ${pick(META_WIDTHS, index)}`} />
      </div>

      <div className="flex w-28 shrink-0 flex-col items-end justify-center gap-2 sm:w-36">
        <div className={`sk-block h-5 rounded [--sk-offset:240ms] ${pick(PRICE_WIDTHS, index)}`} />
        <div className="sk-block h-3 w-14 rounded [--sk-offset:260ms]" />
        <div className="sk-action h-9 w-full rounded-xl" />
      </div>
    </article>
  );
}

/** Loading placeholders for the catalog and lazy routes. Opacity-only motion stays on the compositor. */
export function SkeletonGrid({
  count = 12,
  view = "grid",
  className = "",
  label = "Loading products",
}: SkeletonGridProps): ReactElement {
  const requested = Number.isFinite(count) ? Math.trunc(count) : 12;
  const safeCount = Math.max(1, Math.min(requested, SLOT_KEYS.length));
  const slots = SLOT_KEYS.slice(0, safeCount);

  return (
    <div
      role="status"
      aria-live="polite"
      data-print="hide"
      className={`${view === "list" ? "flex flex-col gap-4" : GRID_CLASS} ${className}`}
    >
      <span className="sr-only">{label}</span>
      {slots.map((slot, index) =>
        view === "list" ? (
          <SkeletonRow key={slot} index={index} />
        ) : (
          <SkeletonCard key={slot} index={index} />
        ),
      )}
    </div>
  );
}