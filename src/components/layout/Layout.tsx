import { Suspense } from "react";
import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Spinner } from "@/components/ui/Spinner";

export function Layout(): ReactElement {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 animate-drift opacity-70 dark:opacity-45"
        style={{
          background:
            "radial-gradient(48rem 32rem at 12% -8%, color-mix(in oklab, var(--color-brand) 30%, transparent), transparent 65%)," +
            "radial-gradient(40rem 30rem at 92% 4%, color-mix(in oklab, var(--color-accent) 24%, transparent), transparent 62%)," +
            "radial-gradient(46rem 34rem at 50% 108%, color-mix(in oklab, var(--color-cyan) 22%, transparent), transparent 66%)",
        }}
      />
      <ScrollToTop />
      <Header />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-7 sm:py-9">
        <ErrorBoundary>
          <Suspense fallback={<Spinner label="Loading page" />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}