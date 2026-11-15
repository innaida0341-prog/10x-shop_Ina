import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactElement } from "react";
import { Link, Navigate } from "react-router-dom";
import { CartSummary } from "@/components/cart/CartSummary";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { AddressBook } from "@/components/checkout/AddressBook";
import { FormField } from "@/components/ui/FormField";
import { Panel } from "@/components/ui/Panel";
import { Checkbox } from "@/components/ui/Checkbox";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { OrderModel } from "@/models/Order";
import { addressesStorage, ordersStorage } from "@/models/storage";
import { COUNTRIES, TOAST } from "@/utils/constants";
import { createId } from "@/utils/id";
import { formatPrice } from "@/utils/format";
import { hasErrors, validateCheckout } from "@/utils/validation";
import type { FieldErrors } from "@/utils/validation";
import type { Address } from "@/types/bonus";
import type { CheckoutFormValues, Order } from "@/types/order";

const STEPS = ["Contact", "Shipping", "Review"] as const;
const STEP_FIELDS: (keyof CheckoutFormValues)[][] = [
  ["fullName", "email", "phone"],
  ["address", "city", "postalCode", "country"],
  [],
];

function pickErrors(errors: FieldErrors<CheckoutFormValues>, fields: (keyof CheckoutFormValues)[]): FieldErrors<CheckoutFormValues> {
  const scoped: FieldErrors<CheckoutFormValues> = {};
  fields.forEach((field) => {
    const message = errors[field];
    if (message !== undefined) scoped[field] = message;
  });
  return scoped;
}

