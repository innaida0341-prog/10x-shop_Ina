import type { ReactElement } from "react";

interface CheckoutStepsProps {
  steps: readonly string[];
  current: number;
  onJump: (index: number) => void;
}

export function CheckoutSteps({ steps, current, onJump }: CheckoutStepsProps): ReactElement {
  return (
    <nav aria-label="Checkout progress" className="card p-4">
      <ol className="flex flex-wrap items-center gap-2">
        {steps.map((label, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={label} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onJump(index)}
                disabled={index > current}
                aria-current={active ? "step" : undefined}
                className={`tap flex items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${
                  active
                    ? "border-brand bg-brand text-white"
                    : done
                      ? "border-success/45 bg-success/10 text-success hocus:border-success"
                      : "border-border bg-surface-2 text-muted"
                }`}
              >
                <span className="grid size-5 place-items-center rounded-full border border-current text-[11px]">
                  {done ? "✓" : index + 1}
                </span>
                {label}
              </button>
              {index < steps.length - 1 && <span aria-hidden className="text-muted">→</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}