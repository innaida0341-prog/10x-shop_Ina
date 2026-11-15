# REPORT — 10X Shop

## Lighthouse report

### Audit history

| Audit | Environment | Performance | Accessibility | Best Practices | SEO | Source |
|---|---|---:|---:|---:|---:|---|
| Initial deployed audit | `https://10x-shop-ina.vercel.app/` | 5 | 96 | 100 | 92 | User-provided Lighthouse screenshot |
| Latest provided lab audit | Emulated Desktop, custom throttling, Lighthouse 13.4.1, Chromium 152.0.0.0, Nov 15 2026, 16:01 GMT+4 | 39 | 96 | 100 | 92 | User-provided Lighthouse report |

> Lighthouse values are estimated and may vary between runs. The desktop result is not a substitute for the final mobile acceptance audit.

---

## Latest measured metric breakdown

| Metric | Value | Score contribution | Good target | Status |
|---|---:|---:|---:|---|
| First Contentful Paint | 0.8 s | +10 | < 1.8 s | Good |
| Largest Contentful Paint | 1.6 s | +20 | < 2.5 s | Good |
| Total Blocking Time | 6,920 ms | +0 | < 200 ms | Critical |
| Cumulative Layout Shift | 0.338 | +8 | < 0.1 | Poor |
| Speed Index | 3.6 s | +2 | < 3.4 s | Needs improvement |

### Main conclusion

The performance score is dominated by **Total Blocking Time**, not by LCP or FCP.

The page renders early, but the main thread is blocked for too long. The reported diagnostics confirm this:

- Minimize main-thread work: **14.2 s**
- Avoid long main-thread tasks: **20 long tasks found**
- Avoid non-composited animations: **12 animated elements found**
- Reduce unused JavaScript: estimated savings of **28 KiB**
- Improve image delivery: estimated savings of **5 KiB**
- Layout shift culprits detected
- Forced reflow detected
- Render-blocking requests detected
- DOM size optimization recommended
- Third-party requests detected

---

## Category findings

### Performance — 39 desktop / 5 initial deployed audit

Primary issues:

1. Long main-thread tasks.
2. Non-composited animations.
3. Infinite-scroll loading loop causing repeated work and DOM growth.
4. Layout shifts from font loading, skeleton-to-content swaps, and scrollbar appearance.
5. Render-blocking or late-loading font resources.

### Accessibility — 96

Reported issue:

- Background and foreground colors do not have a sufficient contrast ratio.

Remediation applied:

- Darkened muted text token.
- Darkened amber accent token for light mode.
- Kept focus rings and semantic color contrast readable.

Final accessibility score must be confirmed with a new Lighthouse run.

### Best Practices — 100

Current score is passing.

Lighthouse also listed optional trust and safety hardening items:

- Ensure CSP is effective against XSS attacks.
- Use a strong HSTS policy.
- Ensure proper origin isolation with COOP.
- Mitigate clickjacking with XFO or CSP.
- Mitigate DOM-based XSS with Trusted Types.

These are security hardening recommendations, not current score blockers.

### SEO — 92

Reported issue:

- `robots.txt` is not valid: **37 errors found**.

Root cause:

- The SPA fallback was serving HTML for `/robots.txt` instead of a plain-text robots file.

Remediation:

- Add a valid `public/robots.txt`.
- Add `public/sitemap.xml`.
- Ensure the file is named exactly `robots.txt`, not `tobots.txt`.

Final SEO score must be confirmed after deployment.

---

## Root cause analysis

### 1. Total Blocking Time

The largest performance problem was main-thread blocking.

Evidence:

- TBT: **6,920 ms**
- Main-thread work: **14.2 s**
- Long tasks: **20**
- Non-composited animations: **12**

Main causes:

- Skeleton shimmer animation used paint-heavy properties.
- Infinite-scroll observer could re-trigger loading repeatedly.
- Repeated product appends increased DOM size and React render work.
- Sticky/background visual effects added unnecessary paint cost on mobile.

### 2. Cumulative Layout Shift

CLS was **0.338**, above the good threshold of **0.1**.

Main causes:

- Late font swap changed text metrics.
- Skeleton placeholders did not fully reserve the final page footprint.
- Scrollbar appearance could shift layout.
- Route fallback did not reserve enough vertical space.

### 3. SEO robots failure

The SPA rewrite caused `/robots.txt` to return the app shell instead of a valid robots file.

This produced invalid robots.txt errors and reduced the SEO score.

---

## Remediation implemented

### CSS and animation performance

Files:

- `src/index.css`

Changes:

- Replaced paint-heavy shimmer behavior with opacity-only animation.
- Added compositor-friendly skeleton utilities:
  - `sk-block`
  - `sk-lane`
  - `sk-action`
- Removed blur drift animation from the ambient background.
- Added `scrollbar-gutter: stable` to prevent scrollbar-induced layout shift.
- Simplified sticky glass effect on mobile.
- Improved contrast tokens:
  - `--color-muted`
  - `--color-amber`
