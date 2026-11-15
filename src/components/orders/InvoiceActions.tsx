import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import { downloadInvoice } from "@/utils/invoice";
import type { Order } from "@/types/order";

export function InvoiceActions({ order }: { order: Order }): ReactElement {
  const toast = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to={`/orders/${order.id}/invoice`}
        className="tap inline-flex items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hocus:bg-brand-deep"
      >
        🧾 Invoice
      </Link>
      <button
        type="button"
        onClick={() => { downloadInvoice(order); toast.success("Invoice downloaded ✓"); }}
        className="tap rounded-xl border border-border px-5 text-sm font-semibold transition hocus:border-brand hocus:text-brand"
      >
        ⭳ Download
      </button>
    </div>
  );
}