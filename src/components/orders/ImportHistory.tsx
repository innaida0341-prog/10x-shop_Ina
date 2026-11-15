import { useState } from "react";
import type { ReactElement } from "react";
import { api } from "@/api/products.api";
import { isApiError } from "@/api/ApiError";
import { remoteCartToOrder, remoteCartsEndpoint } from "@/api/orders.api";
import type { RemoteCartsResponse } from "@/api/orders.api";
import { useToast } from "@/context/ToastContext";
import { ordersStorage } from "@/models/storage";
import { IMPORT_USER_ID } from "@/utils/constants";
import type { Order } from "@/types/order";

interface ImportHistoryProps {
  onImported: (orders: Order[]) => void;
}

export function ImportHistory({ onImported }: ImportHistoryProps): ReactElement {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      const data = await api.get<RemoteCartsResponse>(remoteCartsEndpoint(IMPORT_USER_ID));
      const existing = ordersStorage.get() ?? [];
      const start = existing.length;
      const imported = data.carts.map((cart, index) =>
        remoteCartToOrder(cart, start + index + 1, (index + 1) * 60),
      );
      const next = [...existing, ...imported];
      ordersStorage.set(next);
      onImported(next);
      toast.success(`${imported.length} demo orders imported ✓`);
    } catch (caught: unknown) {
      const message = isApiError(caught) ? caught.message : "Could not import demo history.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card flex flex-wrap items-center gap-3 border-dashed p-4">
      <div className="min-w-40 flex-1">
        <h2 className="font-display text-sm font-bold">Import demo history</h2>
        <p className="mt-0.5 text-xs text-muted">
          Pulls public sample carts from <code className="text-brand">GET /carts/user/{IMPORT_USER_ID}</code> and appends
          them as clearly marked demo orders. No account or payment data is involved.
        </p>
        {error && (
          <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
            {error}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          void handleImport();
        }}
        disabled={busy}
        data-busy={busy}
        className="tap rounded-xl border border-brand px-5 text-sm font-semibold text-brand transition busy:opacity-60 hocus:bg-brand hocus:text-white disabled:cursor-not-allowed"
      >
        {busy ? "Importing…" : "Import"}
      </button>
    </div>
  );
}