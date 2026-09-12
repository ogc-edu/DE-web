# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                      # dev server on PORT 3001 (not CRA's 3000 — 5000 is taken by macOS AirTunes)
npm run build                  # production build -> build/ (CRA runs ESLint as part of the build)
npm test                       # Jest + React Testing Library, watch mode
CI=true npm test               # single non-watch run (13 suites / 74 tests currently pass)

# one file / one test
CI=true npx react-scripts test --watchAll=false src/context/__tests__/SimulationContext.test.js
CI=true npx react-scripts test --watchAll=false -t "live progress polling"
```

**If the build fails on `Cannot find module 'language-subtag-registry/data/json/registry.json'`**
(surfaced via the `jsx-a11y` ESLint plugin), the `node_modules` copy of that package is
incomplete. It is not a code defect — `npm ci` clears it.

**react-router-dom cannot be resolved by name under CRA's Jest.** `react-router-dom@7`'s
`package.json` sets `"main": "./dist/main.js"`, a file it does not ship, and CRA 5's Jest
resolver predates `exports` maps. That is why `src/__mocks__/react-router-dom.js` exists — a
stub that is **auto-applied to every suite** (CRA points jest `roots` at `src/`, making that
directory the node-module manual-mock location). Most component tests rely on it and need no
router wrapper. A suite that needs real routing opts in with:

```js
jest.mock("react-router-dom", () => jest.requireActual("react-router"));
```

`react-router` (the core package `react-router-dom` re-exports) resolves fine and carries
`MemoryRouter`, `BrowserRouter`, `Link`, `Routes`, `Route`, `Navigate`, and the hooks.
`setupTests.js` polyfills `TextEncoder`/`TextDecoder`, which react-router 7 needs at import
time and Jest 27's jsdom lacks.

Backend is a **separate repository** (`DE-website-backend`). Simulator, auth, history and admin
pages are all non-functional without it running. Configure the URL in `.env` (git-ignored; see
`.env.example`): `REACT_APP_API_URL` wins outright, otherwise
`REACT_APP_BACKEND_PROTOCOL`/`_HOST`/`_PORT` are composed (defaults to `http://localhost:3000`).

## Architecture

React 19 SPA on Create React App (`react-scripts` 5, deprecated, **no migration planned**),
deployed as static files to S3. It configures, dispatches and visualizes Differential Evolution
simulations across **80 algorithm variants** (10 mutation schemes × 4 crossover operators ×
2 selection methods) over 10 benchmark functions.

### Routing quirk

**Every client route is under an `/api/*` prefix** (`/api`, `/api/login`, `/api/simulator`,
`/api/simulations/:id`, `/api/data`, `/api/portfolio`, `/api/settings`, `/api/import`,
`/api/admin`). This mirrors the backend namespace and is intentional — do not "fix" it.
The backend itself is mounted at `/api/v1/*`, so a frontend route and an API path are
distinct things that look similar. All routes except login/register are wrapped in
`ProtectedRoute` (redirects to `/api/login`); `/api/admin` additionally gates on user role.
A catch-all `*` route renders `NotFound`, and `/` redirects to `/api` — the deployed S3 site
root is `/`, so it must not 404. `<Routes>` sits inside `RouteErrorBoundary`, which feeds
`useLocation().pathname` to `ErrorBoundary` as a `resetKey` so navigating away from a route
that threw clears the fallback rather than pinning it for the session.

### State: two contexts, no state library

- **`AuthContext`** — on mount, `POST /api/v1/verify` then `GET /api/v1/user/profile` (the verify
  response alone lacks `role`, so the profile fetch is what makes role-gated UI survive a reload).
  Login stores the JWT in `localStorage` (remember-me) or `sessionStorage`; the axios request
  interceptor reads either. `logout()` also fires `POST /api/v1/logout` to invalidate the httpOnly
  refresh cookie. `authService.refreshToken()` exists but **no silent-refresh interceptor is wired**.
