# Progress — Phase 1 (Foundation)

## Done
- Vite + React 19 + strict TypeScript, path alias, ESLint (`no-explicit-any: error`), five scripts
- Tailwind CSS v4 through `@tailwindcss/vite`, `@theme` tokens, dark-mode variant, custom utilities
- Domain types, pure utils (format, url, sort, validation, guards), `ApiClient`, `ApiError`,
  `StorageService<T>` and its instances
- `useFetch<T>` with `AsyncState<T>` and `AbortController`, `useDebounce`, `useLocalStorage`, `useNow`
- Layout / Header / Footer / ScrollToTop, route table, 404, ErrorBoundary
- AuthContext, ProtectedRoute, Login (Formik + Yup), Toast framework
- Catalog with loading / error / empty states, ProductCard + ProductGrid
- First deploy with SPA rewrite

## Next
Product details, cart reducer and provider, cart page, checkout and the local order confirmation.

## Blockers
None. DummyJSON category endpoint requires `slug`, not `name` — recorded in DEBUG-LOG.

## Hours
Setup 2 · Domain 2.5 · Data 2.5 · Shell 3 · Auth 2 · Catalog (partial) 2 → **14 h**