import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { wishlistStorage } from "@/models/storage";
import { useToast } from "./ToastContext";
import { toWishlistItem } from "@/utils/adapters";
import { TOAST } from "@/utils/constants";
import type { WishlistItem } from "@/types/bonus";
import type { Product } from "@/types/product";

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  has: (productId: number) => boolean;
  toggle: (product: Product) => void;
  remove: (productId: number) => void;
  removeMany: (ids: number[]) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }): ReactElement {
  const toast = useToast();
  const [items, setItems] = useState<WishlistItem[]>(() => wishlistStorage.get() ?? []);

  useEffect(() => {
    wishlistStorage.set(items);
  }, [items]);

  const restore = useCallback((restored: WishlistItem[]): void => {
    setItems((current) => {
      const seen = new Set(current.map((item) => item.id));
      const fresh = restored.filter((item) => !seen.has(item.id));
      return fresh.length === 0 ? current : [...fresh, ...current];
    });
  }, []);

  const has = useCallback((productId: number): boolean => items.some((item) => item.id === productId), [items]);

  const remove = useCallback(
    (productId: number): void => {
      const target = items.find((item) => item.id === productId);
      if (!target) return;
      setItems((current) => current.filter((item) => item.id !== productId));
      toast.info(TOAST.wishRemoved, { action: { label: "Undo", onClick: () => restore([target]) } });
    },
    [items, toast, restore],
  );

  const toggle = useCallback(
    (product: Product): void => {
      if (items.some((item) => item.id === product.id)) {
        remove(product.id);
        return;
      }
      setItems((current) => [toWishlistItem(product), ...current]);
      toast.success(TOAST.wishAdded);
    },
    [items, remove, toast],
  );

  const removeMany = useCallback(
    (ids: number[]): void => {
      if (ids.length === 0) return;
      const set = new Set(ids);
      const removed = items.filter((item) => set.has(item.id));
      if (removed.length === 0) return;
      setItems((current) => current.filter((item) => !set.has(item.id)));
      toast.info(`${removed.length} item${removed.length === 1 ? "" : "s"} removed`, {
        action: { label: "Undo", onClick: () => restore(removed) },
      });
    },
    [items, toast, restore],
  );

  const clear = useCallback((): void => {
    if (items.length === 0) return;
    const snapshot = items;
    setItems([]);
    toast.info("Wishlist cleared", { action: { label: "Undo", onClick: () => restore(snapshot) } });
  }, [items, toast, restore]);

  const value = useMemo<WishlistContextValue>(
    () => ({ items, count: items.length, has, toggle, remove, removeMany, clear }),
    [items, has, toggle, remove, removeMany, clear],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider.");
  return context;
}