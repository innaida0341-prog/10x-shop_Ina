import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImportHistory } from "@/components/orders/ImportHistory";
import { useNow } from "@/hooks/useNow";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { OrderModel } from "@/models/Order";
import { ordersStorage } from "@/models/storage";
import { formatDate, formatPrice } from "@/utils/format";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_STYLE: Record<OrderStatus, string> = {
  Processing: "bg-muted/15 text-muted",
  Shipped: "bg-info/15 text-info",
  Delivered: "bg-success/15 text-success",
};

export default function OrdersPage(): ReactElement {
  useDocumentTitle("Orders");
  const [orders, setOrders] = useState<Order[]>(() => ordersStorage.get() ?? []);
  const [filter, setFilter] = useState<OrderStatus | "">("");
  const now = useNow(30_000);

  const sorted = useMemo(() => {
    const copy = [...orders].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
    if (filter === "") return copy;
    return copy.filter((order) => OrderModel.fromJSON(order).getStatus(now) === filter);
  }, [orders, filter, now]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Your orders</h1>
          <p className="mt-1 text-sm text-muted">Statuses recalculate every 30 seconds without a reload.</p>
        </div>
        <div>
          <label htmlFor="order-filter" className="sr-only">Filter by status</label>
          <select
            id="order-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value as OrderStatus | "")}
            className="field h-10 min-h-10 w-auto py-1 text-sm"
          >
            <option value="">All statuses</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </header>

      <ImportHistory onImported={setOrders} />

      {orders.length === 0 ? (
        <EmptyState title="You have no orders yet." description="Place an order or import the demo history above." actionLabel="Browse products" actionTo="/" />
      ) : sorted.length === 0 ? (
        <EmptyState title="No orders match this status." description="Clear the filter to see the full history." />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {sorted.map((order) => {
            const status = OrderModel.fromJSON(order).getStatus(now);
            const units = order.items.reduce((sum, item) => sum + item.quantity, 0);
            return (
              <li key={order.id}>
                <Link
                  to={`/orders/${order.id}`}
                  className="card flex h-full animate-fade-up flex-col gap-3 p-5 transition hocus:-translate-y-0.5 hocus:border-brand/45"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-bold">#{order.number}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[status]}`}>{status}</span>
                  </div>
                  <p className="text-sm text-muted">
                    {formatDate(order.placedAt)} · {units} item{units === 1 ? "" : "s"}
                    {order.source === "imported" && <span className="ml-2 rounded-full bg-amber/15 px-2 py-0.5 text-[11px] font-bold text-amber">Demo</span>}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm text-muted">Total</span>
                    <span className="font-display text-xl font-bold">{formatPrice(order.total)}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}