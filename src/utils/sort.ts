import type { Product } from "@/types/product";
import type { SortOption } from "@/types/api";
import { discountedPrice } from "./format";

/**
 * Safety net: some DummyJSON endpoints ignore sortBy/order.
 * Sorting the current page client-side keeps the visible order honest.
 * It is a compromise, not a fix — it cannot reorder items outside this page.
 */
export function sortProductsPage(products: Product[], sort: SortOption): Product[] {
  if (sort === "") return products;
  const copy = [...products];

  if (sort === "price-asc") {
    return copy.sort(
      (a, b) => discountedPrice(a.price, a.discountPercentage) - discountedPrice(b.price, b.discountPercentage),
    );
  }
  if (sort === "price-desc") {
    return copy.sort(
      (a, b) => discountedPrice(b.price, b.discountPercentage) - discountedPrice(a.price, a.discountPercentage),
    );
  }
  if (sort === "rating-desc") return copy.sort((a, b) => b.rating - a.rating);
  return copy.sort((a, b) => a.title.localeCompare(b.title));
}