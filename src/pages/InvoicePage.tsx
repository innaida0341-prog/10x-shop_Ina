import { useState } from "react";
import type { ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Cart } from "@/models/Cart";
import { ordersStorage } from "@/models/storage";
import { lineTotal } from "@/utils/cart";
import { formatDate, formatPrice } from "@/utils/format";
import { downloadInvoice, printInvoice } from "@/utils/invoice";
import { getOrderStatus } from "@/utils/orderStatus";
import type { Order } from "@/types/order";

export default function InvoicePage(): ReactElement {
  const { id } = useParams();
  const [orders] = useState<Order[]>(() => ordersStorage.get() ?? []);
  const order = orders.find((entry) => String(entry.id) === id) ?? null;
  useDocumentTitle(order ? `Invoice ${order.number}` : "Invoice");

  if (order === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <NotFoundPage />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg px-4 py-8">
      <div data-print="hide" className="mx-auto mb-6 flex max-w-3xl flex-wrap items-center gap-3">
        <Link to={`/orders/${order.id}`} className="tap inline-flex items-center rounded-xl border border-border px-4 text-sm font-semibold transition hocus:border-brand hocus:text-brand">
          ← Back to order
        </Link>
        <button type="button" onClick={printInvoice} className="tap rounded-xl bg-brand px-6 text-sm font-semibold text-white transition hocus:bg-brand-deep">
          🖨 Print / Save as PDF
        </button>
        <button
          type="button"
          onClick={() => downloadInvoice(order)}
          className="tap rounded-xl border border-border px-5 text-sm font-semibold transition hocus:border-brand hocus:text-brand"
        >
          ⭳ Download HTML
        </button>
        <p className="w-full text-xs text-muted">
          In the print dialog choose “Save as PDF” as the destination. Headers and buttons are excluded automatically.
        </p>
      </div>

      <article className="invoice-sheet mx-auto max-w-3xl rounded-card border border-border bg-surface p-8 shadow-[0_28px_60px_-44px_rgba(0,0,0,0.6)] sm:p-11">
        <header className="flex flex-wrap justify-between gap-6 border-b-2 border-brand pb-5">
          <div>
            <p className="font-display text-2xl font-bold">10<span className="text-brand">X</span> Shop</p>
            <p className="text-sm text-muted">Graduation demo store · Tbilisi, Georgia</p>
          </div>
          <div className="text-right">
            <h1 className="font-display text-xl font-bold">Invoice {order.number}</h1>
            <p className="text-sm text-muted">{formatDate(order.placedAt)}</p>
            <span className="mt-2 inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-deep">
              {getOrderStatus(order.placedAt)}
            </span>
          </div>
        </header>

        <div className="my-7 grid gap-7 sm:grid-cols-2">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Billed to</h2>
            <p className="mt-2 text-sm leading-relaxed">
              <b>{order.shipping.fullName}</b><br />{order.shipping.email}<br />{order.shipping.phone}
            </p>
          </section>
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Ship to</h2>
            <p className="mt-2 text-sm leading-relaxed">
              {order.shipping.address}<br />{order.shipping.city}, {order.shipping.postalCode}<br />{order.shipping.country}
            </p>
          </section>
        </div>

        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Items</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border py-2.5 text-left text-[11px] uppercase tracking-[0.1em] text-muted">Product</th>
              <th className="border-b border-border py-2.5 text-right text-[11px] uppercase tracking-[0.1em] text-muted">Qty</th>
              <th className="border-b border-border py-2.5 text-right text-[11px] uppercase tracking-[0.1em] text-muted">Unit</th>
              <th className="border-b border-border py-2.5 text-right text-[11px] uppercase tracking-[0.1em] text-muted">Line</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td className="border-b border-border py-2.5">{item.title}</td>
                <td className="border-b border-border py-2.5 text-right tabular-nums">{item.quantity}</td>
                <td className="border-b border-border py-2.5 text-right tabular-nums">{formatPrice(Cart.unitPrice(item))}</td>
                <td className="border-b border-border py-2.5 text-right tabular-nums">{formatPrice(lineTotal(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="ml-auto mt-5 w-full max-w-xs text-sm">
          <div className="flex justify-between py-1"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatPrice(order.subtotal)}</dd></div>
          {order.discount > 0 && <div className="flex justify-between py-1 text-success"><dt>Discount</dt><dd className="tabular-nums">−{formatPrice(order.discount)}</dd></div>}
          <div className="flex justify-between py-1"><dt className="text-muted">Shipping</dt><dd className="tabular-nums">{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</dd></div>
          <div className="mt-1 flex justify-between border-t-2 border-text pt-2 font-display text-lg font-bold"><dt>Total</dt><dd className="tabular-nums">{formatPrice(order.total)}</dd></div>
        </dl>

        <footer className="mt-8 border-t border-border pt-4 text-xs text-muted">
          Payment: cash on delivery (demo). No card data is collected or stored. Generated locally for demonstration.
        </footer>
      </article>
    </div>
  );
}