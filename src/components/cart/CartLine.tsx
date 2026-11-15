import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Cart } from "@/models/Cart";
import { formatPrice } from "@/utils/format";
import { lineTotal } from "@/utils/cart";
import type { CartItem } from "@/types/cart";

interface CartLineProps {
  item: CartItem;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export function CartLine({ item, onQuantityChange, onRemove }: CartLineProps): ReactElement {
  return (
    <li className="flex animate-fade-up flex-wrap items-center gap-4 border-b border-border py-4 last:border-b-0">
      <img
        src={item.thumbnail}
        alt={item.title}
        loading="lazy"
        width={80}
        height={80}
        className="size-20 shrink-0 rounded-xl border border-border bg-surface-2 object-contain p-1"
      />

      <div className="min-w-40 flex-1">
        <Link to={`/products/${item.productId}`} className="font-display text-sm font-bold transition hover:text-brand">
          {item.title}
        </Link>
        <p className="mt-1 text-xs text-muted">{formatPrice(Cart.unitPrice(item))} each</p>
        {item.quantity >= item.stock && (
          <p className="mt-1 text-xs font-semibold text-warning">Stock limit reached</p>
        )}
      </div>

      <QuantityStepper
        value={item.quantity}
        max={item.stock}
        onChange={(quantity) => onQuantityChange(item.productId, quantity)}
        label={`Quantity for ${item.title}`}
      />

      <span className="min-w-24 text-right font-display font-bold tabular-nums">{formatPrice(lineTotal(item))}</span>

      <button
        type="button"
        onClick={() => onRemove(item.productId)}
        aria-label={`Remove ${item.title} from cart`}
        className="tap grid place-items-center rounded-xl border border-border px-3 text-sm transition hover:border-danger hover:text-danger"
      >
        ✕
      </button>
    </li>
  );
}