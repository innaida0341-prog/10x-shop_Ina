import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps { children: ReactNode }
interface ErrorBoundaryState { hasError: boolean }

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private handleReload = (): void => window.location.reload();

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="card mx-auto max-w-lg animate-fade-up p-10 text-center" role="alert">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-danger/12 text-3xl text-danger">!</span>
        <h1 className="mt-5 font-display text-2xl font-bold">Something went wrong.</h1>
        <p className="mt-2 text-sm text-muted">
          An unexpected error interrupted this page. Your cart and orders are safe in local storage.
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          className="tap mt-6 rounded-xl bg-brand px-7 font-semibold text-white transition hover:bg-brand-deep active:scale-[0.98]"
        >
          Reload
        </button>
      </div>
    );
  }
}