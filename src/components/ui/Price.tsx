import type { ReactElement } from "react";
import { discountedPrice, discountLabel, formatPrice } from "@/utils/format";

interface PriceProps {
  price: number;
  discountPercentage: number;
  size?: "sm" | "lg";
}

export function Price({ price, discountPercentage, size = "sm" }: PriceProps): ReactElement {
  const final = discountedPrice(price, discountPercentage);
  const hasDiscount = discountPercentage >= 1;

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={size === "lg" ? "font-display text-3xl font-bold" : "font-display text-lg font-bold"}>
        {formatPrice(final)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-muted line-through">{formatPrice(price)}</span>
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-bold text-success">
            {discountLabel(discountPercentage)}
          </span>
        </>
      )}
    </div>
  );
}