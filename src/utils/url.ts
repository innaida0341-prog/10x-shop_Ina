import { PAGE_SIZE } from "./constants";
import { SORT_OPTIONS } from "@/types/api";
import type { CatalogParams, SortOption } from "@/types/api";

const SORT_MAP: Record<Exclude<SortOption, "">, { sortBy: string; order: "asc" | "desc" }> = {
  "price-asc": { sortBy: "price", order: "asc" },
  "price-desc": { sortBy: "price", order: "desc" },
  "rating-desc": { sortBy: "rating", order: "desc" },
  "title-asc": { sortBy: "title", order: "asc" },
};

export function buildProductsUrl({ q, category, sort, page }: CatalogParams): string {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    skip: String((page - 1) * PAGE_SIZE),
  });

  const query = q.trim();
  let path = "/products";

  if (query) {
    path = "/products/search";
    params.set("q", query);
  } else if (category) {
    path = `/products/category/${encodeURIComponent(category)}`;
  }

  if (sort) {
    const config = SORT_MAP[sort];
    params.set("sortBy", config.sortBy);
    params.set("order", config.order);
  }

  return `${path}?${params.toString()}`;
}

export function parseSort(value: string | null): SortOption {
  return SORT_OPTIONS.find((option) => option === value) ?? "";
}

export function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}