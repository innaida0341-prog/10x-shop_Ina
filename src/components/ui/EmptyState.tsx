import type { ReactElement, ReactNode } from "react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  children?: ReactNode;
}

export function EmptyState({ title, description, actionLabel, actionTo, children }: EmptyStateProps): ReactElement {
  return (
    <div className="card mx-auto max-w-lg animate-fade-up p-10 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-soft text-3xl">🛍️</span>
      <h2 className="mt-5 text-xl font-semibold">{title}</h2>
      {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="tap mt-6 inline-grid place-items-center rounded-xl bg-brand px-6 font-semibold text-white transition hover:bg-brand-deep"
        >
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  );
}