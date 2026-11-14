import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { discountedPrice, round2 } from "./format";

export function lineTotal(item: CartItem): number {
  return round2(discountedPrice(item.price, item.discountPercentage) * item.quantity);
}

/** Adapter used by Reorder: a persisted line becomes a Product-shaped ADD_ITEM payload. */
export function cartItemToProduct(item: CartItem): Product {
  return {
    id: item.productId,
    title: item.title,
    description: "",
    category: "",
    price: item.price,
    discountPercentage: item.discountPercentage,
    rating: 0,
    stock: item.stock,
    thumbnail: item.thumbnail,
    images: [item.thumbnail],
    reviews: [],
  };
}