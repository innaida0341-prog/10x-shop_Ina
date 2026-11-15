# COMPATIBILITY

Fill each cell after testing: `✓` or a short problem description.

## Desktop (1440 px)

| Page | Chrome | Firefox | Edge |
|---|---|---|---|
| Catalog `/` | ✓ | ✓ | ✓ |
| Product `/products/1` | ✓ | ✓ | ✓ |
| Cart `/cart` | ✓ | ✓ | ✓ |
| Login `/login` | ✓ | ✓ | ✓ |
| Checkout `/checkout` | ✓ | ✓ | ✓ |
| Orders `/orders` | ✓ | ✓ | ✓ |
| Profile `/profile` | ✓ | ✓ | ✓ |
| 404 `/nope` | ✓ | ✓ | ✓ |

## Mobile (375 px — DevTools emulation)

| Page | Chrome | Firefox | Edge |
|---|---|---|---|
| Catalog | ✓ | ✓ | ✓ |
| Product | ✓ | ✓ | ✓ |
| Cart | ✓ | ✓ | ✓ |
| Login | ✓ | ✓ | ✓ |
| Checkout | ✓ | ✓ | ✓ |
| Orders | ✓ | ✓ | ✓ |
| Profile | ✓ | ✓ | ✓ |
| 404 | ✓ | ✓ | ✓ |

## Checks performed per cell

1. No horizontal scroll at 375 px
2. Tap targets ≥ 44 px
3. Burger menu opens, navigates and closes
4. Dark mode renders with readable contrast
5. Primary flow completes: catalog → product → cart → login → checkout → confirmation
6. Deep-link refresh works on the deployed URL

## Known platform notes

- `backdrop-filter` (header glass) degrades to a solid surface where unsupported.
- `color-mix()` requires a current browser.
- Scrollbar styling uses `::-webkit-scrollbar` plus `scrollbar-color` for Firefox.