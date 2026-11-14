export const STORAGE_KEYS = {
  cart: "shop_cart",
  orders: "shop_orders",
  reviews: "shop_reviews",
  theme: "shop_theme",
  wishlist: "shop_wishlist",
  addresses: "shop_addresses",
  views: "shop_views",
  searchHistory: "shop_search_history",
  prefs: "shop_prefs",
} as const;

export const API_BASE_URL = "https://dummyjson.com";
export const PAGE_SIZE = 12;
export const PROMO_CODE = "10X10";
export const PROMO_RATE = 0.1;

export const PRICE_FLOOR = 0;
export const PRICE_CEILING = 2000;
export const PRICE_STEP = 10;
export const SEARCH_HISTORY_LIMIT = 8;
export const SAVED_VIEWS_LIMIT = 8;
export const IMPORT_USER_ID = 1;

export const COUNTRIES = [
  "Georgia",
  "United States",
  "Germany",
  "France",
  "Spain",
  "United Kingdom",
  "Japan",
] as const;

export const TOAST = {
  added: "Added to cart ✓",
  removed: "Removed from cart",
  reviewAdded: "Review added ✓",
  reordered: "Items added to cart ✓",
  promoApplied: "Promo code applied ✓",
  profileSaved: "Profile updated ✓",
  dataCleared: "Local data cleared",
  wishAdded: "Saved to wishlist ♥",
  wishRemoved: "Removed from wishlist",
  viewSaved: "View saved ✓",
  addressSaved: "Address saved ✓",
  addressRemoved: "Address removed",
  stockLimit: (stock: number): string => `Stock limit reached — only ${stock} available.`,
  outOfStock: "This product is out of stock.",
} as const;