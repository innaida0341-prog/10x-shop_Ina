import type { ReactElement } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  indeterminate?: boolean;
}

export function Checkbox({ checked, onChange, label, indeterminate = false }: CheckboxProps): ReactElement {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-sm font-medium">
      <span className="relative grid size-5 shrink-0 place-items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-label={label}
          className="peer size-5 cursor-pointer appearance-none rounded-md border border-border bg-surface-2 transition checked:border-brand checked:bg-brand indeterminate:border-brand indeterminate:bg-brand hocus:border-brand"
          ref={(node) => {
            if (node) node.indeterminate = indeterminate;
          }}
        />
        <span className="pointer-events-none absolute text-[11px] font-bold text-white opacity-0 transition peer-checked:opacity-100">
          ✓
        </span>
        {indeterminate && !checked && (
          <span className="pointer-events-none absolute text-[13px] font-bold leading-none text-white">−</span>
        )}
      </span>
      <span>{label}</span>
    </label>
  );
}