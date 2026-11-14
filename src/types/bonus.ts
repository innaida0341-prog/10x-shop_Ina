import type { Product } from "./product";

export type WishlistItem = Pick<
  Product,
  "id" | "title" | "thumbnail" | "price" | "discountPercentage" | "stock" | "category" | "rating"
>;

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type AddressDraft = Omit<Address, "id" | "isDefault">;

export interface SavedView {
  id: string;
  name: string;
  query: string;
  createdAt: string;
}

export type CatalogView = "grid" | "list";

export interface CatalogPrefs {
  view: CatalogView;
  infinite: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  action?: ToastAction;
  duration?: number;
}