import type { ReactElement } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartLine } from "@/components/cart/CartLine";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Panel";
import { useCart } from "@/context/CartContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { isNoticeState } from "@/utils/guards";

export default function CartPage(): ReactElement {
  useDocumentTitle("Cart");
  const { state, cart, itemCount, setQuantity, removeItem, clearCart, applyPromo, removePromo } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = isNoticeState(location.state) ? location.state.reason : null;

  const handleClear = (): void => {
    if (window.confirm("Clear the cart? This cannot be undone.")) clearCart();
  };

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="font-display text-3xl font-bold">Your cart</h1>
        {notice && (
          <p className="card border-warning/40 bg-warning/10 px-4 py-3 text-sm font-medium text-warning" role="status">
            {notice}
          </p>
        )}
        <EmptyState title="Your cart is empty." description="Browse the catalog and add something you love." actionLabel="Browse products" actionTo="/" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Your cart</h1>
          <p className="mt-1 text-sm text-muted">{itemCount} item{itemCount === 1 ? "" : "s"} ready for checkout</p>
        </div>
        <Link to="/" className="tap inline-flex items-center rounded-xl px-3 text-sm font-semibold text-brand transition hover:bg-brand-soft">
          ← Continue shopping
        </Link>
      </header>

      <div className="grid gap-6 min-[901px]:grid-cols-[1.7fr_1fr]">
        <Panel>
          <ul className="flex flex-col">
            {state.items.map((item) => (
              <CartLine key={item.productId} item={item} onQuantityChange={setQuantity} onRemove={removeItem} />
            ))}
          </ul>
          <button
            type="button"
            onClick={handleClear}
            className="tap mt-4 rounded-xl border border-border px-5 text-sm font-semibold transition hover:border-danger hover:text-danger"
          >
            Clear cart
          </button>
        </Panel>

        <CartSummary cart={cart} onApplyPromo={applyPromo} onRemovePromo={removePromo}>
          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="tap w-full rounded-xl bg-brand font-semibold text-white transition hover:bg-brand-deep active:scale-[0.99]"
          >
            Proceed to checkout
          </button>
        </CartSummary>
      </div>
    </div>
  );
}