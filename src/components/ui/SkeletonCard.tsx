import type { ReactElement } from "react";

export function SkeletonCard(): ReactElement {
  return (
    <div className="card overflow-hidden p-3">
      <div className="shimmer h-44 w-full rounded-xl" />
      <div className="shimmer mt-4 h-4 w-4/5 rounded-full" />
      <div className="shimmer mt-2 h-3 w-2/5 rounded-full" />
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="shimmer h-7 w-24 rounded-full" />
        <div className="shimmer h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-5 min-[481px]:grid-cols-2 md:grid-cols-3 min-[1025px]:grid-cols-4">
      {Array.from({ length: count }, (_, index) => <SkeletonCard key={index} />)}
    </div>
  );
}