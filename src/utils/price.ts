import type { PriceRange } from "@/types/bonus";
import type { Product } from "@/types/product";
import { PRICE_CEILING, PRICE_FLOOR, PRICE_STEP } from "./constants";
import { discountedPrice } from "./format";

export const FULL_RANGE: PriceRange = { min: PRICE_FLOOR, max: PRICE_CEILING };

export function clampRange(range: PriceRange): PriceRange {
  const min = Math.min(Math.max(PRICE_FLOOR, Math.round(range.min)), PRICE_CEILING);
  const max = Math.min(Math.max(PRICE_FLOOR, Math.round(range.max)), PRICE_CEILING);
  return min <= max ? { min, max } : { min: max, max: min };
}

export function isFullRange(range: PriceRange): boolean {
  return range.min === PRICE_FLOOR && range.max === PRICE_CEILING;
}

export function parseRange(value: string | null): PriceRange {
  if (value === null) return FULL_RANGE;
  const match = /^(\d+)-(\d+)$/.exec(value.trim());
  if (match === null) return FULL_RANGE;
  return clampRange({ min: Number(match[1]), max: Number(match[2]) });
}

export function serializeRange(range: PriceRange): string | null {
  const clamped = clampRange(range);
  return isFullRange(clamped) ? null : `${clamped.min}-${clamped.max}`;
}

export function filterByPrice(products: Product[], range: PriceRange): Product[] {
  if (isFullRange(range)) return products;
  const { min, max } = clampRange(range);
  return products.filter((product) => {
    const value = discountedPrice(product.price, product.discountPercentage);
    return value >= min && value <= max;
  });
}

export function rangePercent(range: PriceRange): { left: number; right: number } {
  const span = PRICE_CEILING - PRICE_FLOOR;
  const { min, max } = clampRange(range);
  return {
    left: ((min - PRICE_FLOOR) / span) * 100,
    right: 100 - ((max - PRICE_FLOOR) / span) * 100,
  };
}

export { PRICE_STEP };