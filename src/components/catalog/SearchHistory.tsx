import type { ReactElement } from "react";

interface SearchHistoryProps {
  history: string[];
  active: string;
  onPick: (term: string) => void;
  onClear: () => void;
}

export function SearchHistory({ history, active, onPick, onClear }: SearchHistoryProps): ReactElement | null {
  if (history.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Recent</span>
      {history.map((term) => (
        <button
          key={term}
          type="button"
          onClick={() => onPick(term)}
          data-picked={term === active}
          className="chip picked:border-brand picked:bg-brand-soft picked:text-brand hocus:border-brand hocus:text-brand"
        >
          ⌕ {term}
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="chip text-muted hocus:border-danger hocus:text-danger"
        aria-label="Clear search history"
      >
        ✕ Clear
      </button>
    </div>
  );
}