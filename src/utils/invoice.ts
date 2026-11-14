import type { Order } from "@/types/order";
import { Cart } from "@/models/Cart";
import { lineTotal } from "./cart";
import { formatDate, formatPrice } from "./format";
import { getOrderStatus } from "./orderStatus";

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildInvoiceHtml(order: Order): string {
  const rows = order.items
    .map(
      (item) => `<tr>
        <td>${escape(item.title)}</td>
        <td class="num">${item.quantity}</td>
        <td class="num">${formatPrice(Cart.unitPrice(item))}</td>
        <td class="num">${formatPrice(lineTotal(item))}</td>
      </tr>`,
    )
    .join("");

  const discountRow =
    order.discount > 0
      ? `<tr><td colspan="3">Discount</td><td class="num">−${formatPrice(order.discount)}</td></tr>`
      : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Invoice ${escape(order.number)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin:0; padding:32px; font:14px/1.6 "Inter",system-ui,sans-serif; color:#11131b; background:#f4f2ee; }
  .sheet { max-width:820px; margin:0 auto; background:#fff; padding:44px; border-radius:14px; box-shadow:0 20px 50px -34px rgba(0,0,0,.5); }
  header { display:flex; justify-content:space-between; gap:24px; flex-wrap:wrap; border-bottom:2px solid #6d5ef6; padding-bottom:20px; }
  .brand { font-size:24px; font-weight:800; letter-spacing:-.03em; }
  .brand span { color:#6d5ef6; }
  .muted { color:#5f6478; }
  h1 { font-size:20px; margin:0 0 4px; letter-spacing:-.02em; }
  h2 { font-size:12px; text-transform:uppercase; letter-spacing:.14em; color:#5f6478; margin:0 0 8px; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:28px; margin:28px 0; }
  table { width:100%; border-collapse:collapse; margin-top:8px; }
  th, td { text-align:left; padding:10px 8px; border-bottom:1px solid #e5e0d8; }
  th { font-size:11px; text-transform:uppercase; letter-spacing:.1em; color:#5f6478; }
  .num { text-align:right; font-variant-numeric:tabular-nums; }
  .totals { margin-left:auto; width:min(320px,100%); margin-top:18px; }
  .totals td { border:0; padding:5px 8px; }
  .grand td { border-top:2px solid #11131b; font-size:17px; font-weight:800; padding-top:10px; }
  .badge { display:inline-block; padding:4px 12px; border-radius:999px; background:#eeebff; color:#4a3ad4; font-weight:700; font-size:12px; }
  footer { margin-top:34px; padding-top:16px; border-top:1px solid #e5e0d8; font-size:12px; color:#5f6478; }
  @media print { body { background:#fff; padding:0; } .sheet { box-shadow:none; border-radius:0; padding:0; max-width:none; } @page { size:A4; margin:16mm; } }
</style></head>
<body><div class="sheet">
  <header>
    <div><div class="brand">10<span>X</span> Shop</div><div class="muted">Graduation demo store · Tbilisi, Georgia</div></div>
    <div style="text-align:right">
      <h1>Invoice ${escape(order.number)}</h1>
      <div class="muted">${formatDate(order.placedAt)}</div>
      <div style="margin-top:8px"><span class="badge">${getOrderStatus(order.placedAt)}</span></div>
    </div>
  </header>
  <div class="grid">
    <div><h2>Billed to</h2>
      <strong>${escape(order.shipping.fullName)}</strong><br />
      ${escape(order.shipping.email)}<br />${escape(order.shipping.phone)}
    </div>
    <div><h2>Ship to</h2>
      ${escape(order.shipping.address)}<br />
      ${escape(order.shipping.city)}, ${escape(order.shipping.postalCode)}<br />
      ${escape(order.shipping.country)}
    </div>
  </div>
  <h2>Items</h2>
  <table><thead><tr><th>Product</th><th class="num">Qty</th><th class="num">Unit</th><th class="num">Line</th></tr></thead>
  <tbody>${rows}</tbody></table>
  <table class="totals"><tbody>
    <tr><td colspan="3">Subtotal</td><td class="num">${formatPrice(order.subtotal)}</td></tr>
    ${discountRow}
    <tr><td colspan="3">Shipping</td><td class="num">${order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</td></tr>
    <tr class="grand"><td colspan="3">Total</td><td class="num">${formatPrice(order.total)}</td></tr>
  </tbody></table>
  <footer>Payment: cash on delivery (demo). No card data is collected or stored. This document is generated locally for demonstration purposes.</footer>
</div></body></html>`;
}

export function downloadInvoice(order: Order): void {
  const blob = new Blob([buildInvoiceHtml(order)], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `invoice-${order.number}.html`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function printInvoice(): void {
  window.print();
}