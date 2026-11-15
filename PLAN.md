## Goal & Scope

Deliver a resilient storefront SPA. CORE is the pass threshold and is implemented first; FULL is added only on top of a working CORE.

| Module | CORE scope | FULL scope |
| --- | --- | --- |
| React | components/props/children, useState/useEffect, map/key, controlled forms, Router, Context cart | custom hooks, cart reducer, Formik+Yup, URL state, Orders/Profile |
| TypeScript | strict config, typed props/state/API, typecheck = 0 | generics, ApiClient/ApiError, OOP models, guards, unions, utility types |
| Tailwind | v4 integration, utility styling, grid/flex, responsive, hover/focus/disabled | @theme tokens, dark mode, custom utilities |
| Optimisation | responsive pages, ErrorBoundary, DEBUG-LOG | lazy routes/images, Lighthouse before/after, cross-browser matrix |
| Process | README, PLAN, REPORT, deploy, real Git history | Issues/Projects, PR flow, progress notes, metrics, demo video |

## WBS

| Epic | Tasks | Est. h | Week |
| --- | --- | --- | --- |
| Setup | Vite+TS strict, Tailwind v4, ESLint, scripts, path alias | 2 | 1 |
| Domain | types, constants, format/url/sort/validation/guards | 2.5 | 1 |
| Data | ApiClient, ApiError, StorageService<T>, useFetch, useDebounce | 2.5 | 1 |
| Shell | Layout, Header, Footer, ScrollToTop, routes, 404, ErrorBoundary | 3 | 1 |
| Auth | AuthContext, ProtectedRoute, Login (Formik+Yup) | 2 | 1 |
| Catalog | fetch + states, ProductCard/Grid, toolbar, URL state, pagination | 4 | 2 |
| Product | details, gallery, stepper, stock, tabs, reviews, related | 3.5 | 2 |
| Cart | reducer, provider, persistence, cart page, Cart model, promo | 3.5 | 2 |
| Checkout | controlled form, validation, OrderModel, confirmation | 2.5 | 2 |
| Orders | list, details, status simulation, reorder | 2 | 3 |
| Profile | edit form, theme, clear local data | 1.5 | 3 |
| Quality | responsive pass, a11y, lazy routes, memo, Lighthouse, compatibility | 3 | 3 |
| Docs | README, REPORT, DEBUG-LOG, COMPATIBILITY, progress notes, deploy | 2.5 | 3 |

## Risks & Mitigation

1. **DummyJSON unavailable or slow** → every fetch has loading/error/empty states plus Retry; the shell, cart and orders keep working offline because they read from local storage.
2. **Stale responses overwriting fresh ones during fast typing** → debounce 400 ms + `AbortController` cleanup in `useFetch`; verified in the Network panel (cancelled requests).
3. **Corrupted `localStorage` crashing the app on boot** → `StorageService<T>` parses into `unknown` and narrows with type guards, returning `null` on any mismatch.
4. **Time overrun** → CORE is finished and deployed before any FULL work starts; FULL is cut from the bottom of the priority list (Profile → Orders → Reviews → Promo → filters).
5. **SPA 404 on deep links after deploy** → `vercel.json` rewrite / `_redirects` committed with the first deploy.

## Definition of Done (per task)

- `npm run typecheck` and `npm run lint` return 0 errors, no `any`
- Feature works at 375 px and desktop with no horizontal scroll
- Loading, error and empty paths are handled where data is involved
- Keyboard reachable with a visible focus ring; labels tied to inputs
- Committed with a conventional prefix and pushed