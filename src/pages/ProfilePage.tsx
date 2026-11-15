import { useCallback, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent, ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormField } from "@/components/ui/FormField";
import { Panel } from "@/components/ui/Panel";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  addressesStorage,
  ordersStorage,
  prefsStorage,
  reviewsStorage,
  searchHistoryStorage,
  viewsStorage,
} from "@/models/storage";
import { TOAST } from "@/utils/constants";
import { hasErrors, validateProfile } from "@/utils/validation";
import type { FieldErrors } from "@/utils/validation";
import type { ProfileForm } from "@/types/user";

interface StatTileProps {
  to: string;
  label: string;
  value: number;
  icon: string;
  tone: "brand" | "wish" | "save";
}

const TONE: Record<StatTileProps["tone"], string> = {
  brand: "border-brand/35 bg-brand-soft text-brand",
  wish: "border-wish/35 bg-wish-soft text-wish",
  save: "border-save/35 bg-save/10 text-save",
};

function StatTile({ to, label, value, icon, tone }: StatTileProps): ReactElement {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition hocus:-translate-y-0.5 hocus:shadow-[0_16px_32px_-24px_currentColor] ${TONE[tone]}`}
    >
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface/70 text-lg">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-xl font-bold leading-none tabular-nums">{value}</span>
        <span className="mt-1 block truncate text-xs font-semibold text-muted">{label}</span>
      </span>
    </Link>
  );
}

/** Intentional render failure used to demonstrate the ErrorBoundary fallback in development. */
function CrashTrigger(): never {
  throw new Error("Intentional render error — ErrorBoundary demo.");
}

export default function ProfilePage(): ReactElement {
  useDocumentTitle("Profile");

  const { user, logout, updateProfile } = useAuth();
  const { clearCart } = useCart();
  const { count: wishCount, clear: clearWishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState<ProfileForm>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  });
  const [errors, setErrors] = useState<FieldErrors<ProfileForm>>({});
  const [orderCount, setOrderCount] = useState<number>(() => ordersStorage.get()?.length ?? 0);
  const [addressCount, setAddressCount] = useState<number>(() => addressesStorage.get()?.length ?? 0);
  const [crash, setCrash] = useState(false);

  const refreshAddressCount = useCallback((): void => {
    setAddressCount(addressesStorage.get()?.length ?? 0);
  }, []);

  const displayName = useMemo(() => {
    const full = `${user.firstName} ${user.lastName}`.trim();
    return full === "" ? user.username : full;
  }, [user.firstName, user.lastName, user.username]);

  const initial = (user.firstName || user.username || "G").charAt(0).toUpperCase();

  if (crash) return <CrashTrigger />;

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const nextErrors = validateProfile(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    updateProfile({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    });
    toast.success(TOAST.profileSaved);
  };

  const handleClearData = (): void => {
    if (
      !window.confirm(
        "Clear cart, orders, reviews, wishlist, addresses and saved views? Your session and theme will be kept.",
      )
    ) {
      return;
    }

    clearCart();
    clearWishlist();

    ordersStorage.remove();
    reviewsStorage.remove();
    addressesStorage.remove();
    viewsStorage.remove();
    searchHistoryStorage.remove();
    prefsStorage.remove();

    setOrderCount(0);
    setAddressCount(0);
    toast.info(TOAST.dataCleared);
  };

  const handleLogout = (): void => {
    logout();
    navigate("/");
  };

  const field = (
    name: keyof ProfileForm,
    label: string,
    type = "text",
    autoComplete = "off",
    hint?: string,
  ): ReactElement => (
    <FormField id={`profile-${name}`} label={label} error={errors[name]} hint={hint}>
      <input
        id={`profile-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={values[name]}
        onChange={handleChange}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `profile-${name}-error` : undefined}
        className="field"
      />
    </FormField>
  );

  return (
    <div className="flex animate-fade-up flex-col gap-6">
      <header className="card relative overflow-hidden p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-14 -top-16 size-56 rounded-full opacity-40 blur-3xl"
          style={{ background: "linear-gradient(135deg, var(--color-brand), var(--color-wish))" }}
        />

        <div className="relative flex flex-wrap items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-brand to-wish font-display text-2xl font-bold text-white">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-2xl font-bold">{displayName}</h1>
            <p className="mt-0.5 text-sm text-muted">
              @{user.username} · Signed in locally · {orderCount} order{orderCount === 1 ? "" : "s"}
            </p>
          </div>
          <Link
            to="/orders"
            className="tap inline-flex items-center rounded-xl border border-border px-4 text-sm font-semibold transition hocus:border-brand hocus:text-brand"
          >
            View orders →
          </Link>
        </div>

        <div className="relative mt-5 grid gap-3 min-[481px]:grid-cols-3">
          <StatTile to="/orders" label="Orders placed" value={orderCount} icon="📦" tone="brand" />
          <StatTile to="/wishlist" label="Wishlist items" value={wishCount} icon="♥" tone="wish" />
          <StatTile to="/addresses" label="Saved addresses" value={addressCount} icon="📍" tone="save" />
        </div>
      </header>

      <div className="grid gap-6 min-[901px]:grid-cols-[1.6fr_1fr]">
        <Panel title="Edit profile">
          <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
            {field("firstName", "First name", "text", "given-name")}
            {field("lastName", "Last name", "text", "family-name")}
            {field("email", "Email", "email", "email")}
            {field("phone", "Phone", "tel", "tel", "Optional — 9 to 15 digits when provided.")}

            <p className="text-xs leading-relaxed text-muted sm:col-span-2">
              Changes are stored in React state only. No profile data is sent to a server, and refreshing the page
              returns the session to its default guest values.
            </p>

            <button
              type="submit"
              className="tap rounded-xl bg-brand font-semibold text-white transition hocus:bg-brand-deep active:scale-[0.99] sm:col-span-2"
            >
              Save changes
            </button>
          </form>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Appearance">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">
                Current theme: <b className="capitalize text-text">{theme}</b>
              </p>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
                className="tap rounded-xl border border-border px-5 text-sm font-semibold transition hocus:border-brand hocus:text-brand"
              >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>
            <p className="mt-3 text-xs text-muted">
              Shared with the header switch — one ThemeContext, persisted in <code className="text-brand">shop_theme</code>.
            </p>
          </Panel>

          <Panel title="Shortcuts">
            <div className="flex flex-col gap-3">
              <Link
                to="/addresses"
                onClick={refreshAddressCount}
                className="tap grid place-items-center rounded-xl border border-brand px-5 text-sm font-semibold text-brand transition hocus:bg-brand hocus:text-white"
              >
                📍 Address book
              </Link>
              <Link
                to="/wishlist"
                className="tap grid place-items-center rounded-xl border border-wish px-5 text-sm font-semibold text-wish transition hocus:bg-wish hocus:text-white"
              >
                ♥ Wishlist
              </Link>
              <Link
                to="/orders"
                className="tap grid place-items-center rounded-xl border border-border px-5 text-sm font-semibold transition hocus:border-brand hocus:text-brand"
              >
                📦 Order history
              </Link>
            </div>
          </Panel>

          <Panel title="Account">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleClearData}
                className="tap rounded-xl border border-warning/50 px-5 text-sm font-semibold text-warning transition hocus:bg-warning/10"
              >
                Clear local data
              </button>
              <p className="-mt-1 text-xs leading-relaxed text-muted">
                Removes cart, orders, reviews, wishlist, addresses, saved views and search history. Your session and
                theme are kept.
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="tap rounded-xl border border-danger/50 px-5 text-sm font-semibold text-danger transition hocus:bg-danger/10"
              >
                Log out
              </button>

              {import.meta.env.DEV && (
                <button
                  type="button"
                  onClick={() => setCrash(true)}
                  className="tap rounded-xl border border-dashed border-border px-5 text-xs font-semibold text-muted transition hocus:border-brand hocus:text-brand"
                >
                  DEV: trigger ErrorBoundary
                </button>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}