# REPORT — 10X Shop

## Planned vs Delivered

| Module | CORE | FULL | Notes |
| --- | --- | --- | --- |
| React | ✅ | ✅ | Components, props/children, useState/useEffect, map/key, controlled forms, Router, 6 Contexts, cartReducer with discriminated union, 7 custom hooks, Formik+Yup login, lazy routes |
| TypeScript | ✅ | ✅ | Strict mode, generics (`ApiClient<T>`, `useFetch<T>`, `StorageService<T>`), OOP classes, 20+ type guards, AsyncState/CartAction unions, `Pick/Omit/Partial`, `as const` |
| Tailwind CSS | ✅ | ✅ | v4 plugin, `@theme` tokens, `@utility` (card/glass/tap/field/chip/shimmer), `@custom-variant` (dark/hocus/picked), dark mode, container queries |
| Optimisation | ✅ | ✅ | ErrorBoundary, lazy routes+images, debounce+AbortController, measured `memo`, responsive 3 breakpoints, Lighthouse |
| Process | ✅ | partial | See schedule note below |

### Deliberate deviations

- **Card fields are not implemented.** Annex A P5.2 explicitly removes bank/card data from scope, so checkout collects contact and shipping fields only. Order details therefore show "Cash on delivery (demo)" instead of a masked card number.
- **Login is local.** The README's `emilys / emilyspass` is an example credential for the simulation; no authentication API is called.
- **Client-side page sorting** is a documented compromise for endpoints that ignore `sortBy` (see DEBUG-LOG); it orders the current page only.

## Metrics

| Metric | Before | After | What changed |
| --- | --- | --- | --- |
| Lighthouse Performance (mobile) | — | — | Route splitting, lazy images, memo |
| Lighthouse Accessibility | — | — | Labels, aria, contrast, focus rings |
| Lighthouse Best Practices | — | — | No console noise, correct image sizes |
| CLS | — | — | Intrinsic width/height on thumbnails |
| Main chunk (gzip) | — | — | `React.lazy` per route |

| Process metric | Value |
| --- | --- |
| Commits | 50 |
| Distinct commit days | 2 (compressed schedule) |
| Files | ~70 |
| Lines of code | ~5,200 |

**Schedule note.** This build was executed in a compressed window rather than the recommended three weeks. The commit-count target is met; the "≥ 15 distinct days" guideline is not, and no commit dates were altered. The three progress notes describe real phases with real timestamps.

## Three hardest problems

### 1. Request races in the catalog
**Symptom.** Fast typing showed results for an older query.
**Root cause.** Every keystroke started a fetch and the last *response* won, not the last *request*.
**Fix.** `useDebounce(term, 400)` plus `AbortController` aborted in the effect cleanup, and results are ignored when `signal.aborted`. See DEBUG-LOG #2.

### 2. Keeping URL state and input in sync without a loop
**Symptom.** Back/Forward reverted typing mid-word.
**Root cause.** Search field and URL both changed, creating a feedback loop.
**Fix.** A `committed` ref distinguishes our own commits from external navigation, so Back/Forward updates the field but typing never gets reverted.

### 3. Making persisted data trustworthy
**Symptom.** Hand-edited `shop_cart` crashed the provider tree on boot.
**Root cause.** `JSON.parse` returns `unknown` — no validation.
**Fix.** `StorageService<T>` with runtime type guards returns `null` on any mismatch, so corrupted storage degrades to an empty cart.

## What I would do differently

- Write the guards and the storage layer before the UI, so no component ever touches raw `localStorage`.
- Add unit tests for `cartReducer`, `Cart` totals and `getOrderStatus` — they are pure and cheap to test.
- Extract the catalog URL-sync logic into a `useCatalogParams` hook to keep the page component thin.
- Measure performance from the first deploy so "before" numbers are captured continuously.

## AI usage

AI was used as a pair-programming assistant for scaffolding, type modelling and reviewing edge cases. I rejected suggestions that used `as` casts on parsed JSON and replaced them with runtime type guards, and I rejected a global `useMemo`/`memo` sweep in favour of Profiler-driven memoisation. I also removed a proposed card-payment form because Annex A puts it out of scope. Every generated file was read, type-checked, run and adjusted before being committed; the architecture, scope decisions and the debugging narrative are mine.