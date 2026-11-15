import type { ReactElement } from "react";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { isFullRange } from "@/utils/price";
import type { PriceRange } from "@/types/bonus";

interface PriceRangeFilterPanelProps {
  value: PriceRange;
  onChange: (value: PriceRange) => void;
  onReset: () => void;
}

export function PriceRangeFilterPanel({ value, onChange, onReset }: PriceRangeFilterPanelProps): ReactElement {
  return (
    <div className="card p-4">
      <RangeSlider value={value} onChange={onChange} label="Price range" />
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-[11px] leading-snug text-muted">Applied to the products already loaded on this page.</p>
        {!isFullRange(value) && (
          <button
            type="button"
            onClick={onReset}
            className="min-h-9 shrink-0 rounded-lg border border-border px-3 text-xs font-semibold transition hocus:border-danger hocus:text-danger"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}