import type { CartItem, CartState } from "@/types/cart";
import type { Order, ShippingInfo } from "@/types/order";
import type { Product, Review } from "@/types/product";
import type { Theme } from "@/types/theme";
import type { Address, CatalogPrefs, SavedView, WishlistItem } from "@/types/bonus";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isCartItem(value: unknown): value is CartItem {
  return (
    isRecord(value) &&
    typeof value.productId === "number" &&
    typeof value.title === "string" &&
    typeof value.thumbnail === "string" &&
    typeof value.price === "number" &&
    typeof value.discountPercentage === "number" &&
    typeof value.stock === "number" &&
    typeof value.quantity === "number" &&
    value.quantity > 0
  );
}

export function isCartState(value: unknown): value is CartState {
  return (
    isRecord(value) &&
    Array.isArray(value.items) &&
    value.items.every(isCartItem) &&
    (value.promoCode === null || typeof value.promoCode === "string")
  );
}

function isShippingInfo(value: unknown): value is ShippingInfo {
  return (
    isRecord(value) &&
    typeof value.fullName === "string" &&
    typeof value.email === "string" &&
    typeof value.phone === "string" &&
    typeof value.address === "string" &&
    typeof value.city === "string" &&
    typeof value.postalCode === "string" &&
    typeof value.country === "string"
  );
}

export function isOrder(value: unknown): value is Order {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.number === "string" &&
    Array.isArray(value.items) &&
    value.items.every(isCartItem) &&
    isShippingInfo(value.shipping) &&
    typeof value.subtotal === "number" &&
    typeof value.discount === "number" &&
    typeof value.shippingCost === "number" &&
    typeof value.total === "number" &&
    typeof value.placedAt === "string" &&
    (value.source === undefined || value.source === "local" || value.source === "imported")
  );
}

export function isOrderList(value: unknown): value is Order[] {
  return Array.isArray(value) && value.every(isOrder);
}

export function isReview(value: unknown): value is Review {
  return (
    isRecord(value) &&
    typeof value.rating === "number" &&
    typeof value.comment === "string" &&
    typeof value.date === "string" &&
    typeof value.reviewerName === "string"
  );
}

export function isReviewMap(value: unknown): value is Record<string, Review[]> {
  return isRecord(value) && Object.values(value).every((e) => Array.isArray(e) && e.every(isReview));
}

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    typeof value.price === "number" &&
    typeof value.discountPercentage === "number" &&
    typeof value.rating === "number" &&
    typeof value.stock === "number" &&
    typeof value.thumbnail === "string" &&
    Array.isArray(value.images) &&
    Array.isArray(value.reviews)
  );
}

export function isWishlistItem(value: unknown): value is WishlistItem {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.thumbnail === "string" &&
    typeof value.price === "number" &&
    typeof value.discountPercentage === "number" &&
    typeof value.stock === "number" &&
    typeof value.category === "string" &&
    typeof value.rating === "number"
  );
}

export function isWishlist(value: unknown): value is WishlistItem[] {
  return Array.isArray(value) && value.every(isWishlistItem);
}

export function isAddress(value: unknown): value is Address {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    typeof value.fullName === "string" &&
    typeof value.phone === "string" &&
    typeof value.address === "string" &&
    typeof value.city === "string" &&
    typeof value.postalCode === "string" &&
    typeof value.country === "string" &&
    typeof value.isDefault === "boolean"
  );
}

export function isAddressList(value: unknown): value is Address[] {
  return Array.isArray(value) && value.every(isAddress);
}

export function isSavedView(value: unknown): value is SavedView {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.query === "string" &&
    typeof value.createdAt === "string"
  );
}

export function isSavedViewList(value: unknown): value is SavedView[] {
  return Array.isArray(value) && value.every(isSavedView);
}

export function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

export function isCatalogPrefs(value: unknown): value is CatalogPrefs {
  return (
    isRecord(value) &&
    (value.view === "grid" || value.view === "list") &&
    typeof value.infinite === "boolean"
  );
}

export function isFromState(value: unknown): value is { from: string } {
  return isRecord(value) && typeof value.from === "string";
}

export function isNoticeState(value: unknown): value is { reason: string } {
  return isRecord(value) && typeof value.reason === "string";
}

export function isJustPlacedState(value: unknown): value is { justPlaced: boolean } {
  return isRecord(value) && typeof value.justPlaced === "boolean";
}