# Progress — Phase 2 (Commerce flow)

## Done
- Product details: gallery, quantity stepper, three stock states, description/reviews tabs
- Cart reducer with a discriminated union and an exhaustiveness check, provider with lazy init and
  persistence, cart page with stepper / remove / clear, `Cart` model for totals
- Checkout controlled form with field-level validation, `OrderModel` factory, confirmation panel,
  cart cleared and badge updated immediately
- Catalog FULL: URL state for q/category/sort/page, debounced search, pagination, sort fallback
- Reviews with local persistence and average rating, related products, promo code `10X10`

## Next
Orders list and details with status simulation, Profile, theme, performance and documentation.

## Blockers
Search race condition under throttling — fixed with debounce plus request cancellation (DEBUG-LOG #2).

## Hours
Product 3.5 · Cart 3.5 · Checkout 2.5 · Catalog FULL 4 · Reviews/Promo/Related 2.5 → **16 h**