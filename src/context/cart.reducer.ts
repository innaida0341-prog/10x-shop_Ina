import type { CartItem, CartState } from "@/types/cart";
import type { Product } from "@/types/product";

export type CartAction =
  | { type: "ADD_ITEM"; product: Product; qty: number }
  | { type: "SET_QTY"; productId: number; qty: number }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "CLEAR" }
  | { type: "APPLY_PROMO"; code: string }
  | { type: "REMOVE_PROMO" };

/** Pure reducer: no storage, no toasts, no side effects. */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, qty } = action;
      if (qty <= 0 || product.stock <= 0) return state;

      const existing = state.items.find((item) => item.productId === product.id);
      const nextQuantity = (existing?.quantity ?? 0) + qty;
      if (nextQuantity > product.stock) return state;

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === product.id ? { ...item, quantity: nextQuantity } : item,
          ),
        };
      }

      const item: CartItem = {
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        quantity: qty,
      };
      return { ...state, items: [...state.items, item] };
    }

    case "SET_QTY": {
      const item = state.items.find((entry) => entry.productId === action.productId);
      if (!item) return state;
      const quantity = Math.min(Math.max(1, Math.trunc(action.qty)), item.stock);
      if (quantity === item.quantity) return state;
      return {
        ...state,
        items: state.items.map((entry) =>
          entry.productId === action.productId ? { ...entry, quantity } : entry,
        ),
      };
    }

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((item) => item.productId !== action.productId) };

    case "CLEAR":
      return { items: [], promoCode: null };

    case "APPLY_PROMO":
      return { ...state, promoCode: action.code.toUpperCase() };

    case "REMOVE_PROMO":
      return { ...state, promoCode: null };

    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}