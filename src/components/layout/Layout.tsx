import { Suspense } from "react";
import type { ReactElement } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";

function RouteFallback(): ReactElement {
  return (
    <div aria-busy="true">
      <div
        aria-hidden
        data-print="hide"
        className="fixed inset-x-0 top-0 z-60 h-3px overflow-hidden"
      >
        <div className="route-progress h-full w-full animate-shimmer" />
      </div>

      <div aria-hidden className="mb-6 flex flex-col gap-3">
        <div className="sk-block h-10 w-64 max-w-full rounded-xl" />
        <div className="sk-block h-4 w-96 max-w-full rounded-lg [--sk-offset:80ms]" />
      </div>

      <div aria-hidden className="card mb-6 flex flex-wrap items-center gap-3 p-3">
        <div className="sk-block h-11 min-w-52 flex-1 rounded-xl [--sk-offset:120ms]" />
        <div className="sk-block h-11 w-40 rounded-xl [--sk-offset:170ms]" />
        <div className="sk-block h-11 w-36 rounded-xl [--sk-offset:220ms]" />
        <div className="sk-block h-11 w-24 rounded-xl [--sk-offset:270ms]" />
      </div>

      <div aria-hidden className="mb-5 flex flex-wrap gap-2">
        <div className="sk-block h-8 w-28 rounded-full [--sk-offset:310ms]" />
        <div className="sk-block h-8 w-24 rounded-full [--sk-offset:350ms]" />
        <div className="sk-block h-8 w-32 rounded-full [--sk-offset:390ms]" />
      </div>

      <SkeletonGrid count={12} label="Loading page" />
    </div>
  );
}

export function Layout(): ReactElement {
  const { pathname } = useLocation();

  return (
    <div className="relative flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60"
      >
        Skip to content
      </a>

      <div
        aria-hidden
        data-print="hide"
        className="aurora-field pointer-events-none fixed inset-0 -z-10 opacity-70 dark:opacity-45"
      />

      <ScrollToTop />
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto min-h-[70vh] w-full max-w-1400px flex-1 scroll-mt-24 px-4 py-7 outline-none sm:py-9"
      >
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}