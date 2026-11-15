import type { ReactElement } from "react";
import { Stars } from "@/components/ui/Stars";
import { formatDate } from "@/utils/format";
import type { Review } from "@/types/product";

export function ReviewList({ reviews }: { reviews: Review[] }): ReactElement {
  if (reviews.length === 0) {
    return <p className="py-6 text-sm text-muted">No reviews yet — be the first to share your experience.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {reviews.map((review, index) => (
        <li key={`${review.reviewerName}-${review.date}-${index}`} className="rounded-xl border border-border bg-surface-2 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-display text-sm font-bold">{review.reviewerName}</span>
            <span className="text-xs text-muted">{formatDate(review.date)}</span>
          </div>
          <div className="mt-1 text-sm"><Stars rating={review.rating} /></div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}