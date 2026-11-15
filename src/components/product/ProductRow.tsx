import { memo } from "react";
import type { ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Price } from "@/components/ui/Price";
import { StockBadge } from "@/components/ui/StockBadge";
import { useWishlist } from "@/context/WishlistContext";
import { titleCase } from "@/utils/format";
import type { Product } from "@/types/product";

export interface ProductRowProps {
  product: Product;
  onAdd: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

function ProductRowBase({ product, onAdd, onQuickView }: ProductRowProps): ReactElement {
  const navigate = useNavigate();
  const { has, toggle } = useWishlist();
  const soldOut = product.stock === 0;
  const wished = has(product.id);

  return (
    <article
      onClick={() => navigate(`/products/${product.id}`)}
      className="card @container flex animate-fade-up cursor-pointer gap-4 p-3 transition hocus:border-brand/45 hocus:shadow-[0_20px_44px_-32px_var(--color-brand)]"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        loading="lazy"
        width={128}
        height={128}
        className="size-24 shrink-0 rounded-xl bg-surface-2 object-contain p-1 @md:size-32"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2 @lg:flex-row @lg:items-center @lg:gap-5">
        <div className="min-w-0 flex-1">
          <Link
            to={`/products/${product.id}`}
            onClick={(event) => event.stopPropagation()}
            className="line-clamp-1 font-display text-base font-bold transition hocus:text-brand"
          >
            {product.title}
          </Link>

          <p className="mt-0.5 truncate text-xs text-muted">
            {titleCase(product.category)}
            {product.brand ? ` · ${product.brand}` : ""}
          </p>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted @md:line-clamp-1">
            {product.description}
          </p>

          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="font-semibold text-amber">★ {product.rating.toFixed(1)}</span>
            <StockBadge stock={product.stock} />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 @lg:flex-col @lg:items-end">
          <Price price={product.price} discountPercentage={product.discountPercentage} />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggle(product);
              }}
              aria-pressed={wished}
              aria-label={wished ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
              data-picked={wished}
              className="tap grid place-items-center rounded-xl border border-border text-lg transition picked:border-wish picked:bg-wish picked:text-white hocus:border-wish hocus:text-wish picked:hocus:text-white"
            >
              {wished ? "♥" : "♡"}
            </button>

            {onQuickView && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onQuickView(product);
                }}
                className="tap rounded-xl border border-brand px-3 text-xs font-bold text-brand transition hocus:bg-brand hocus:text-white"
              >
                Quick view
              </button>
            )}

            <button
              type="button"
              disabled={soldOut}
              onClick={(event) => {
                event.stopPropagation();
                onAdd(product);
              }}
              className="tap rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hocus:bg-brand-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
            >
              {soldOut ? "Sold out" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export const ProductRow = memo(ProductRowBase);