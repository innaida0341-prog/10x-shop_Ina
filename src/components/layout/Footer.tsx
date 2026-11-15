import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export function Footer(): ReactElement {
  return (
    <footer className="mt-16 border-t border-border bg-surface/60">
      <div className="mx-auto grid w-full max-w-1400px gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-lg font-bold">10X Shop</span>
          <p className="mt-2 max-w-xs text-sm text-muted">
            A resilient storefront demo — React 19, strict TypeScript and Tailwind CSS v4 over the DummyJSON catalog.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link to="/" className="transition hover:text-brand">Catalog</Link></li>
            <li><Link to="/cart" className="transition hover:text-brand">Cart</Link></li>
            <li><Link to="/orders" className="transition hover:text-brand">Orders</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold">Account</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link to="/login" className="transition hover:text-brand">Log in</Link></li>
            <li><Link to="/profile" className="transition hover:text-brand">Profile</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold">Good to know</h3>
          <p className="mt-3 text-sm text-muted">
            Free shipping over $100. Use code <span className="font-bold text-brand">10X10</span> for 10% off.
            Demo checkout — no real payment is processed.
          </p>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} 10X Shop · Graduation project · Data by DummyJSON
      </div>
    </footer>
  );
}