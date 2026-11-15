import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import type { ReactElement, ReactNode } from "react";
import { cartReducer } from "./cart.reducer";
import { Cart } from "@/models/Cart";
import { cartStorage } from "@/models/storage";
import { useToast } from "./ToastContext";
import { EMPTY_CART } from "@/types/cart";
import type { CartItem, CartState } from "@/types/cart";
import type { Product } from "@/types/product";
import { TOAST } from "@/utils/constants";
import { cartItemToProduct } from "@/utils/cart";

interface CartContextValue {
  state: CartState;
  cart: Cart;
  itemCount: number;
  addItem: (product: Product, qty: number) => void;
  addItems: (items: CartItem[]) => void;
  setQuantity: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }): ReactElement {
  const toast = useToast();
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART, (initial) => cartStorage.get() ?? initial);

  useEffect(() => {
    cartStorage.set(state);
  }, [state]);

  const addItem = useCallback(
    (product: Product, qty: number): void => {
      if (product.stock <= 0) {
        toast.error(TOAST.outOfStock);
        return;
      }
      const current = state.items.find((item) => item.productId === product.id)?.quantity ?? 0;
      if (current + qty > product.stock) {
        toast.error(TOAST.stockLimit(product.stock));
        return;
      }
      dispatch({ type: "ADD_ITEM", product, qty });
      toast.success(TOAST.added);
    },
    [state.items, toast],
  );

  const addItems = useCallback(
    (items: CartItem[]): void => {
      const accepted = items.filter((item) => item.stock > 0 && item.quantity > 0);
      if (accepted.length === 0) {
        toast.error(TOAST.outOfStock);
        return;
      }
      accepted.forEach((item) =>
        dispatch({ type: "ADD_ITEM", product: cartItemToProduct(item), qty: item.quantity }),
      );
      toast.success(TOAST.reordered);
    },
    [toast],
  );

  const setQuantity = useCallback((productId: number, qty: number): void => {
    dispatch({ type: "SET_QTY", productId, qty });
  }, []);

  const removeItem = useCallback(
    (productId: number): void => {
      const target = state.items.find((item) => item.productId === productId);
      if (!target) return;
      dispatch({ type: "REMOVE_ITEM", productId });
      toast.info(TOAST.removed, {
        action: {
          label: "Undo",
          onClick: () => dispatch({ type: "ADD_ITEM", product: cartItemToProduct(target), qty: target.quantity }),
        },
      });
    },
    [state.items, toast],
  );

  const clearCart = useCallback((): void => {
    if (state.items.length === 0) return;
    const snapshot = state.items;
    const promo = state.promoCode;
    dispatch({ type: "CLEAR" });
    toast.info("Cart cleared", {
      action: {
        label: "Undo",
        onClick: () => {
          snapshot.forEach((item) =>
            dispatch({ type: "ADD_ITEM", product: cartItemToProduct(item), qty: item.quantity }),
          );
          if (promo !== null) dispatch({ type: "APPLY_PROMO", code: promo });
        },
      },
    });
  }, [state.items, state.promoCode, toast]);

  const applyPromo = useCallback(
    (code: string): boolean => {
      const normalized = Cart.normalizePromo(code);
      if (normalized === null) return false;
      dispatch({ type: "APPLY_PROMO", code: normalized });
      toast.success(TOAST.promoApplied);
      return true;
    },
    [toast],
  );

  const removePromo = useCallback((): void => dispatch({ type: "REMOVE_PROMO" }), []);

  const cart = useMemo(() => new Cart(state.items, state.promoCode), [state.items, state.promoCode]);

  const value = useMemo<CartContextValue>(
    () => ({
      state, cart, itemCount: cart.itemCount,
      addItem, addItems, setQuantity, removeItem, clearCart, applyPromo, removePromo,
    }),
    [state, cart, addItem, addItems, setQuantity, removeItem, clearCart, applyPromo, removePromo],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider.");
  return context;
}