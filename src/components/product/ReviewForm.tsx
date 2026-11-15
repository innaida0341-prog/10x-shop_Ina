import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { FormField } from "@/components/ui/FormField";
import { RatingInput } from "@/components/ui/Stars";
import { hasErrors, validateReview } from "@/utils/validation";
import type { FieldErrors } from "@/utils/validation";
import type { NewReview } from "@/types/product";

interface ReviewFormProps {
  onSubmit: (review: NewReview) => void;
}

export function ReviewForm({ onSubmit }: ReviewFormProps): ReactElement {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<FieldErrors<NewReview>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const draft: NewReview = { rating, comment: comment.trim() };
    const nextErrors = validateReview(draft);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    onSubmit(draft);
    setRating(0);
    setComment("");
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-border bg-surface-2 p-4">
      <h3 className="font-display text-base font-bold">Write a review</h3>

      <div className="mt-4 flex flex-col gap-4">
        <FormField id="review-rating" label="Your rating" error={errors.rating}>
          <RatingInput value={rating} onChange={setRating} invalid={Boolean(errors.rating)} />
        </FormField>

        <FormField id="review-comment" label="Your comment" error={errors.comment} hint="At least 10 characters.">
          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={3}
            placeholder="What did you like or dislike?"
            aria-invalid={Boolean(errors.comment)}
            aria-describedby={errors.comment ? "review-comment-error" : undefined}
            className="field resize-y"
          />
        </FormField>

        <button
          type="submit"
          className="tap self-start rounded-xl bg-brand px-6 font-semibold text-white transition hover:bg-brand-deep active:scale-[0.98]"
        >
          Submit review
        </button>
      </div>
    </form>
  );
}