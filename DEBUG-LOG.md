# DEBUG-LOG

Each entry follows: Symptom → Reproduction → Tool → Root cause → Fix → Lesson.

## 1. Tailwind v4 plugin not resolved on build

- **Symptom** — `vite build` failed with `Cannot find package '@tailwindcss/vite'`.
- **Reproduction** — `npm run build` after scaffolding.
- **Tool** — terminal output + `npm ls`.
- **Root cause** — `package.json` listed `@tailwindcss/vite` but it was never installed because `npm install` ran against a template `package.json` that was later replaced.
- **Fix** — `npm install -D tailwindcss@4.3.5 @tailwindcss/vite@4.3.5` and pinned both to the same minor to avoid engine mismatch.
- **Lesson** — after replacing `package.json`, always re-run `npm install`; never assume `node_modules` matches the new manifest.

## 2. Fast typing showed results for an older query

- **Symptom** — typing "phone" quickly sometimes rendered results for "pho".
- **Reproduction** — Network throttled to Slow 3G, type five characters in under a second.
- **Tool** — Network waterfall showed three overlapping requests finishing out of order.
- **Root cause** — every keystroke started a fetch and the last *response* won, not the last *request*.
- **Fix** — `useDebounce(term, 400)` plus `AbortController` aborted in the effect cleanup, and results are ignored when `signal.aborted`.
- **Lesson** — async ordering is not guaranteed; cancellation belongs in cleanup, not in the handler.

## 3. TypeScript caught a runtime crash before it shipped

- **Symptom** — `tsc --noEmit` reported `'product' is possibly 'null'` in `ProductPage`.
- **Reproduction** — `npm run typecheck` while the success branch read `product.reviews` directly.
- **Tool** — TypeScript compiler with `strict` + `strictNullChecks`.
- **Root cause** — the discriminated union was not narrowed before derived values were computed.
- **Fix** — derive `product` from the union once, use optional chaining inside memos, and return early in render only after all hooks have run.
- **Lesson** — the compiler is the first debugger; narrowing before hooks keeps the hook order stable.

## 4. Related product click changed URL but not data

- **Symptom** — clicking a related card updated `/products/:id` while the old product stayed on screen.
- **Reproduction** — open `/products/1`, click a related product.
- **Tool** — React DevTools Components: the route param changed, the fetch state did not; `exhaustive-deps` flagged the effect.
- **Root cause** — the effect that resets quantity, tab and local reviews did not depend on the id.
- **Fix** — the reset effect depends on `validId`, and `useFetch` depends on the URL derived from it.
- **Lesson** — a route param is state; every effect that derives from it must list it.

## 5. Deep link returned 404 on the deployed site

- **Symptom** — `/products/5` worked when navigated in-app but returned the host's 404 on refresh.
- **Reproduction** — open the live URL, navigate to a product, press F5.
- **Tool** — Network: the document request for `/products/5` returned 404 from the host, not from the app.
- **Root cause** — the static host looked for a real file at that path; the SPA had no rewrite rule.
- **Fix** — committed `vercel.json` with a catch-all rewrite to `/index.html` (and `public/_redirects` for Netlify).
- **Lesson** — client routing needs a server-side fallback; test refresh, not just navigation.

## 6. ProductRow import failed due to filename typo

- **Symptom** — `npm run build` failed with `Cannot find module '@/components/product/ProductRow'`.
- **Reproduction** — `tsc --noEmit` after adding the list view.
- **Tool** — `Get-ChildItem src\components\product`.
- **Root cause** — the file was named `Product.Row.tsx` (with a dot) instead of `ProductRow.tsx`.
- **Fix** — `Rename-Item` to the exact import target.
- **Lesson** — Windows filesystem is case-insensitive but Vite's resolver is not; filename conventions must match imports exactly.