import type { ReactElement } from "react";

export function Stars({ rating }: { rating: number }): ReactElement {
  const rounded = Math.round(rating);
  return (
    <span className="text-amber" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {"★".repeat(Math.max(0, Math.min(5, rounded)))}
      <span className="text-border">{"★".repeat(Math.max(0, 5 - rounded))}</span>
    </span>
  );
}

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  invalid?: boolean;
}

export function RatingInput({ value, onChange, invalid = false }: RatingInputProps): ReactElement {
  return (
    <div className="flex gap-1.5" role="group" aria-label="Rating" aria-invalid={invalid}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          aria-pressed={value === star}
          className={`tap grid place-items-center rounded-xl border text-xl transition active:scale-95 ${
            star <= value
              ? "border-amber/50 bg-amber/15 text-amber"
              : "border-border bg-surface-2 text-border hover:border-amber/40 hover:text-amber"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}