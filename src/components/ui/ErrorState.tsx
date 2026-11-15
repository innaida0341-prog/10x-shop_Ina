import type { ReactElement } from "react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps): ReactElement {
  return (
    <div className="card mx-auto max-w-lg animate-fade-up p-8 text-center" role="alert">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-danger/12 text-2xl text-danger">!</span>
      <h2 className="mt-4 text-xl font-semibold">We hit a snag</h2>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="tap mt-6 rounded-xl bg-brand px-6 font-semibold text-white transition hover:bg-brand-deep active:scale-[0.98]"
        >
          Retry
        </button>
      )}
    </div>
  );
}