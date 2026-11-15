import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { useSearchParams } from "react-router-dom";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { Pagination } from "@/components/catalog/Pagination";
import { ViewToggle } from "@/components/catalog/ViewToggle";
import { SearchHistory } from "@/components/catalog/SearchHistory";
import { SavedViews } from "@/components/catalog/SavedViews";
import { ActiveFilters } from "@/components/catalog/ActiveFilters";
import { PriceRangeFilterPanel } from "@/components/catalog/PriceRangeFilterPanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { QuickViewDrawer } from "@/components/product/QuickViewDrawer";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { useFetch } from "@/hooks/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useIntersection } from "@/hooks/useIntersection";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { useCart } from "@/context/CartContext";
import { categoriesEndpoint } from "@/api/products.api";
import { buildProductsUrl, parsePage, parseSort } from "@/utils/url";
import { sortProductsPage } from "@/utils/sort";
import { FULL_RANGE, filterByPrice, isFullRange, parseRange, serializeRange } from "@/utils/price";
import { isCatalogPrefs, isStringList } from "@/utils/guards";
import { PAGE_SIZE, SEARCH_HISTORY_LIMIT } from "@/utils/constants";
import type { CatalogParams, SortOption } from "@/types/api";
import type { CatalogPrefs, CatalogView, PriceRange } from "@/types/bonus";
import type { Category, Product, ProductsResponse } from "@/types/product";

const NO_PRODUCTS: Product[] = [];
const DEFAULT_PREFS: CatalogPrefs = { view: "grid", infinite: false };

