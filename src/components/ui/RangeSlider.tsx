import type { ReactElement } from "react";
import { PRICE_CEILING, PRICE_FLOOR, PRICE_STEP } from "@/utils/constants";
import { clampRange, rangePercent } from "@/utils/price";
import { formatPrice } from "@/utils/format";
import type { PriceRange } from "@/types/bonus";

interface RangeSliderProps {
  value: PriceRange;
  onChange: (value: PriceRange) => void;
  label: string;
}

export function RangeSlider({ value, onChange, label }: RangeSliderProps): ReactElement {
  const { min, max } = clampRange(value);
  const { left, right } = rangePercent({ min, max });

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">{label}</span>
        <span className="font-display text-sm font-bold tabular-nums text-range">
          {formatPrice(min)} – {formatPrice(max)}
        </span>
      </div>

      <div className="relative mt-3 h-9">
        <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-border" />
        <span
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
          style={{
            left: `${left}%`,
            right: `${right}%`,
            background: "linear-gradient(90deg, var(--color-range), var(--color-brand))",
          }}
        />
        <input
          type="range"
          className="range-input"
          min={PRICE_FLOOR}
          max={PRICE_CEILING}
          step={PRICE_STEP}
          value={min}
          aria-label={`${label} minimum`}
          onChange={(event) => onChange(clampRange({ min: Number(event.target.value), max }))}
        />
        <input
          type="range"
          className="range-input"
          min={PRICE_FLOOR}
          max={PRICE_CEILING}
          step={PRICE_STEP}
          value={max}
          aria-label={`${label} maximum`}
          onChange={(event) => onChange(clampRange({ min, max: Number(event.target.value) }))}
        />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="flex items-center gap-2 text-xs text-muted">
          Min
          <input
            type="number"
            min={PRICE_FLOOR}
            max={max}
            step={PRICE_STEP}
            value={min}
            onChange={(event) => onChange(clampRange({ min: Number(event.target.value), max }))}
            className="field h-9 min-h-9 py-1 text-sm"
            aria-label={`${label} minimum value`}
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-muted">
          Max
          <input
            type="number"
            min={min}
            max={PRICE_CEILING}
            step={PRICE_STEP}
            value={max}
            onChange={(event) => onChange(clampRange({ min, max: Number(event.target.value) }))}
            className="field h-9 min-h-9 py-1 text-sm"
            aria-label={`${label} maximum value`}
          />
        </label>
      </div>
    </div>
  );
}