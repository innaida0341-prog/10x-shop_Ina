import type { ReactElement } from "react";
import type { CatalogView } from "@/types/bonus";

interface ViewToggleProps {
  view: CatalogView;
  infinite: boolean;
  onViewChange: (view: CatalogView) => void;
  onInfiniteChange: (infinite: boolean) => void;
}

export function ViewToggle({ view, infinite, onViewChange, onInfiniteChange }: ViewToggleProps): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex overflow-hidden rounded-xl border border-border" role="group" aria-label="Layout">
        {(["grid", "list"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onViewChange(option)}
            aria-pressed={view === option}
            className={`tap px-4 text-sm font-semibold capitalize transition ${
              view === option ? "bg-brand text-white" : "bg-surface text-muted hocus:bg-brand-soft hocus:text-brand"
            }`}
          >
            {option === "grid" ? "▦ Grid" : "☰ List"}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onInfiniteChange(!infinite)}
        aria-pressed={infinite}
        data-picked={infinite}
        className="chip picked:border-save picked:bg-save/15 picked:text-save hocus:border-brand hocus:text-brand"
      >
        <span className={`size-2 rounded-full ${infinite ? "bg-save" : "bg-border"}`} />
        Infinite scroll {infinite ? "on" : "off"}
      </button>
    </div>
  );
}