export default function CatalogPage(): ReactElement {
  useDocumentTitle("Catalog");

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = parseSort(searchParams.get("sort"));
  const page = parsePage(searchParams.get("page"));
  const price = parseRange(searchParams.get("price"));

  const [prefs, setPrefs] = useLocalStorage<CatalogPrefs>("shop_prefs", DEFAULT_PREFS, isCatalogPrefs);
  const [history, setHistory] = useLocalStorage<string[]>("shop_search_history", [], isStringList);
  const [term, setTerm] = useState(q);
  const debouncedTerm = useDebounce(term, 400);
  const committed = useRef(q);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const { addItem } = useCart();

  useEffect(() => {
    if (q !== committed.current) {
      committed.current = q;
      setTerm(q);
    }
  }, [q]);

  useEffect(() => {
    const value = debouncedTerm.trim();
    if (value === q) return;
    committed.current = value;
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value); else next.delete("q");
    next.delete("category");
    next.set("page", "1");
    setSearchParams(next, { replace: true });
    if (value.length >= 2) {
      setHistory([value, ...history.filter((entry) => entry !== value)].slice(0, SEARCH_HISTORY_LIMIT));
    }
  }, [debouncedTerm, q, searchParams, setSearchParams, history, setHistory]);

  const params: CatalogParams = useMemo(() => ({ q, category, sort, page }), [q, category, sort, page]);
  const apiParams: CatalogParams = useMemo(() => ({ q, category, sort, page: 1 }), [q, category, sort]);

  const pagedUrl = useMemo(
    () => (prefs.infinite ? null : buildProductsUrl(params)),
    [prefs.infinite, params],
  );
  const paged = useFetch<ProductsResponse>(pagedUrl);
  const infinite = useInfiniteProducts(apiParams, prefs.infinite);
  const categoriesQuery = useFetch<Category[]>(categoriesEndpoint());

  const rawProducts = prefs.infinite
    ? infinite.products
    : paged.state.status === "success" ? paged.state.data.products : NO_PRODUCTS;
  const total = prefs.infinite ? infinite.total : paged.state.status === "success" ? paged.state.data.total : 0;

  const visible = useMemo(
    () => filterByPrice(sortProductsPage(rawProducts, sort), price),
    [rawProducts, sort, price],
  );

  const status: "loading" | "error" | "ready" = prefs.infinite
    ? infinite.phase === "loading" || infinite.phase === "idle" ? "loading" : infinite.phase === "error" ? "error" : "ready"
    : paged.state.status === "success" ? "ready" : paged.state.status === "error" ? "error" : "loading";

  const errorMessage = prefs.infinite ? infinite.error ?? "Could not load products." : paged.state.status === "error" ? paged.state.message : "";
  const retry = prefs.infinite ? infinite.retry : paged.reload;

  const sentinel = useIntersection<HTMLDivElement>(
    infinite.loadMore,
    prefs.infinite && infinite.hasMore && infinite.phase === "ready",
    visible.length,
  );

  const update = useCallback(
    (patch: Record<string, string | null>, resetPage = true): void => {
      const next = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") next.delete(key); else next.set(key, value);
      }
      if (resetPage) next.set("page", "1");
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const handleAdd = useCallback((product: Product): void => addItem(product, 1), [addItem]);
  const handleQuickView = useCallback((product: Product): void => setQuickView(product), []);
  const closeQuickView = useCallback((): void => setQuickView(null), []);

  const handleCategory = useCallback((value: string): void => {
    committed.current = "";
    setTerm("");
    update({ category: value || null, q: null });
  }, [update]);

  const handleSort = useCallback((value: SortOption): void => update({ sort: value || null }), [update]);

  const handlePage = useCallback((value: number): void => {
    update({ page: String(value) }, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [update]);

  const handlePrice = useCallback((range: PriceRange): void => {
    update({ price: serializeRange(range) });
  }, [update]);

  const clearAll = useCallback((): void => {
    committed.current = "";
    setTerm("");
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const applyView = useCallback((query: string): void => {
    const next = new URLSearchParams(query);
    committed.current = next.get("q") ?? "";
    setTerm(next.get("q") ?? "");
    setSearchParams(next);
  }, [setSearchParams]);

  const categories = categoriesQuery.state.status === "success" ? categoriesQuery.state.data : [];
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const priceActive = !isFullRange(price);

  return (
    <div className="flex flex-col gap-5">
      <section className="card reveal-on-scroll relative overflow-hidden p-6 sm:p-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full opacity-45 blur-3xl"
          style={{ background: "linear-gradient(135deg, var(--color-brand), var(--color-wish))" }}
        />
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">Free shipping over $100 · code 10X10</p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Catalog</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          {total > 0 ? `${total} products ready to ship.` : "Curated gear, honest prices."} Every filter lives in the URL —
          share the link and it opens exactly like this.
        </p>
      </section>

      <CatalogToolbar
        term={term}
        onTermChange={setTerm}
        category={category}
        onCategoryChange={handleCategory}
        sort={sort}
        onSortChange={handleSort}
        categories={categories}
      />

      <SearchHistory
        history={history}
        active={q}
        onPick={(value) => { committed.current = value; setTerm(value); }}
        onClear={() => setHistory([])}
      />

      <div className="grid gap-4 min-[901px]:grid-cols-[1fr_20rem]">
        <SavedViews currentQuery={searchParams.toString()} onApply={applyView} />
        <PriceRangeFilterPanel value={price} onChange={handlePrice} onReset={() => handlePrice(FULL_RANGE)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ViewToggle
          view={prefs.view}
          infinite={prefs.infinite}
          onViewChange={(view: CatalogView) => setPrefs({ ...prefs, view })}
          onInfiniteChange={(value) => setPrefs({ ...prefs, infinite: value })}
        />
        {!prefs.infinite && status === "ready" && total > 0 && (
          <p className="text-sm text-muted">Showing {from}–{to} of {total}</p>
        )}
        {prefs.infinite && status === "ready" && (
          <p className="text-sm text-muted">Loaded {rawProducts.length} of {total}</p>
        )}
      </div>

      <ActiveFilters
        q={q}
        category={category}
        sort={sort}
        price={price}
        matched={visible.length}
        loaded={rawProducts.length}
        onClearQuery={() => { committed.current = ""; setTerm(""); update({ q: null }); }}
        onClearCategory={() => update({ category: null })}
        onClearSort={() => update({ sort: null })}
        onClearPrice={() => handlePrice(FULL_RANGE)}
        onClearAll={clearAll}
      />

      {status === "loading" && <SkeletonGrid />}
      {status === "error" && <ErrorState message={errorMessage} onRetry={retry} />}

      {status === "ready" && visible.length === 0 && (
        <EmptyState
          title="No products found."
          description={priceActive ? "No loaded product falls inside this price range. Widen it or load more." : "Try a different search term or clear the filters."}
        >
          <button type="button" onClick={clearAll} className="tap mt-6 rounded-xl bg-brand px-6 font-semibold text-white transition hocus:bg-brand-deep">
            Clear filters
          </button>
        </EmptyState>
      )}

      {status === "ready" && visible.length > 0 && (
        <>
          <ProductGrid products={visible} onAdd={handleAdd} onQuickView={handleQuickView} view={prefs.view} />

          {prefs.infinite ? (
            <div ref={sentinel} className="flex flex-col items-center gap-3 py-6">
              {infinite.phase === "more" && <Spinner label="Loading more" />}
              {infinite.hasMore && infinite.phase === "ready" && (
                <button
                  type="button"
                  onClick={infinite.loadMore}
                  className="tap rounded-xl border border-brand px-7 font-semibold text-brand transition hocus:bg-brand hocus:text-white"
                >
                  Load more
                </button>
              )}
              {!infinite.hasMore && <p className="text-sm text-muted">You have reached the end of the catalog.</p>}
            </div>
          ) : (
            <Pagination page={page} totalPages={totalPages} onChange={handlePage} />
          )}
        </>
      )}

      <QuickViewDrawer product={quickView} onClose={closeQuickView} />
    </div>
  );
}