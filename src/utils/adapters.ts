import type { Product } from "@/types/product";
import type { WishlistItem } from "@/types/bonus";

export function toWishlistItem(product: Product): WishlistItem {
  return {
    id: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    stock: product.stock,
    category: product.category,
    rating: product.rating,
  };
}

export function wishlistItemToProduct(item: WishlistItem): Product {
  return {
    id: item.id,
    title: item.title,
    description: "",
    category: item.category,
    price: item.price,
    discountPercentage: item.discountPercentage,
    rating: item.rating,
    stock: item.stock,
    thumbnail: item.thumbnail,
    images: [item.thumbnail],
    reviews: [],
  };
}