import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import type { ToastOptions } from "@/types/bonus";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
  action?: ToastOptions["action"];
}

interface ToastContextValue {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "border-success/45 bg-success/12 text-success",
  error: "border-danger/45 bg-danger/12 text-danger",
  info: "border-info/45 bg-info/12 text-info",
};

const VARIANT_ICON: Record<ToastVariant, string> = { success: "✓", error: "!", info: "i" };

export function ToastProvider({ children }: { children: ReactNode }): ReactElement {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<number, number>>(new Map());
  const nextId = useRef(0);

  const dismiss = useCallback((id: number): void => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message: string, variant: ToastVariant, options?: ToastOptions): void => {
      nextId.current += 1;
      const id = nextId.current;
      const item: ToastItem = { id, message, variant };
      if (options?.action) item.action = options.action;
      setToasts((current) => [...current.slice(-3), item]);
      const duration = options?.duration ?? (options?.action ? 6500 : 3400);
      timers.current.set(id, window.setTimeout(() => dismiss(id), duration));
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((timer) => window.clearTimeout(timer));
      map.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message, options) => push(message, "success", options),
      error: (message, options) => push(message, "error", options),
      info: (message, options) => push(message, "info", options),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-5 right-4 z-100 flex w-[min(23rem,calc(100vw-2rem))] flex-col gap-2.5"
        role="status"
        aria-live="polite"
        data-print="hide"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`glass pointer-events-auto flex animate-pop items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)] ${VARIANT_STYLES[toast.variant]}`}
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-xs font-bold">
              {VARIANT_ICON[toast.variant]}
            </span>
            <p className="flex-1 text-sm font-medium text-text">{toast.message}</p>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  dismiss(toast.id);
                }}
                className="shrink-0 rounded-lg border border-current px-2.5 py-1 text-xs font-bold uppercase tracking-wide transition hover:bg-current/15"
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="grid size-7 shrink-0 place-items-center rounded-full text-muted transition hover:bg-border/60 hover:text-text"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider.");
  return context;
}