- **`SimulationContext`** — owns the simulation list plus a **5s polling loop**: while any
  simulation is `pending`/`running` it calls `GET /api/v1/simulation/get/:id/results` and merges
  live `status`/`progress`/`completedModels`/`bestFitness`; the interval stops on terminal states
  and is cleared on unmount. It keeps a `simulationsRef` mirror so interval callbacks never read
  stale state. On fetch failure it **surfaces `error`** (red banner in Dashboard/SimulationHistory) —
  the old silent mock-data fallback was deliberately removed; do not reintroduce one.

### The ID ↔ name boundary (`src/data/variantMappings.js`)

The backend speaks **integer IDs** (functions 1–10, mutation 1–10, crossover 1–4, selection 1–2);
the UI speaks display names. Array index + 1 is the backend ID. Everything crossing that boundary
goes through this module:

- `simulationToDisplay(sim)` normalizes a backend record into the shape tables/charts render
  (also maps `gen` → `generations`, `dim` → `dimension`, and recomputes `bestFitness` as the
  **minimum** `lowestFitness` across rows — DE minimizes).
- `Simulator.js` maps names → IDs when building the create body
  (`{ functions, methods: {mutation, crossover, selection}, np, f, cr, gen, dim }`).

Backend parameter ranges enforced client-side: np 10–40, f 0.1–2.0, cr 0.01–1.0, gen ≥ 1, dim 1–30.

### Data files (`src/data/`)

- **`fitnessData.js`** (2.3k lines) — pre-computed demo/reference convergence data keyed
  `crossover → selection → function → models[]`. **Frontend-only by explicit decision** — the
  backend serves no demo-data endpoint. Powers the Dashboard's reference-charts tab. Keep it here.
- `variantMappings.js` — the ID↔name maps above, plus `formatFitness` (exponential notation).
- `importTemplate.js` — the tab-separated `.txt` sample for the Import page; must stay in sync
  with the format guide rendered in `ImportData.js`.
- `mockData.js` was removed (Feature 001) — do not resurrect it.

### API layer (`src/services/api.js`)

One axios instance with `withCredentials: true` (needed for the httpOnly refresh cookie; note this
will not work cross-site, e.g. S3 website endpoint against an API on a different registrable
domain). Exports `authService`, `simulationService`, `adminService`, and `uploadToS3` — the latter
deliberately uses `fetch`, not the axios instance, so the `Authorization` header and JSON
content-type don't break the presigned-URL signature.

## Conventions

- Page components: default-exported PascalCase **`.js`** in `src/components/`.
  shadcn/ui primitives: named-exported PascalCase **`.jsx`** in `src/components/ui/`
  (`components.json` has `tsx: false`). Keep the extension split.
- Contexts: `createContext` → `export const useX = () => useContext(X)` + `export const XProvider`.
- **Relative imports.** The `@/` → `src/` alias is configured in `jsconfig.json` but unused in app
  code; follow the existing style.
- Tests colocated in `src/**/__tests__/`, mocking the service layer with
  `jest.mock("../../services/api", () => ({ ... }))` and contexts with
  `jest.mock("../../context/AuthContext", ...)`. `src/__mocks__/react-router-dom.js` provides a
  manual router mock — component tests rely on it rather than wrapping in a real `MemoryRouter`.
- Tailwind tokens beyond shadcn's CSS variables: `primary-900` (#0f172a), `accent-600` (#2563eb),
  `neutral-50` background. Dark mode via the `.dark` class.

## Planning docs

`docs/` holds a reconciled record: `ARCHITECTURE.md` (what is actually built, most current),
`CONTEXT.md` (detailed API contract + audit history), `PRD.md` (original intent, contains
annotated stale claims), `IMPLEMENTATION_PLAN.md` + `docs/plans/00X-*.md` (remaining Features
001–004, sequenced). When these disagree with the code, the code wins — and `ARCHITECTURE.md`
already lists the known PRD drift.
