import type { ReactElement } from "react";

export function Spinner({ label = "Loading" }: { label?: string }): ReactElement {
  return (
    <div className="flex flex-col items-center gap-3 py-16" role="status" aria-live="polite">
      <span className="size-10 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand" />
      <span className="text-sm font-medium text-muted">{label}…</span>
    </div>
  );
}