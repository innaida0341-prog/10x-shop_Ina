import { StorageService } from "./StorageService";
import { STORAGE_KEYS } from "@/utils/constants";
import {
  isAddressList,
  isCartState,
  isCatalogPrefs,
  isOrderList,
  isReviewMap,
  isSavedViewList,
  isStringList,
  isWishlist,
} from "@/utils/guards";
import type { CartState } from "@/types/cart";
import type { Order } from "@/types/order";
import type { Review } from "@/types/product";
import type { Address, CatalogPrefs, SavedView, WishlistItem } from "@/types/bonus";

export const cartStorage = new StorageService<CartState>(STORAGE_KEYS.cart, isCartState);
export const ordersStorage = new StorageService<Order[]>(STORAGE_KEYS.orders, isOrderList);
export const reviewsStorage = new StorageService<Record<string, Review[]>>(STORAGE_KEYS.reviews, isReviewMap);
export const wishlistStorage = new StorageService<WishlistItem[]>(STORAGE_KEYS.wishlist, isWishlist);
export const addressesStorage = new StorageService<Address[]>(STORAGE_KEYS.addresses, isAddressList);
export const viewsStorage = new StorageService<SavedView[]>(STORAGE_KEYS.views, isSavedViewList);
export const searchHistoryStorage = new StorageService<string[]>(STORAGE_KEYS.searchHistory, isStringList);
export const prefsStorage = new StorageService<CatalogPrefs>(STORAGE_KEYS.prefs, isCatalogPrefs);