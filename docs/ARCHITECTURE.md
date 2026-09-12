# DE Research Dashboard — Architecture (reconciled against current code)

> Written after STEP 0 codebase inspection. Reconciles the PRD against what is
> actually built. Correct as of commit `d6ea49f` (working tree clean, plus the
> `docs/` relocation).

## Stack

| Layer | Choice | Status |
|---|---|---|
| Framework | React 19 via `react-scripts` 5.0.1 (CRA, deprecated, no migration) | DONE |
| Routing | React Router 7 — `BrowserRouter`, routes under `/api/*` | DONE |
| Auth guard | **Client-side now enforced** (`ProtectedRoute` redirects to `/api/login`) — PRD claim of "no guard" is **stale** | DONE |
| HTTP | Axios 1.x — single instance, Bearer interceptor, `withCredentials` | DONE |
| State | `AuthContext`, `SimulationContext` (React Context only, no external lib) | DONE |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix primitives, `.jsx`) | DONE |
| Charts | Chart.js 4 + react-chartjs-2 (Bar/Line) | DONE |
| Math | KaTeX via react-katex | DONE |
| Tests | Jest + React Testing Library (`react-scripts test`) | DONE (61 tests) |

## Routing table (`src/App.js`)

| Route | Component | Auth |
|---|---|---|
| `/api` | Dashboard (table + reference analytics charts) | Protected |
| `/api/login` | Login | public |
| `/api/register` | Register | public |
| `/api/simulator` | Simulator (2-page wizard) | Protected |
| `/api/import` | ImportData | Protected |
| `/api/simulations/:id` | SimulationDetail | Protected |
| `/api/portfolio` | Portfolio | Protected |
| `/api/data` | SimulationHistory (table + status filter) | Protected |
| `/api/settings` | AccountSettings | Protected |
| `/api/admin` | AdminQueue (admin-only) | Protected + role gate |

## Data & state flow

- **AuthContext** — `user`, `login`, `logout`, `updateUser`, `loading`. On mount verifies token
  via `POST /api/v1/verify` then fetches full profile via `GET /api/v1/user/profile`. Tokens stored
  by Login (`localStorage`/`sessionStorage`); axios interceptor attaches `Bearer`.
- **SimulationContext** — `simulations`, `loading`, `error`, `activeSimulation`, `isSimulating`;
  `fetchSimulations`, `deleteSimulation`, `addSimulation`. Polls active sims every 5s via
  `GET /api/v1/simulation/get/:id/results`, merges live status/progress. On API failure it **surfaces
  the error** (no silent mock fallback).
- **variantMappings** (`src/data/variantMappings.js`) — `simulationToDisplay()` normalizes backend
  records (integer IDs ↔ display names); `formatFitness`; `modelNameFromIds`.

## API surface (`src/services/api.js`, mounted `/api/v1`)

- Auth: `POST login`, `POST register`, `POST verify`, `POST refresh` (unused), `GET/PATCH user/profile`,
  `PATCH user/password`, `POST logout`, presigned avatar upload (`GET user/profile/presign`,
  `POST user/profile/picture`, `uploadToS3` via fetch).
- Simulations: `GET simulation/get` (list), `GET simulation/get/:id`, `GET .../:id/results`,
  `POST simulation/create`, `POST simulation/import`, `DELETE simulation/delete/:id`.
- Admin: `GET admin/queue` (SQS metrics, 403 non-admin, 503 if unconfigured).

## Data files

- `src/data/fitnessData.js` — **DEMO / REFERENCE dataset, frontend-only by decision.** The backend
  serves **no endpoint** for demo data. All 4 crossovers × 2 selections are populated (PRD's "only
  exponential" claim is stale). 10 benchmark functions. Used by Dashboard's Reference-charts tab.
  This is the intended source of truth for demo charts — keep it client-side; never route it to the
  backend.
- `src/data/mockData.js` — **removed (Feature 001).** Was dead (no app references); the PRD's
  "mock data as the data layer" decision no longer applies. Demo/reference charts use `fitnessData.js`.
- `src/data/variantMappings.js` — canonical ID↔name maps.
- `src/data/importTemplate.js` — sample `.txt` for the Import page.

## Key conventions

- Relative imports; `@/` alias available but unused in app code.
- Page components default-export `.js`; shadcn primitives named-export `.jsx` in `src/components/ui/`.
- Tests colocated in `src/**/__tests__/`.
- Colors: `primary-900` (#0f172a), `accent-600` (#2563eb), `neutral-50` bg.

## Known drift (PRD vs code)

1. PRD "no client-side auth guard" — **code enforces it** (`ProtectedRoute`).
2. PRD API contract unversioned `/api/*` — code uses `/api/v1/*`.
3. PRD "mock data is the data layer" — `mockData.js` was dead and is **removed (Feature 001)**; demo
   charts use frontend-only `fitnessData.js` (backend serves no demo-data endpoint).
4. PRD "fitness data only exponential" — all crossovers populated.
5. PRD Testing section predates the 59-test suite; "each component render path" criterion not yet met (Feature 004).

## Remaining work

See `docs/IMPLEMENTATION_PLAN.md` (Features 001–004).
