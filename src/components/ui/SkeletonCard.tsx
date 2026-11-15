import type { CSSProperties, ReactElement } from "react";

interface SkeletonCardProps {
  className?: string;
  /** Position in the grid; drives the stagger wave through `--slot`. */
  index?: number;
}

const CHIP_WIDTHS = ["w-16", "w-20", "w-14", "w-24", "w-28", "w-20"] as const;
const TITLE_WIDTHS = ["w-11/12", "w-4/5", "w-3/4", "w-5/6", "w-2/3", "w-10/12"] as const;
const META_WIDTHS = ["w-1/2", "w-2/5", "w-3/5", "w-1/3", "w-7/12", "w-2/5"] as const;
const PRICE_WIDTHS = ["w-20", "w-16", "w-24", "w-28", "w-20", "w-16"] as const;

function pick<T>(list: readonly T[], index: number): T {
  return list[index % list.length] as T;
}

/** Single card placeholder. Mirrors ProductCard's box model so the swap to real content causes no layout shift. */
export function SkeletonCard({ className = "", index = 0 }: SkeletonCardProps): ReactElement {
  return (
    <article
      aria-hidden
      style={{ "--slot": index } as CSSProperties}
      className={`card flex flex-col overflow-hidden p-3 ${className}`}
    >
      <div className="sk-lane relative h-44 w-full overflow-hidden rounded-xl">
        <div className="sk-block absolute left-2 top-2 h-6 w-16 rounded-full [--sk-offset:90ms]" />
        <div className="sk-block absolute right-2 top-2 size-9 rounded-full [--sk-offset:140ms]" />
        <div className="sk-block absolute bottom-2 left-2 h-5 w-14 rounded-md [--sk-offset:190ms]" />
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-2">
        <div className={`sk-block h-3 rounded-full [--sk-offset:60ms] ${pick(CHIP_WIDTHS, index)}`} />
        <div className={`sk-block h-4 rounded [--sk-offset:110ms] ${pick(TITLE_WIDTHS, index)}`} />
        <div className={`sk-block h-3 rounded [--sk-offset:160ms] ${pick(META_WIDTHS, index)}`} />

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="flex flex-col gap-1.5">
            <div className={`sk-block h-5 rounded [--sk-offset:210ms] ${pick(PRICE_WIDTHS, index)}`} />
            <div className="sk-block h-3 w-14 rounded [--sk-offset:250ms]" />
          </div>
          <div className="sk-action h-9 w-24 rounded-xl" />
        </div>
      </div>
    </article>
  );
}