export default function CheckoutPage(): ReactElement {
  useDocumentTitle("Checkout");
  const { state, cart, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const saved = useMemo(() => addressesStorage.get() ?? [], []);
  const preferred = saved.find((entry) => entry.isDefault) ?? saved[0] ?? null;

  const [values, setValues] = useState<CheckoutFormValues>({
    fullName: preferred?.fullName ?? `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    phone: preferred?.phone ?? user.phone,
    address: preferred?.address ?? "",
    city: preferred?.city ?? "",
    postalCode: preferred?.postalCode ?? "",
    country: preferred?.country ?? "Georgia",
  });
  const [selectedAddress, setSelectedAddress] = useState<string | null>(preferred?.id ?? null);
  const [saveAddress, setSaveAddress] = useState(false);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors<CheckoutFormValues>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Order | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);

  if (state.items.length === 0 && placed === null) {
    return <Navigate to="/cart" replace state={{ reason: "Your cart is empty. Add products before checkout." }} />;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const useAddress = (address: Address): void => {
    setValues((current) => ({
      ...current,
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
    }));
    setSelectedAddress(address.id);
    setErrors({});
    toast.info(`Using "${address.label}"`);
  };

  const goNext = (): void => {
    const scoped = pickErrors(validateCheckout(values), STEP_FIELDS[step]);
    setErrors(scoped);
    if (hasErrors(scoped)) return;
    setStep((current) => Math.min(STEPS.length - 1, current + 1));
  };

  const jumpTo = (index: number): void => {
    if (index <= step) setStep(index);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const nextErrors = validateCheckout(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const firstBad = STEP_FIELDS.findIndex((fields) => hasErrors(pickErrors(nextErrors, fields)));
      setStep(firstBad === -1 ? STEPS.length - 1 : firstBad);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    timer.current = window.setTimeout(() => {
      try {
        const orders = ordersStorage.get() ?? [];
        const shipping: CheckoutFormValues = {
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
          postalCode: values.postalCode.trim(),
          country: values.country,
        };
        const order = OrderModel.create(cart, state.items, shipping, orders.length + 1);
        ordersStorage.set([order.toJSON(), ...orders]);

        if (saveAddress && selectedAddress === null) {
          const list = addressesStorage.get() ?? [];
          addressesStorage.set([
            {
              id: createId("addr"),
              label: `${shipping.city} address`,
              fullName: shipping.fullName,
              phone: shipping.phone,
              address: shipping.address,
              city: shipping.city,
              postalCode: shipping.postalCode,
              country: shipping.country,
              isDefault: list.length === 0,
            },
            ...list,
          ]);
          toast.success(TOAST.addressSaved);
        }

        setPlaced(order.toJSON());
        clearCart();
      } catch {
        setSubmitError("We could not place your order. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }, 550);
  };

  if (placed !== null) {
    return (
      <div className="mx-auto max-w-2xl animate-fade-up">
        <Panel>
          <div className="text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-success/15 text-3xl text-success">✓</span>
            <h1 className="mt-5 font-display text-2xl font-bold">Thank you! Your order has been placed.</h1>
            <p className="mt-2 text-sm text-muted">Order <b className="text-text">#{placed.number}</b></p>
          </div>

          <dl className="mt-6 flex flex-col gap-2 border-t border-border pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-semibold">{formatPrice(placed.subtotal)}</dd></div>
            {placed.discount > 0 && (
              <div className="flex justify-between text-success"><dt>Discount</dt><dd className="font-semibold">−{formatPrice(placed.discount)}</dd></div>
            )}
            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="font-semibold">{placed.shippingCost === 0 ? "Free" : formatPrice(placed.shippingCost)}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 font-display text-lg font-bold"><dt>Total</dt><dd>{formatPrice(placed.total)}</dd></div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/orders/${placed.id}`} state={{ justPlaced: true }} className="tap grid flex-1 place-items-center rounded-xl bg-brand px-5 font-semibold text-white transition hocus:bg-brand-deep">
              View order
            </Link>
            <Link to={`/orders/${placed.id}/invoice`} className="tap grid flex-1 place-items-center rounded-xl border border-brand px-5 font-semibold text-brand transition hocus:bg-brand hocus:text-white">
              🧾 Invoice
            </Link>
            <Link to="/" className="tap grid flex-1 place-items-center rounded-xl border border-border px-5 font-semibold transition hocus:border-brand hocus:text-brand">
              Keep shopping
            </Link>
          </div>
        </Panel>
      </div>
    );
  }

  const field = (name: keyof CheckoutFormValues, label: string, type = "text", placeholder = ""): ReactElement => (
    <FormField id={`checkout-${name}`} label={label} error={errors[name]}>
      <input
        id={`checkout-${name}`}
        name={name}
        type={type}
        value={values[name]}
        onChange={handleChange}
        placeholder={placeholder}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `checkout-${name}-error` : undefined}
        className="field"
      />
    </FormField>
  );

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Checkout</h1>
        <p className="mt-1 text-sm text-muted">Three short steps. Demo only — no payment data is collected.</p>
      </header>

      <CheckoutSteps steps={STEPS} current={step} onJump={jumpTo} />

      <div className="grid gap-6 min-[901px]:grid-cols-[1.7fr_1fr]">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          {step === 0 && (
            <Panel title="Contact details">
              <div className="grid gap-4 sm:grid-cols-2">
                {field("fullName", "Full name", "text", "Nino Beridze")}
                {field("email", "Email", "email", "you@example.com")}
                {field("phone", "Phone", "tel", "+995 555 12 34 56")}
              </div>
            </Panel>
          )}

          {step === 1 && (
            <>
              <Panel title="Saved addresses">
                <AddressBook mode="select" selectedId={selectedAddress} onSelect={useAddress} />
              </Panel>
              <Panel title="Shipping address">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">{field("address", "Address", "text", "12 Rustaveli Avenue, Apt 4")}</div>
                  {field("city", "City", "text", "Tbilisi")}
                  {field("postalCode", "Postal code", "text", "0108")}
                  <FormField id="checkout-country" label="Country" error={errors.country}>
                    <select
                      id="checkout-country"
                      name="country"
                      value={values.country}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.country)}
                      className="field cursor-pointer"
                    >
                      {COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
                    </select>
                  </FormField>
                  <div className="sm:col-span-2">
                    <Checkbox checked={saveAddress} onChange={setSaveAddress} label="Save this address for next time" />
                  </div>
                </div>
              </Panel>
            </>
          )}

          {step === 2 && (
            <Panel title="Review and place order">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface-2 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Contact</h3>
                  <p className="mt-2 text-sm leading-relaxed">
                    <b>{values.fullName}</b><br />{values.email}<br />{values.phone}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-surface-2 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Ship to</h3>
                  <p className="mt-2 text-sm leading-relaxed">
                    {values.address}<br />{values.city}, {values.postalCode}<br />{values.country}
                  </p>
                </div>
              </div>

              <ul className="mt-4 flex flex-col divide-y divide-border">
                {state.items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-3 py-2.5 text-sm">
                    <img src={item.thumbnail} alt="" loading="lazy" width={40} height={40} className="size-10 rounded-lg bg-surface-2 object-contain" />
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                    <span className="text-muted">×{item.quantity}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 rounded-xl bg-brand-soft px-3 py-2 text-xs font-medium text-brand">
                Payment: cash on delivery (demo). No card fields exist in this project.
              </p>
            </Panel>
          )}

          {submitError && (
            <p role="alert" className="card border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">{submitError}</p>
          )}

          <div className="flex flex-wrap gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                className="tap rounded-xl border border-border px-6 font-semibold transition hocus:border-brand hocus:text-brand"
              >
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="tap flex-1 rounded-xl bg-brand py-3 font-display font-bold text-white transition hocus:bg-brand-deep active:scale-[0.99]"
              >
                Continue to {STEPS[step + 1]} →
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="tap flex-1 rounded-xl bg-brand py-3 font-display font-bold text-white transition hocus:bg-brand-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Placing order…" : `Place order · ${formatPrice(cart.total())}`}
              </button>
            )}
          </div>
        </form>

        <CartSummary cart={cart} />
      </div>
    </div>
  );
}