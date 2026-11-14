export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

export const SORT_OPTIONS = ["", "price-asc", "price-desc", "rating-desc", "title-asc"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export interface CatalogParams {
  q: string;
  category: string;
  sort: SortOption;
  page: number;
}