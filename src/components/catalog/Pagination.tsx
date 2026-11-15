import type { ReactElement } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

type PageItem = number | "gap-left" | "gap-right";

function buildItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const items: PageItem[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push("gap-left");
  for (let index = start; index <= end; index += 1) items.push(index);
  if (end < totalPages - 1) items.push("gap-right");
  items.push(totalPages);

  return items;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps): ReactElement | null {
  if (totalPages <= 1) return null;

  const buttonBase = "tap grid place-items-center rounded-xl border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={`${buttonBase} border-border bg-surface hover:border-brand hover:text-brand`}
      >
        ‹
      </button>

      {buildItems(page, totalPages).map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`${buttonBase} ${
              item === page
                ? "border-brand bg-brand text-white"
                : "border-border bg-surface hover:border-brand hover:text-brand"
            }`}
          >
            {item}
          </button>
        ) : (
          <span key={item} className="px-1 text-muted">…</span>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={`${buttonBase} border-border bg-surface hover:border-brand hover:text-brand`}
      >
        ›
      </button>
    </nav>
  );
}