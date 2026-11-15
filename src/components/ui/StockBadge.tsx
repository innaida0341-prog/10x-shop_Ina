import type { ReactElement } from "react";

export function StockBadge({ stock }: { stock: number }): ReactElement {
  if (stock === 0) {
    return <span className="rounded-full bg-danger/12 px-2.5 py-1 text-xs font-semibold text-danger">Out of stock</span>;
  }
  if (stock <= 5) {
    return <span className="rounded-full bg-warning/15 px-2.5 py-1 text-xs font-semibold text-warning">Only {stock} left!</span>;
  }
  return <span className="rounded-full bg-success/12 px-2.5 py-1 text-xs font-semibold text-success">In stock</span>;
}