import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Drawer } from "@/components/ui/Drawer";
import { Price } from "@/components/ui/Price";
import { StockBadge } from "@/components/ui/StockBadge";
import { Stars } from "@/components/ui/Stars";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { titleCase } from "@/utils/format";
import type { Product } from "@/types/product";

interface QuickViewDrawerProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewDrawer({ product, onClose }: QuickViewDrawerProps): ReactElement {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    setQuantity(1);
    setImage(null);
  }, [product?.id]);

  const images = product ? (product.images.length > 0 ? product.images : [product.thumbnail]) : [];
  const main = image ?? images[0] ?? "";
  const wished = product ? has(product.id) : false;
  const soldOut = product ? product.stock === 0 : true;

  return (
    <Drawer
      open={product !== null}
      onClose={onClose}
      title={product?.title ?? "Product"}
      subtitle={product ? titleCase(product.category) : undefined}
      footer={
        product && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <QuantityStepper value={quantity} max={product.stock} onChange={setQuantity} disabled={soldOut} />
              <button
                type="button"
                disabled={soldOut}
                onClick={() => { addItem(product, quantity); onClose(); }}
                className="tap flex-1 rounded-xl bg-brand font-semibold text-white transition hocus:bg-brand-deep disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
              >
                {soldOut ? "Out of stock" : "Add to cart"}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggle(product)}
                data-picked={wished}
                className="tap flex-1 rounded-xl border border-border text-sm font-semibold transition picked:border-wish picked:bg-wish picked:text-white hocus:border-wish hocus:text-wish picked:hocus:text-white"
              >
                {wished ? "♥ Saved" : "♡ Save"}
              </button>
              <Link
                to={`/products/${product.id}`}
                onClick={onClose}
                className="tap grid flex-1 place-items-center rounded-xl border border-brand text-sm font-semibold text-brand transition hocus:bg-brand hocus:text-white"
              >
                Full details →
              </Link>
            </div>
          </div>
        )
      }
    >
      {product && (
        <div className="flex flex-col gap-4">
          <div className="grid place-items-center rounded-2xl border border-border bg-surface-2 p-3">
            <img src={main} alt={product.title} width={360} height={360} className="h-56 w-full object-contain" />
          </div>

          {images.length > 1 && (
            <div className="nice-scroll flex gap-2 overflow-x-auto pb-1">
              {images.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setImage(entry)}
                  aria-label={`Show image ${images.indexOf(entry) + 1}`}
                  data-picked={main === entry}
                  className="size-16 shrink-0 overflow-hidden rounded-xl border-2 border-border bg-surface-2 p-1 transition picked:border-brand hocus:border-brand/60"
                >
                  <img src={entry} alt="" loading="lazy" width={64} height={64} className="size-full object-contain" />
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Price price={product.price} discountPercentage={product.discountPercentage} size="lg" />
            <StockBadge stock={product.stock} />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Stars rating={product.rating} />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-muted">· {product.reviews.length} reviews</span>
          </div>

          <p className="text-sm leading-relaxed text-muted">{product.description}</p>

          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-border bg-surface-2 px-3 py-2">
              <dt className="text-muted">Brand</dt><dd className="font-semibold">{product.brand ?? "Generic"}</dd>
            </div>
            <div className="rounded-xl border border-border bg-surface-2 px-3 py-2">
              <dt className="text-muted">Available</dt><dd className="font-semibold">{product.stock} units</dd>
            </div>
          </dl>
        </div>
      )}
    </Drawer>
  );
}