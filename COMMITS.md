# COMMITS — Git workflow

## Rules
- Prefixes: `feat:` `fix:` `refactor:` `perf:` `docs:` `chore:`
- One commit = one logical change
- `main` receives setup and docs only; features go through `feat/<slug>` → PR → merge
- PR body: What / Why / How to test, plus `Closes #<issue>`

## Branch → PR map
| PR | Branch | Contents |
| --- | --- | --- |
| 1 | `feat/setup` | Vite, strict TS, Tailwind v4, ESLint, PLAN |
| 2 | `feat/domain` | types, utils, ApiClient, ApiError, StorageService, guards |
| 3 | `feat/shell-auth` | Layout, Header, Footer, routes, AuthContext, Login, ProtectedRoute |
| 4 | `feat/catalog` | useFetch, ProductCard/Grid, catalog states, deploy |
| 5 | `feat/product` | details, gallery, stepper, stock, tabs |
| 6 | `feat/cart-checkout` | reducer, provider, cart page, Cart model, checkout, OrderModel |
| 7 | `feat/catalog-full` | URL state, debounce, category, sort, pagination |
| 8 | `feat/reviews-promo-related` | reviews, promo, related products |
| 9 | `feat/orders-profile-theme` | orders, details, profile, theme, toasts |
| 10 | `perf/quality-docs` | lazy routes, images, memo, ErrorBoundary, docs, Lighthouse |

## Commit sequence