- Kept reduced-motion fallback.

Expected effect:

- Lower main-thread paint work.
- Lower TBT.
- Lower CLS.
- Better accessibility contrast.

### Layout and route fallback

Files:

- `src/components/layout/Layout.tsx`

Changes:

- Added skeleton route fallback that reserves page footprint.
- Added skip link.
- Added paint-isolated ambient background.
- Added `ErrorBoundary` reset by route pathname.
- Reserved main content height to reduce footer jump.

Expected effect:

- Lower CLS during lazy route loading.
- Better keyboard navigation.
- More stable page shell.

### Infinite scroll stability

Files:

- `src/hooks/useIntersection.ts`
- `src/hooks/useInfiniteProducts.ts`

Changes:

- Observer is no longer recreated every time `enabled` changes.
- `enabled` is read through a ref at fire time.
- Added cooldown to prevent rapid repeated triggers.
- Added passive, rAF-throttled scroll re-arm for tall viewports.
- Abort stale page requests.
- Deduplicate appended products.
- Stop paging when an empty page is returned.
- Prevent unattended infinite loading loops.

Expected effect:

- Fewer long tasks.
- Less repeated React work.
- Smaller DOM growth.
- Lower TBT.
- More stable infinite scroll.

### Font and HTML loading

Files:

- `index.html`

Changes:

- Replaced late `media="print"` font trick with preload + stylesheet.
- Added font preconnect.
- Added favicon declaration.
- Added theme-color meta for light and dark.
- Added canonical and Open Graph metadata.
- Added noscript fallback.

Expected effect:

- Reduced font-related layout shift.
- More predictable first paint.
- Better metadata and icon handling.

### Build chunking

Files:

- `vite.config.ts`

Changes:

- Split vendor chunks:
  - `react`
  - `react-dom`
  - `router`
  - `forms`
  - `vendor`
- Kept route-level lazy loading.
- Disabled compressed size reporting for faster builds.
- Set build target to `es2022`.

Expected effect:

- Better cacheability.
- Smaller app entry chunk.
- Reduced unused JavaScript on non-form routes.

### SEO files

Files:

- `public/robots.txt`
- `public/sitemap.xml`

Changes:

- Added valid robots.txt.
- Added sitemap.xml.
- Blocked private/app-only routes from crawling.
- Allowed public catalog and product discovery.

Expected effect:

- Fix invalid robots.txt audit.
- Improve SEO score.
- Prevent SPA fallback from serving HTML as robots.txt.

---

## Current verification status

The latest captured Lighthouse result is still:

| Category | Score |
|---|---:|
| Performance | 39 desktop |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 92 |

The initial deployed audit showed:

| Category | Score |
|---|---:|
| Performance | 5 |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 92 |

The performance remediation has been implemented, but a final post-remediation Lighthouse capture is still required.

Do not report target scores as measured scores.

---

## Final acceptance protocol

Run the final audit against the deployed production URL:

`https://10x-shop-ina.vercel.app/`

Use:

- Chrome Incognito.
- Lighthouse tab.
- Mode: Navigation.
- Device: Mobile.
- Categories: Performance, Accessibility, Best Practices, SEO.
- Clear storage before the run.
- Disable browser extensions.
- Wait for Vercel deployment to finish before auditing.

Also audit:

- `/login`
- `/products/5`
- `/cart`
- `/robots.txt`
- `/sitemap.xml`

Acceptance targets:

| Category | Target |
|---|---:|
| Performance | 80+ mobile |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 95+ |

Core Web Vitals targets:

| Metric | Target |
|---|---:|
| LCP | < 2.5 s |
| TBT | < 200 ms |
| CLS | < 0.1 |
| FCP | < 1.8 s |
| Speed Index | < 3.4 s |

---

## Known limitations

- DummyJSON is an external API, so network latency can affect LCP and Speed Index.
- Google Fonts is an external resource, so font delivery can vary by network.
- Desktop Lighthouse scores are usually higher than mobile scores.
- Infinite scroll must remain user-driven and must not auto-load the entire catalog unattended.
- Local authentication is a simulation and does not call an external auth API.
- Checkout does not collect card data.

---

## Process metrics

| Metric | Value |
|---|---|
| Commit style | Conventional commits |
| Plan before code | Yes |
| Documentation | README, PLAN, REPORT, DEBUG-LOG, COMPATIBILITY, COMMITS |
| Progress notes | week-1, week-2, week-3 |
| Live demo | Vercel |
| SPA fallback | `vercel.json` rewrite |
| SEO files | robots.txt, sitemap.xml |
| Performance work | CSS, layout, hooks, fonts, build chunking |

---

## Final statement

The application has a complete storefront flow, strict TypeScript, Tailwind CSS v4, lazy routes, local persistence, order simulation, wishlist, address book, invoice export, and documented debugging history.

The main remaining quality gate is a final mobile Lighthouse audit after the performance remediation is deployed. The measured baseline shows that TBT and CLS were the primary blockers; the implemented changes directly target those two metrics.