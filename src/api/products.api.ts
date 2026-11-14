import { ApiClient } from "./ApiClient";
import { API_BASE_URL } from "@/utils/constants";

export const api = new ApiClient(API_BASE_URL);

export function productEndpoint(id: number): string {
  return `/products/${id}`;
}

export function categoriesEndpoint(): string {
  return "/products/categories";
}

export function relatedEndpoint(category: string): string {
  return `/products/category/${encodeURIComponent(category)}?limit=5`;
}