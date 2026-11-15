import { useState } from "react";
import type { ReactElement } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { Panel } from "@/components/ui/Panel";
import { InvoiceActions } from "@/components/orders/InvoiceActions";
import { useCart } from "@/context/CartContext";
import { useNow } from "@/hooks/useNow";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Cart } from "@/models/Cart";
import { OrderModel } from "@/models/Order";
import { ordersStorage } from "@/models/storage";
import { formatDateTime, formatPrice } from "@/utils/format";
import { lineTotal } from "@/utils/cart";
import { isJustPlacedState } from "@/utils/guards";
import { STATUS_SEQUENCE } from "@/utils/orderStatus";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_STYLE: Record<OrderStatus, string> = {
  Processing: "bg-muted/15 text-muted",
  Shipped: "bg-info/15 text-info",
  Delivered: "bg-success/15 text-success",
};

export default function OrderDetailsPage(): ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItems } = useCart();
  const now = useNow(30_000);
  const [orders] = useState<Order[]>(() => ordersStorage.get() ?? []);

  const order = orders.find((entry) => String(entry.id) === id) ?? null;
  useDocumentTitle(order ? `Order #${order.number}` : "Order");

  if (order === null) return <NotFoundPage />;

  const model = OrderModel.fromJSON(order);
  const status = model.getStatus(now);
  const activeIndex = STATUS_SEQUENCE.indexOf(status);
  const justPlaced = isJustPlacedState(location.state) && location.state.justPlaced;

  return (
    <div className="flex animate-fade-up flex-col gap-6">
      {justPlaced && (
        <p className="card border-success/40 bg-success/10 px-4 py-3 text-sm font-semibold text-success" role="status">
          Thank you! Your order has been placed.
        </p>
      )}

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link to="/orders" className="text-sm font-semibold text-brand transition hocus:underline">← All orders</Link>
          <h1 className="mt-2 font-display text-3xl font-bold">
            Order #{order.number}
            {order.source === "imported" && <span className="ml-3 rounded-full bg-amber/15 px-2.5 py-1 align-middle text-xs font-bold text-amber">Demo import</span>}
          </h1>
          <p className="mt-1 text-sm text-muted">Placed {formatDateTime(order.placedAt)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${STATUS_STYLE[status]}`}>{status}</span>
          <InvoiceActions order={order} />
        </div>
      </header>

      <Panel title="Delivery progress">
        <ol className="flex flex-wrap items-center gap-2">
          {STATUS_SEQUENCE.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold ${
                index <= activeIndex ? "border-success/45 bg-success/10 text-success" : "border-border bg-surface-2 text-muted"
              }`}>
                <span className="grid size-5 place-items-center rounded-full border border-current text-[11px]">{index <= activeIndex ? "✓" : "○"}</span>
                {step}
              </span>
              {index < STATUS_SEQUENCE.length - 1 && <span className="text-muted">→</span>}
            </li>
          ))}
        </ol>
      </Panel>

      <div className="grid gap-6 min-[901px]:grid-cols-[1.7fr_1fr]">
        <Panel title="Items">
          <ul className="flex flex-col">
            {order.items.map((item) => (
              <li key={item.productId} className="flex flex-wrap items-center gap-4 border-b border-border py-3.5 last:border-b-0">
                <img src={item.thumbnail} alt={item.title} loading="lazy" width={64} height={64} className="size-16 rounded-xl border border-border bg-surface-2 object-contain p-1" />
                <div className="min-w-40 flex-1">
                  <Link to={`/products/${item.productId}`} className="font-display text-sm font-bold transition hocus:text-brand">{item.title}</Link>
                  <p className="mt-0.5 text-xs text-muted">{item.quantity} × {formatPrice(Cart.unitPrice(item))}</p>
                </div>
                <span className="font-display font-bold tabular-nums">{formatPrice(lineTotal(item))}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => { addItems(order.items); navigate("/cart"); }}
            className="tap mt-5 w-full rounded-xl bg-brand font-semibold text-white transition hocus:bg-brand-deep active:scale-[0.99]"
          >
            Reorder
          </button>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Shipping address">
            <address className="text-sm not-italic leading-relaxed text-muted">
              <b className="text-text">{order.shipping.fullName}</b><br />
              {order.shipping.address}<br />
              {order.shipping.city}, {order.shipping.postalCode}<br />
              {order.shipping.country}
              <span className="mt-2 block">{order.shipping.phone}</span>
              {order.shipping.email}
            </address>
            <p className="mt-4 rounded-xl bg-surface-2 px-3 py-2 text-xs text-muted">
              Payment: <b className="text-text">Cash on delivery (demo)</b> — no card data is stored.
            </p>
          </Panel>

          <Panel title="Totals">
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-semibold">{formatPrice(order.subtotal)}</dd></div>
              {order.discount > 0 && <div className="flex justify-between text-success"><dt>Discount</dt><dd className="font-semibold">−{formatPrice(order.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="font-semibold">{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</dd></div>
              <div className="flex justify-between border-t border-border pt-2 font-display text-lg font-bold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
}