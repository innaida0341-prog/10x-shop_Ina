import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactElement } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/context/ToastContext";
import { isAddressList } from "@/utils/guards";
import { createId } from "@/utils/id";
import { COUNTRIES, TOAST } from "@/utils/constants";
import { hasErrors, isPhone } from "@/utils/validation";
import type { FieldErrors } from "@/utils/validation";
import type { Address, AddressDraft } from "@/types/bonus";

interface AddressBookProps {
  mode: "select" | "manage";
  selectedId?: string | null;
  onSelect?: (address: Address) => void;
}

const EMPTY_DRAFT: AddressDraft = {
  label: "",
  fullName: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "Georgia",
};

function validateDraft(draft: AddressDraft): FieldErrors<AddressDraft> {
  const errors: FieldErrors<AddressDraft> = {};
  if (draft.label.trim().length < 2) errors.label = "Label must be at least 2 characters";
  if (draft.fullName.trim().length < 3) errors.fullName = "Full name must be at least 3 characters";
  if (!isPhone(draft.phone)) errors.phone = "Please enter a valid phone number";
  if (draft.address.trim().length < 5) errors.address = "Address must be at least 5 characters";
  if (draft.city.trim().length === 0) errors.city = "City is required";
  if (!/^\d{4,10}$/.test(draft.postalCode.trim())) errors.postalCode = "Postal code must be 4-10 digits";
  if (draft.country.trim().length === 0) errors.country = "Please select a country";
  return errors;
}

export function AddressBook({ mode, selectedId = null, onSelect }: AddressBookProps): ReactElement {
  const toast = useToast();
  const [addresses, setAddresses] = useLocalStorage<Address[]>("shop_addresses", [], isAddressList);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<AddressDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<FieldErrors<AddressDraft>>({});

  const openNew = (): void => {
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setEditing("new");
  };

  const openEdit = (address: Address): void => {
    setDraft({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
    });
    setErrors({});
    setEditing(address.id);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    const clean: AddressDraft = {
      label: draft.label.trim(),
      fullName: draft.fullName.trim(),
      phone: draft.phone.trim(),
      address: draft.address.trim(),
      city: draft.city.trim(),
      postalCode: draft.postalCode.trim(),
      country: draft.country,
    };

    if (editing === "new") {
      const created: Address = { ...clean, id: createId("addr"), isDefault: addresses.length === 0 };
      const next = [created, ...addresses];
      setAddresses(next);
      if (mode === "select") onSelect?.(created);
    } else if (typeof editing === "string") {
      setAddresses(addresses.map((entry) => (entry.id === editing ? { ...entry, ...clean } : entry)));
    }

    setEditing(null);
    setDraft(EMPTY_DRAFT);
    toast.success(TOAST.addressSaved);
  };

  const handleDelete = (id: string): void => {
    const target = addresses.find((entry) => entry.id === id);
    if (!target) return;
    const remaining = addresses.filter((entry) => entry.id !== id);
    setAddresses(
      remaining.length > 0 && !remaining.some((entry) => entry.isDefault)
        ? remaining.map((entry, index) => ({ ...entry, isDefault: index === 0 }))
        : remaining,
    );
    toast.info(TOAST.addressRemoved, {
      action: { label: "Undo", onClick: () => setAddresses([target, ...(addresses.filter((e) => e.id !== id))]) },
    });
  };

  const makeDefault = (id: string): void => {
    setAddresses(addresses.map((entry) => ({ ...entry, isDefault: entry.id === id })));
  };

  const field = (name: keyof AddressDraft, label: string, type = "text"): ReactElement => (
    <FormField id={`addr-${name}`} label={label} error={errors[name]}>
      <input
        id={`addr-${name}`}
        name={name}
        type={type}
        value={draft[name]}
        onChange={handleChange}
        aria-invalid={Boolean(errors[name])}
        className="field"
      />
    </FormField>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-muted">Address book</h3>
        {editing === null && (
          <button
            type="button"
            onClick={openNew}
            className="tap rounded-xl border border-brand px-4 text-sm font-semibold text-brand transition hocus:bg-brand hocus:text-white"
          >
            + New address
          </button>
        )}
      </div>

      {addresses.length === 0 && editing === null && (
        <p className="rounded-xl border border-dashed border-border bg-surface-2 px-4 py-3 text-sm text-muted">
          No saved addresses yet. Add one to reuse it at checkout.
        </p>
      )}

      {addresses.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {addresses.map((entry) => {
            const picked = mode === "select" && selectedId === entry.id;
            return (
              <li
                key={entry.id}
                data-picked={picked}
                className="rounded-2xl border border-border bg-surface-2 p-4 transition picked:border-brand picked:bg-brand-soft"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-display text-sm font-bold">{entry.label}</span>
                  {entry.isDefault && (
                    <span className="rounded-full bg-save/15 px-2 py-0.5 text-[11px] font-bold text-save">Default</span>
                  )}
                </div>
                <address className="mt-1.5 text-xs not-italic leading-relaxed text-muted">
                  {entry.fullName}<br />
                  {entry.address}<br />
                  {entry.city}, {entry.postalCode}<br />
                  {entry.country} · {entry.phone}
                </address>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {mode === "select" && (
                    <button
                      type="button"
                      onClick={() => onSelect?.(entry)}
                      className="min-h-9 rounded-lg bg-brand px-3 text-xs font-bold text-white transition hocus:bg-brand-deep"
                    >
                      {picked ? "Using ✓" : "Use this"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openEdit(entry)}
                    className="min-h-9 rounded-lg border border-border px-3 text-xs font-semibold transition hocus:border-brand hocus:text-brand"
                  >
                    Edit
                  </button>
                  {!entry.isDefault && (
                    <button
                      type="button"
                      onClick={() => makeDefault(entry.id)}
                      className="min-h-9 rounded-lg border border-border px-3 text-xs font-semibold transition hocus:border-save hocus:text-save"
                    >
                      Set default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="min-h-9 rounded-lg border border-border px-3 text-xs font-semibold transition hocus:border-danger hocus:text-danger"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing !== null && (
        <form onSubmit={handleSubmit} noValidate className="animate-slide-up rounded-2xl border border-brand/40 bg-brand-soft/40 p-4">
          <h4 className="font-display text-base font-bold">{editing === "new" ? "New address" : "Edit address"}</h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {field("label", "Label")}
            {field("fullName", "Full name")}
            {field("phone", "Phone", "tel")}
            <FormField id="addr-country" label="Country" error={errors.country}>
              <select id="addr-country" name="country" value={draft.country} onChange={handleChange} className="field cursor-pointer">
                {COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
              </select>
            </FormField>
            <div className="sm:col-span-2">{field("address", "Street address")}</div>
            {field("city", "City")}
            {field("postalCode", "Postal code")}
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="tap rounded-xl bg-brand px-6 font-semibold text-white transition hocus:bg-brand-deep">
              Save address
            </button>
            <button
              type="button"
              onClick={() => { setEditing(null); setErrors({}); }}
              className="tap rounded-xl border border-border px-5 font-semibold transition hocus:border-danger hocus:text-danger"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {mode === "manage" && addresses.length > 1 && (
        <Checkbox
          checked={addresses.some((entry) => entry.isDefault)}
          onChange={() => makeDefault(addresses[0].id)}
          label={`First address (${addresses[0].label}) is a quick default`}
        />
      )}
    </div>
  );
}