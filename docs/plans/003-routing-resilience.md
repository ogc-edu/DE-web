# Feature 003 — Routing Resilience: 404 Catch-All + ErrorBoundary

**ID:** 003
**Status:** Done
**Depends on:** none
**Closes:** `docs/CONTEXT.md` known-gap #10 (unknown `/api/*` renders blank page; no error boundary)

## Objective

Ensure unknown `/api/*` URLs render a NotFound page instead of a blank screen, and
that a render-time error anywhere in the app shows a fallback UI instead of a
blank screen.

## Context

`src/App.js` defines explicit routes but **no catch-all** `*` route, so an unknown
path renders nothing (blank page). There is also **no `ErrorBoundary`** wrapping the
route tree, so an uncaught render error blanks the app. `ProtectedRoute.js` exists
and redirects unauthenticated users; this feature is orthogonal to auth.

## Requirements

1. Add a `NotFound` page component shown for any unmatched `/api/*` path.
2. Add a catch-all `*` route in `App.js` that renders `NotFound`.
3. Add an `ErrorBoundary` class component and wrap the `Routes` with it.
4. ErrorBoundary must offer a way back (e.g. "Back to Dashboard" link) and render
   inside `Layout` (or standalone) so the fallback is usable.

## Technical design

- **New `src/components/NotFound.js`** (default-export `.js`, consistent with page
  components). Renders a friendly 404 message + a `Link`/`Button` back to `/api`.
  Use `Layout` if the page is expected behind auth; decide based on whether 404s
  should show inside the authenticated shell. Since unknown paths may be visited
  unauthenticated too, render `NotFound` standalone (no `Layout` dependency) or guard
  appropriately — simplest: standalone centered card, consistent with Login/Register
  styling.
- **New `src/components/ErrorBoundary.js`** — a class component with
  `static getDerivedStateFromError` and `componentDidCatch`. On error, render a
  fallback card ("Something went wrong") + a "Back to Dashboard" `<Link to="/api">`.
  Must not depend on hooks (class component).
- **Edit `src/App.js`**:
  - Import `NotFound` and `ErrorBoundary`.
  - Wrap the `<Routes>...</Routes>` with `<ErrorBoundary>`.
  - Add `<Route path="*" element={<NotFound />} />` as the last route.
- Keep all existing routes and `ProtectedRoute` behavior unchanged.

## Files / components affected

- **Touches (existing):** `src/App.js`
- **Creates:** `src/components/NotFound.js`, `src/components/ErrorBoundary.js`,
  `src/components/__tests__/NotFound.test.js`, `src/components/__tests__/ErrorBoundary.test.js`
- **Does NOT touch:** Layout, nav, contexts, api.

## API changes

None.

## Tests

- **New `src/components/__tests__/NotFound.test.js`:**
  - Renders the 404 message and a link back to `/api`.
- **New `src/components/__tests__/ErrorBoundary.test.js`:**
  - Wraps a child that throws; asserts the fallback UI renders.
  - Asserts the fallback includes a "Back to Dashboard" link.
- **New/extended App routing test** (optionally part of Feature 004, but a minimal
  one here is acceptable): rendering `<App />` at an unknown route shows NotFound.
  Reuse `jest.mock("axios", ...)` from `App.test.js`.
- **Verify command:** `npm test`
- Also run `npm run build` (after `npm ci`) to confirm the new components compile.

## Edge cases

- A 404 must not be confused with an auth redirect: `ProtectedRoute` still redirects
  known protected paths when logged out; the catch-all only catches truly unknown paths.
- The ErrorBoundary must reset state when the route changes (implement a `key` on the
  wrapped subtree or a reset mechanism) so navigating away after an error recovers.
- ErrorBoundary must not swallow errors during `componentDidCatch` in a way that
  hides the fallback.

## Acceptance criteria

- Navigating to an unknown `/api/*` renders `NotFound` (no blank page).
- A child component that throws during render shows the ErrorBoundary fallback, not a blank screen.
- All existing routes still render.
- `npm test` passes with the new tests.

## Out of scope

- A custom 404 for the backend/HTTP level (frontend SPA only).
- Per-route error boundaries beyond the single app-level one.
