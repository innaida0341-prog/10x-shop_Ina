import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { useToast } from "@/context/ToastContext";
import { viewsStorage } from "@/models/storage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isSavedViewList } from "@/utils/guards";
import { createId } from "@/utils/id";
import { SAVED_VIEWS_LIMIT, TOAST } from "@/utils/constants";
import type { SavedView } from "@/types/bonus";

interface SavedViewsProps {
  currentQuery: string;
  onApply: (query: string) => void;
}

export function SavedViews({ currentQuery, onApply }: SavedViewsProps): ReactElement {
  const toast = useToast();
  const [views, setViews] = useLocalStorage<SavedView[]>("shop_views", [], isSavedViewList);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSave = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("View name must be at least 2 characters");
      return;
    }
    if (views.some((view) => view.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("A view with this name already exists");
      return;
    }
    const next: SavedView = {
      id: createId("view"),
      name: trimmed,
      query: currentQuery,
      createdAt: new Date().toISOString(),
    };
    setViews([next, ...views].slice(0, SAVED_VIEWS_LIMIT));
    setName("");
    setError(null);
    toast.success(TOAST.viewSaved);
  };

  const handleDelete = (id: number | string): void => {
    const target = views.find((view) => view.id === id);
    if (!target) return;
    setViews(views.filter((view) => view.id !== id));
    toast.info(`View "${target.name}" deleted`, {
      action: {
        label: "Undo",
        onClick: () => setViews([target, ...viewsStorage.get() ?? []].slice(0, SAVED_VIEWS_LIMIT)),
      },
    });
  };

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-save">Saved views</h2>
        <form onSubmit={handleSave} className="flex flex-1 items-center gap-2 min-[481px]:flex-none">
          <label htmlFor="view-name" className="sr-only">View name</label>
          <input
            id="view-name"
            value={name}
            onChange={(event) => { setName(event.target.value); setError(null); }}
            placeholder="Name this filter set"
            aria-invalid={Boolean(error)}
            className="field h-9 min-h-9 w-full py-1 text-sm min-[481px]:w-52"
          />
          <button
            type="submit"
            className="tap shrink-0 rounded-xl border border-save px-4 text-sm font-semibold text-save transition hocus:bg-save hocus:text-white"
          >
            Save
          </button>
        </form>
      </div>

      {error && <p role="alert" className="mt-2 text-xs font-medium text-danger">{error}</p>}

      {views.length === 0 ? (
        <p className="mt-3 text-xs text-muted">
          Save a combination of search, category, sort and price to jump back to it in one click.
        </p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {views.map((view) => (
            <li key={view.id} className="inline-flex items-center overflow-hidden rounded-full border border-save/45 bg-save/10">
              <button
                type="button"
                onClick={() => onApply(view.query)}
                data-picked={view.query === currentQuery}
                className="tap px-3.5 text-sm font-semibold text-save transition picked:bg-save picked:text-white hocus:bg-save/25"
              >
                ★ {view.name}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(view.id)}
                aria-label={`Delete view ${view.name}`}
                className="grid h-full min-h-9 w-8 place-items-center border-l border-save/35 text-xs text-save transition hocus:bg-danger hocus:text-white"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}