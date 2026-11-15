import type { ReactElement } from "react";

interface QuantityStepperProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
}

export function QuantityStepper({ value, max, onChange, disabled = false, label = "Quantity" }: QuantityStepperProps): ReactElement {
  const locked = disabled || max <= 0;

  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border border-border bg-surface-2" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={locked || value <= 1}
        aria-label="Decrease quantity"
        className="tap grid place-items-center px-3 text-lg font-bold transition hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-35"
      >
        −
      </button>
      <span className="min-w-10 text-center font-display text-sm font-bold tabular-nums" aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={locked || value >= max}
        aria-label="Increase quantity"
        className="tap grid place-items-center px-3 text-lg font-bold transition hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-35"
      >
        +
      </button>
    </div>
  );
}