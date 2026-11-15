import { memo } from "react";
import type { ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Price } from "@/components/ui/Price";
import { StockBadge } from "@/components/ui/StockBadge";
import { useWishlist } from "@/context/WishlistContext";
import { titleCase } from "@/utils/format";
import type { Product } from "@/types/product";

export interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

function ProductCardBase({ product, onAdd, onQuickView }: ProductCardProps): ReactElement {
  const navigate = useNavigate();
  const { has, toggle } = useWishlist();
  const soldOut = product.stock === 0;
  const wished = has(product.id);

  return (
    <article
      onClick={() => navigate(`/products/${product.id}`)}
      className="card group flex animate-fade-up cursor-pointer flex-col overflow-hidden p-3 transition duration-300 hocus:-translate-y-1 hocus:border-brand/45 hocus:shadow-[0_26px_50px_-30px_var(--color-brand)]"
    >
      <div className="relative overflow-hidden rounded-xl bg-surface-2">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          width={280}
          height={280}
          className="h-44 w-full object-contain transition duration-500 group-hover:scale-[1.06]"
        />

        {product.discountPercentage >= 1 && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-white">SALE</span>
        )}

        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); toggle(product); }}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
          data-picked={wished}
          className="tap absolute right-2 top-2 grid place-items-center rounded-full border border-border bg-surface/85 text-lg backdrop-blur transition picked:border-wish picked:bg-wish picked:text-white hocus:scale-110 hocus:border-wish hocus:text-wish picked:hocus:text-white"
        >
          {wished ? "♥" : "♡"}
        </button>

        {onQuickView && (
          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); onQuickView(product); }}
            className="absolute inset-x-2 bottom-2 min-h-9 translate-y-2 rounded-xl border border-brand/50 bg-surface/92 text-xs font-bold text-brand opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
          >
            Quick view
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <Link
          to={`/products/${product.id}`}
          onClick={(event) => event.stopPropagation()}
          className="line-clamp-2 font-display text-sm font-bold leading-snug transition hocus:text-brand"
        >
          {product.title}
        </Link>

        <p className="mt-1 truncate text-xs text-muted">
          {titleCase(product.category)}{product.brand ? ` · ${product.brand}` : ""}
        </p>

        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="font-semibold text-amber">★ {product.rating.toFixed(1)}</span>
          <StockBadge stock={product.stock} />
        </div>

        <div className="mt-auto pt-3">
          <Price price={product.price} discountPercentage={product.discountPercentage} />
          <button
            type="button"
            disabled={soldOut}
            onClick={(event) => { event.stopPropagation(); onAdd(product); }}
            className="tap mt-3 w-full rounded-xl bg-brand font-semibold text-white transition hocus:bg-brand-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
          >
            {soldOut ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardBase);