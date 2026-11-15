import { useState } from "react";
import type { FormEvent, ReactElement } from "react";

interface PromoFormProps {
  onApply: (code: string) => boolean;
}

export function PromoForm({ onApply }: PromoFormProps): ReactElement {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (onApply(code)) {
      setCode("");
      setError(null);
    } else {
      setError("Invalid promo code");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4">
      <label htmlFor="promo-code" className="text-sm font-semibold">Promo code</label>
      <div className="mt-1.5 flex gap-2">
        <input
          id="promo-code"
          value={code}
          onChange={(event) => { setCode(event.target.value); setError(null); }}
          placeholder="10X10"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "promo-code-error" : undefined}
          className="field flex-1 uppercase"
        />
        <button
          type="submit"
          className="tap shrink-0 rounded-xl border border-brand px-5 font-semibold text-brand transition hover:bg-brand hover:text-white"
        >
          Apply
        </button>
      </div>
      {error && <p id="promo-code-error" role="alert" className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </form>
  );
}