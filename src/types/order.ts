import type { CartItem } from "./cart";

export type OrderStatus = "Processing" | "Shipped" | "Delivered";
export type OrderSource = "local" | "imported";

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: number;
  number: string;
  items: CartItem[];
  shipping: ShippingInfo;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  placedAt: string;
  source?: OrderSource;
}

export type CheckoutFormValues = ShippingInfo;