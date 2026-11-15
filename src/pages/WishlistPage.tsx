import { useCallback, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/Checkbox";
import { EmptyState } from "@/components/ui/EmptyState";
import { Price } from "@/components/ui/Price";
import { StockBadge } from "@/components/ui/StockBadge";
import { QuickViewDrawer } from "@/components/product/QuickViewDrawer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { wishlistItemToProduct } from "@/utils/adapters";
import { titleCase } from "@/utils/format";
import type { Product } from "@/types/product";

type SortKey = "recent" | "price-asc" | "price-desc" | "rating";

export default function WishlistPage(): ReactElement {
  useDocumentTitle("Wishlist");
  const { items, remove, removeMany, clear } = useWishlist();
  const { addItem } = useCart();
  const [selected, setSelected] = useState<number[]>([]);
  const [sort, setSort] = useState<SortKey>("recent");
  const [quickView, setQuickView] = useState<Product | null>(null);

  const sorted = useMemo(() => {
    const copy = [...items];
    if (sort === "price-asc") return copy.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return copy.sort((a, b) => b.price - a.price);
    if (sort === "rating") return copy.sort((a, b) => b.rating - a.rating);
    return copy;
  }, [items, sort]);

  const allSelected = items.length > 0 && selected.length === items.length;
  const someSelected = selected.length > 0 && !allSelected;

  const toggleOne = useCallback((id: number, checked: boolean): void => {
    setSelected((current) => (checked ? [...new Set([...current, id])] : current.filter((entry) => entry !== id)));
  }, []);

  const addSelected = (): void => {
    const chosen = items.filter((item) => selected.includes(item.id) && item.stock > 0);
    chosen.forEach((item) => addItem(wishlistItemToProduct(item), 1));
    if (chosen.length > 0) setSelected([]);
  };

  const closeQuickView = useCallback((): void => setQuickView(null), []);

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="font-display text-3xl font-bold">Wishlist</h1>
        <EmptyState
          title="Your wishlist is empty."
          description="Tap the heart on any product to keep it here for later."
          actionLabel="Browse products"
          actionTo="/"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Wishlist <span className="text-wish">♥</span>
          </h1>
          <p className="mt-1 text-sm text-muted">{items.length} saved item{items.length === 1 ? "" : "s"}</p>
        </div>
        <Link to="/" className="tap inline-flex items-center rounded-xl px-3 text-sm font-semibold text-brand transition hocus:bg-brand-soft">
          ← Continue shopping
        </Link>
      </header>

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onChange={(checked) => setSelected(checked ? items.map((item) => item.id) : [])}
          label="Select all"
        />
        <label htmlFor="wish-sort" className="sr-only">Sort wishlist</label>
        <select
          id="wish-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          className="field h-9 min-h-9 w-auto py-1 text-sm"
        >
          <option value="recent">Recently saved</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Rating</option>
        </select>

        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addSelected}
            disabled={selected.length === 0}
            className="tap rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hocus:bg-brand-deep disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
          >
            Add selected ({selected.length})
          </button>
          <button
            type="button"
            onClick={() => { removeMany(selected); setSelected([]); }}
            disabled={selected.length === 0}
            className="tap rounded-xl border border-border px-4 text-sm font-semibold transition hocus:border-danger hocus:text-danger disabled:cursor-not-allowed disabled:opacity-45"
          >
            Remove selected
          </button>
          <button
            type="button"
            onClick={() => { clear(); setSelected([]); }}
            className="tap rounded-xl border border-border px-4 text-sm font-semibold transition hocus:border-danger hocus:text-danger"
          >
            Clear all
          </button>
        </div>
      </div>

      <ul className="grid gap-3">
        {sorted.map((item) => (
          <li
            key={item.id}
            data-picked={selected.includes(item.id)}
            className="card @container flex animate-fade-up gap-4 p-3 transition picked:border-wish/60 picked:bg-wish-soft/40"
          >
            <div className="flex shrink-0 items-start pt-1">
              <Checkbox
                checked={selected.includes(item.id)}
                onChange={(checked) => toggleOne(item.id, checked)}
                label={`Select ${item.title}`}
              />
            </div>
            <img
              src={item.thumbnail}
              alt={item.title}
              loading="lazy"
              width={96}
              height={96}
              className="size-20 shrink-0 rounded-xl bg-surface-2 object-contain p-1 @md:size-24"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2 @lg:flex-row @lg:items-center @lg:gap-4">
              <div className="min-w-0 flex-1">
                <Link to={`/products/${item.id}`} className="line-clamp-1 font-display text-sm font-bold transition hocus:text-brand">
                  {item.title}
                </Link>
                <p className="mt-0.5 text-xs text-muted">{titleCase(item.category)} · ★ {item.rating.toFixed(1)}</p>
                <div className="mt-1.5"><StockBadge stock={item.stock} /></div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Price price={item.price} discountPercentage={item.discountPercentage} />
                <button
                  type="button"
                  onClick={() => setQuickView(wishlistItemToProduct(item))}
                  className="tap rounded-xl border border-brand px-3 text-xs font-bold text-brand transition hocus:bg-brand hocus:text-white"
                >
                  Quick view
                </button>
                <button
                  type="button"
                  disabled={item.stock === 0}
                  onClick={() => addItem(wishlistItemToProduct(item), 1)}
                  className="tap rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hocus:bg-brand-deep disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
                >
                  {item.stock === 0 ? "Sold out" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => { remove(item.id); setSelected((current) => current.filter((id) => id !== item.id)); }}
                  aria-label={`Remove ${item.title} from wishlist`}
                  className="tap grid place-items-center rounded-xl border border-border px-3 transition hocus:border-danger hocus:text-danger"
                >
                  ✕
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <QuickViewDrawer product={quickView} onClose={closeQuickView} />
    </div>
  );
}