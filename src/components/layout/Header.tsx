import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useWishlist } from "@/context/WishlistContext";

const linkBase = "tap inline-flex items-center rounded-xl px-3.5 text-sm font-semibold transition";
const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `${linkBase} ${isActive ? "bg-brand text-white shadow-[0_10px_24px_-14px_var(--color-brand)]" : "text-muted hocus:bg-brand-soft hocus:text-brand"}`;

export function Header(): ReactElement {
  const { isLoggedIn, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = (): void => { logout(); navigate("/"); };

  const nav = (
    <>
      <NavLink to="/" className={linkClass} end>Catalog</NavLink>
      <NavLink to="/wishlist" className={linkClass}>
        Wishlist
        {wishCount > 0 && (
          <span className="ml-2 grid min-w-5 place-items-center rounded-full bg-wish px-1.5 text-[11px] font-bold text-white">{wishCount}</span>
        )}
      </NavLink>
      <NavLink to="/cart" className={linkClass}>
        Cart
        {itemCount > 0 && (
          <span className="ml-2 grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">{itemCount}</span>
        )}
      </NavLink>
      {isLoggedIn && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
      {isLoggedIn && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
    </>
  );

  return (
    <header className="glass sticky top-0 z-50 border-b border-border" data-print="hide">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-3 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="10X Shop home">
          <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-brand to-wish font-display text-sm font-bold text-white">10X</span>
          <span className="hidden font-display text-lg font-bold min-[481px]:inline">10X Shop</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 min-[961px]:flex" aria-label="Main">{nav}</nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishCount} items`}
            className="tap relative grid place-items-center rounded-xl border border-border bg-surface-2 text-lg transition hocus:border-wish hocus:text-wish min-[961px]:hidden"
          >
            ♥
            {wishCount > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-wish px-1 text-[10px] font-bold text-white">{wishCount}</span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            className="tap grid place-items-center rounded-xl border border-border bg-surface-2 text-lg transition hocus:border-brand hocus:text-brand"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {isLoggedIn ? (
            <div className="hidden items-center gap-2 min-[961px]:flex">
              <span className="max-w-28 truncate text-sm font-semibold text-muted">{user.firstName || user.username}</span>
              <button type="button" onClick={handleLogout} className="tap rounded-xl border border-border px-4 text-sm font-semibold transition hocus:border-danger hocus:text-danger">
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="tap hidden place-items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hocus:bg-brand-deep min-[961px]:grid">
              Log in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
            className="tap grid place-items-center rounded-xl border border-border bg-surface-2 min-[961px]:hidden"
          >
            <span className="flex flex-col gap-1">
              <span className={`block h-0.5 w-5 bg-current transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-current transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="animate-fade-up border-t border-border px-4 pb-4 pt-3 min-[961px]:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1.5">{nav}</div>
          <div className="mt-3 border-t border-border pt-3">
            {isLoggedIn ? (
              <button type="button" onClick={handleLogout} className="tap w-full rounded-xl border border-border text-sm font-semibold transition hocus:border-danger hocus:text-danger">
                Log out ({user.firstName || user.username})
              </button>
            ) : (
              <Link to="/login" className="tap grid w-full place-items-center rounded-xl bg-brand text-sm font-semibold text-white">Log in</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}