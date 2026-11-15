import { useMemo } from "react";
import type { ReactElement } from "react";
import { ProductGrid } from "./ProductGrid";
import { useFetch } from "@/hooks/useFetch";
import { relatedEndpoint } from "@/api/products.api";
import type { Product, ProductsResponse } from "@/types/product";

interface RelatedProductsProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function RelatedProducts({ product, onAdd }: RelatedProductsProps): ReactElement | null {
  const { state } = useFetch<ProductsResponse>(relatedEndpoint(product.category));

  const related = useMemo(() => {
    if (state.status !== "success") return [];
    return state.data.products.filter((entry) => entry.id !== product.id).slice(0, 4);
  }, [state, product.id]);

  if (state.status === "loading") {
    return <p className="py-6 text-sm text-muted">Loading related products…</p>;
  }
  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 font-display text-xl font-bold">You may also like</h2>
      <ProductGrid products={related} onAdd={onAdd} />
    </section>
  );
}