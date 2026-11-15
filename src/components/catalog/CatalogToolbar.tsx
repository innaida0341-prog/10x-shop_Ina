import type { ReactElement } from "react";
import { titleCase } from "@/utils/format";
import type { Category } from "@/types/product";
import type { SortOption } from "@/types/api";

interface CatalogToolbarProps {
  term: string;
  onTermChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  categories: Category[];
}

export function CatalogToolbar({
  term, onTermChange, category, onCategoryChange, sort, onSortChange, categories,
}: CatalogToolbarProps): ReactElement {
  return (
    <div className="card grid gap-3 p-4 md:grid-cols-[1.6fr_1fr_1fr]">
      <div className="relative">
        <label htmlFor="catalog-search" className="sr-only">Search products</label>
        <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">⌕</span>
        <input
          id="catalog-search"
          type="search"
          value={term}
          onChange={(event) => onTermChange(event.target.value)}
          placeholder="Search phones, laptops, fragrances…"
          className="field pl-9"
        />
      </div>

      <div>
        <label htmlFor="catalog-category" className="sr-only">Category</label>
        <select
          id="catalog-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="field cursor-pointer"
        >
          <option value="">All categories</option>
          {categories.map((entry) => (
            <option key={entry.slug} value={entry.slug}>{titleCase(entry.name)}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="catalog-sort" className="sr-only">Sort by</label>
        <select
          id="catalog-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          className="field cursor-pointer"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating-desc">Rating: high to low</option>
          <option value="title-asc">Name A → Z</option>
        </select>
      </div>
    </div>
  );
}