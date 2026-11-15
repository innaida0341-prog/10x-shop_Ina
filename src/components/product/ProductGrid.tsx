import type { ReactElement } from "react";
import { ProductCard } from "./ProductCard";
import { ProductRow } from "./ProductRow";
import type { CatalogView } from "@/types/bonus";
import type { Product } from "@/types/product";

export interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  view?: CatalogView;
}

export function ProductGrid({
  products,
  onAdd,
  onQuickView,
  view = "grid",
}: ProductGridProps): ReactElement {
  if (view === "list") {
    return (
      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onAdd={onAdd}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 min-[481px]:grid-cols-2 md:grid-cols-3 min-[1025px]:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAdd}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}