# 10X Shop

A single-page storefront built with React 19, strict TypeScript and Tailwind CSS v4 on top of the public DummyJSON product API. It covers the full shopping loop — browse, inspect, add to cart, authenticate locally, check out and track the order — and stays usable on slow networks, small screens and corrupted local storage.

## Features

### CORE
- Local `AuthContext` login/logout with controlled form and guarded `/checkout`
- Catalog loaded from `GET /products` with loading / error / empty states
- `ProductCard` + `ProductGrid` with `map()` and stable keys, responsive 1 → 2 → 3 → 4 columns
- Product details via `useParams` + `GET /products/:id`, gallery, quantity stepper, stock states
- Cart context with immutable updates: add, set quantity, remove, clear, totals, header badge
- Checkout controlled form with field-level validation and a local "Thank you" confirmation
- Shared Layout, `NavLink` active state, ScrollToTop, 404 route, ErrorBoundary
- Responsive at 375 px with no horizontal scroll, hover / focus / disabled states

### FULL
- Debounced search (400 ms), category filter, 5 sort options, pagination — all four params live in the URL
- `AbortController` cancels stale requests; client-side sort fallback for endpoints that ignore `sortBy`
- Reviews with local persistence (`shop_reviews`), average rating via `useMemo`
- Related products reusing the exact same `ProductCard`
- Promo code `10X10` (case-insensitive) with free-shipping threshold
- Orders list + details, time-derived status (Processing → Shipped → Delivered), 30 s tick, Reorder
- Profile editing, theme switch, clear-local-data
- Dark mode via `data-theme` + `@theme` tokens, toast framework with undo actions
- Generic `ApiClient`, `ApiError`, `Cart`, `OrderModel`, `StorageService<T>`, runtime type guards
- Route-level code splitting, lazy images with intrinsic size, measured memoisation
- Login form extended with Formik + Yup validation schema

### BONUS
- Wishlist with bulk selection, add-to-cart, undo and sort
- Price range dual-slider filter applied to loaded products
- Saved views: store and reapply a full filter set from the URL
- Quick-view drawer with focus trap, ESC close and scroll lock
- Multi-step checkout (Contact → Shipping → Review) with per-step validation
- Address book: create, edit, delete, set default, reuse at checkout
- Printable invoice route + standalone HTML download (no PDF library)
- Import demo order history from `GET /carts/user/{id}`
- Advanced Tailwind: container queries, custom variants (`hocus`, `picked`, `busy`), scroll-driven reveal

## Tech Stack

Vite · React 19 · TypeScript (strict) · React Router 7 · Tailwind CSS v4 (`@tailwindcss/vite`) · Formik · Yup · DummyJSON

## Architecture
src/
api/ ApiClient, ApiError, endpoint builders
types/ single source of truth for every domain model
models/ Cart, OrderModel, StorageService<T> — business logic without UI
utils/ pure helpers: format, url, sort, validation, guards, orderStatus
hooks/ useFetch, useDebounce, useLocalStorage, useNow, useDocumentTitle,
useIntersection, useInfiniteProducts
context/ Theme, Toast, Auth, Cart (+ pure cart reducer), Wishlist
components/ layout / ui / catalog / product / cart / checkout / orders, ErrorBoundary
pages/ one file per route, composing reusable components
routes/ AppRoutes (lazy) + ProtectedRoute

**Data flow.** A user action calls an event handler → the handler dispatches a cart action or updates context state → the reducer returns a new immutable state → React re-renders consumers. Server data is fetched inside `useFetch`'s effect, modelled as an `AsyncState<T>` discriminated union and rendered through conditional rendering; the effect's cleanup aborts the in-flight request. Filter state lives in the URL, so refresh, Back/Forward and shared links reproduce the exact view. Local persistence goes through `StorageService<T>`, which validates parsed JSON with type guards before it reaches the app.

## How to Run

```bash
npm install
npm run dev        # http://localhost:5173

Scripts
Script|Purpose
npm run dev |Vite dev server
npm run build|tsc --noEmit then production build
npm run preview |Serve the production build locally
npm run typecheck|"Strict TypeScript check, must be 0 errors"
npm run lint|ESLint with typescript-eslint + react-hooks

Live Demo
Deployed on Vercel: https://10x-shop-ina.vercel.app
vercel.json contains the SPA rewrite so /products/5 opens and refreshes correctly. Netlify users get the same behaviour from public/_redirects.
Test Account
Authentication is a local simulation — no credentials are sent anywhere.
Any non-empty username plus a password of at least 6 characters works, e.g. emilys / emilyspass.
Promo & Shipping
Use 10X10 at the cart for 10% off. Shipping is free from $100, otherwise $10.
Credits
Product data: DummyJSON. Fonts: Space Grotesk & Inter (Google Fonts).
Built as the 10X Front-end graduation project. AI tools were used as a pair-programming assistant; see REPORT.md for what was delegated, reviewed and rewritten.