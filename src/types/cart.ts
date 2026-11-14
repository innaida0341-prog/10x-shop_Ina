import type { Product } from "./product";

export type CartItem = Pick<
  Product,
  "title" | "thumbnail" | "price" | "discountPercentage" | "stock"
> & { productId: number; quantity: number };

export interface CartState {
  items: CartItem[];
  promoCode: string | null;
}

export const EMPTY_CART: CartState = { items: [], promoCode: null };