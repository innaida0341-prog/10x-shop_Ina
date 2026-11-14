import type { OrderStatus } from "@/types/order";

export const SHIPPED_AFTER_MS = 60_000;
export const DELIVERED_AFTER_MS = 180_000;
export const STATUS_SEQUENCE: readonly OrderStatus[] = ["Processing", "Shipped", "Delivered"];

export function getOrderStatus(placedAt: string, now: Date = new Date()): OrderStatus {
  const elapsed = now.getTime() - new Date(placedAt).getTime();
  if (elapsed < SHIPPED_AFTER_MS) return "Processing";
  if (elapsed < DELIVERED_AFTER_MS) return "Shipped";
  return "Delivered";
}