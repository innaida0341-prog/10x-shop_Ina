import type { ReactElement, ReactNode } from "react";
import type { Cart } from "@/models/Cart";
import { Cart as CartModel } from "@/models/Cart";
import { formatPrice } from "@/utils/format";
import { PROMO_CODE } from "@/utils/constants";
import { PromoForm } from "./PromoForm";

interface CartSummaryProps {
  cart: Cart;
  onApplyPromo?: (code: string) => boolean;
  onRemovePromo?: () => void;
  children?: ReactNode;
}

function Row({ label, value, accent = false }: { label: ReactNode; value: string; accent?: boolean }): ReactElement {
  return (
    <div className={`flex items-center justify-between gap-3 text-sm ${accent ? "font-bold" : ""}`}>
      <span className={accent ? "font-display text-base" : "text-muted"}>{label}</span>
      <span className={`tabular-nums ${accent ? "font-display text-xl" : "font-semibold"}`}>{value}</span>
    </div>
  );
}

export function CartSummary({ cart, onApplyPromo, onRemovePromo, children }: CartSummaryProps): ReactElement {
  const discount = cart.discount();
  const shipping = cart.shipping();
  const remaining = CartModel.FREE_SHIPPING_FROM - (cart.subtotal() - discount);

  return (
    <div className="card sticky top-24 p-5">
      <h2 className="font-display text-lg font-bold">Order summary</h2>

      <div className="mt-4 flex flex-col gap-3">
        <Row label="Subtotal" value={formatPrice(cart.subtotal())} />
        {discount > 0 && (
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-success">
              Discount ({PROMO_CODE} −10%)
              {onRemovePromo && (
                <button type="button" onClick={onRemovePromo} className="text-xs underline transition hover:text-danger">
                  Remove
                </button>
              )}
            </span>
            <span className="font-semibold tabular-nums text-success">−{formatPrice(discount)}</span>
          </div>
        )}
        <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />

        {shipping > 0 && remaining > 0 && (
          <p className="rounded-lg bg-brand-soft px-3 py-2 text-xs font-medium text-brand">
            Add {formatPrice(remaining)} more to unlock free shipping.
          </p>
        )}

        <div className="border-t border-border pt-3">
          <Row label="Total" value={formatPrice(cart.total())} accent />
        </div>
      </div>

      {onApplyPromo && discount === 0 && <PromoForm onApply={onApplyPromo} />}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}