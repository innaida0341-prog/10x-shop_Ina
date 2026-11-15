import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function NotFoundPage(): ReactElement {
  useDocumentTitle("Page not found");

  return (
    <div className="mx-auto grid max-w-lg animate-fade-up place-items-center py-10 text-center">
      <span className="font-display text-7xl font-bold text-brand/25">404</span>
      <h1 className="mt-3 font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-muted">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="tap mt-7 grid place-items-center rounded-xl bg-brand px-8 font-semibold text-white transition hover:bg-brand-deep active:scale-[0.98]"
      >
        Go to catalog
      </Link>
    </div>
  );
}