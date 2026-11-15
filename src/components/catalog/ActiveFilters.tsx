import type { ReactElement } from "react";
import { formatPrice, titleCase } from "@/utils/format";
import { isFullRange } from "@/utils/price";
import type { PriceRange } from "@/types/bonus";
import type { SortOption } from "@/types/api";

interface ActiveFiltersProps {
  q: string;
  category: string;
  sort: SortOption;
  price: PriceRange;
  matched: number;
  loaded: number;
  onClearQuery: () => void;
  onClearCategory: () => void;
  onClearSort: () => void;
  onClearPrice: () => void;
  onClearAll: () => void;
}

const SORT_LABEL: Record<Exclude<SortOption, "">, string> = {
  "price-asc": "Price ↑",
  "price-desc": "Price ↓",
  "rating-desc": "Rating ↓",
  "title-asc": "Name A→Z",
};

export function ActiveFilters({
  q, category, sort, price, matched, loaded,
  onClearQuery, onClearCategory, onClearSort, onClearPrice, onClearAll,
}: ActiveFiltersProps): ReactElement | null {
  const priceActive = !isFullRange(price);
  const any = Boolean(q) || Boolean(category) || Boolean(sort) || priceActive;
  if (!any) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {q && (
        <button type="button" onClick={onClearQuery} className="chip border-brand/45 bg-brand-soft text-brand hocus:border-danger hocus:text-danger">
          “{q}” ✕
        </button>
      )}
      {category && (
        <button type="button" onClick={onClearCategory} className="chip border-brand/45 bg-brand-soft text-brand hocus:border-danger hocus:text-danger">
          {titleCase(category)} ✕
        </button>
      )}
      {sort && (
        <button type="button" onClick={onClearSort} className="chip border-cyan/45 bg-cyan/10 text-cyan hocus:border-danger hocus:text-danger">
          {SORT_LABEL[sort]} ✕
        </button>
      )}
      {priceActive && (
        <button type="button" onClick={onClearPrice} className="chip border-range/45 bg-range/10 text-range hocus:border-danger hocus:text-danger">
          {formatPrice(price.min)}–{formatPrice(price.max)} ✕
        </button>
      )}
      <span className="text-xs text-muted">
        {priceActive ? `${matched} of ${loaded} loaded match` : `${matched} shown`}
      </span>
      <button type="button" onClick={onClearAll} className="chip ml-auto text-muted hocus:border-danger hocus:text-danger">
        Clear filters
      </button>
    </div>
  );
}