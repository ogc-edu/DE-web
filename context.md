# DE Research Dashboard — Frontend Context

> Purpose-built context for this repository. Verified against the code as of commit `1fc981a` (main branch, working tree clean).
>
> **Session update (2026-08-09, TASK 3 — real DE params + live progress):** Simulator now sends
> `np/f/cr/gen/dim` in the create body (client validation tightened to backend ranges: np 10–40,
> dim 1–30); `SimulationContext` polls `GET /simulation/get/:id/results` every 5s for pending/running
> simulations (live progress/completedModels/status, stops on terminal states, timers cleared on
> unmount) and no longer silently swaps in `mockSimulations` on API failure (logs + exposes `error`,
> surfaced as a banner in Dashboard/SimulationHistory); Dashboard table gained a status badge +
> progress bar column; `api.js` added `simulationService.getResults(id)`; `simulationToDisplay` maps
> backend `gen` → `generations`. Tests: 42/42 pass (was 35) — context polling tests, Simulator
> submission/validation tests, api getResults test. Live-verified end-to-end against the real queue +
> EC2 worker: params persisted, job enqueued, progress advanced 58→67→71→…→100% via the results API.

## What this project is

A React SPA (Create React App, no SSR) for **Differential Evolution (DE) research**: configure DE algorithm variants, submit simulations to a separate backend, and visualize results (tables + Chart.js fitness charts). It compares **80 algorithm variants** (10 mutation schemes × 4 crossover operators × 2 selection methods: STS / Greedy) across benchmark functions.

- Frontend repo only — **backend is a separate project** (API contract below). Backend failures are now surfaced (error banner) instead of silently falling back to mock data; `src/data/mockData.js` remains available for an explicit offline mode.
- Deployed as static files on AWS S3: `http://de-website-frontend-deploy.s3-website-us-east-1.amazonaws.com/`

## Stack (from package.json, verified)

| Layer | Choice |
|---|---|
| Framework | React 19 via `react-scripts` 5.0.1 (CRA, deprecated but no migration planned) |
| Routing | React Router 7 — `BrowserRouter`, all routes under `/api/*` prefix |
| HTTP | Axios 1.x — single instance, Bearer-token request interceptor |
| State | React Context only — `AuthContext`, `SimulationContext` (no Redux/Zustand) |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix primitives, `.jsx` files) |
| Charts | Chart.js 4 + react-chartjs-2 (Bar/Line) |
| Math | KaTeX via react-katex (fitness function formulas) |
| Icons | lucide-react |
| Tests | Jest + React Testing Library (`npm test`) |

Unused deps currently in `package.json` (zero references in `src/`): `socket.io-client`, `date-fns`, `react-day-picker`, `react-katex` is used.

## Layout

```
public/                  static assets (favicon, manifest, logos — CRA boilerplate)
src/
  App.js                 route table (7 routes under /api/*)
  index.js               CRA entry, <React.StrictMode>
  index.css              Tailwind + CSS variables (light + .dark theme)
  App.css                CRA leftover, tiny
  components/            page components (PascalCase.js) + Layout
    ui/                  shadcn primitives (PascalCase.jsx): button, card, dialog,
                         dropdown-menu, input, label, select, table, tabs
  context/               AuthContext, SimulationContext (+ __tests__)
  data/                  mockData.js, fitnessData.js (+ __tests__)
  lib/                   utils.js — cn() (clsx + tailwind-merge)
  services/              api.js — axios instance + authService + simulationService
  __mocks__/             react-router-dom mock for Jest
```

## Routes (src/App.js)

| Route | Component | Purpose |
|---|---|---|
| `/api` | Dashboard | Simulations table + Analytics (fitness charts) |
| `/api/login` | Login | Sign in (email/password, remember-me → localStorage vs sessionStorage) |
| `/api/register` | Register | Create account (name/email/password/affiliation) |
| `/api/simulator` | Simulator | Configure & submit DE simulations (parameters + variant selection) |
| `/api/data` | SimulationHistory | Full history table w/ status badges, filters |
| `/api/portfolio` | Portfolio | Student/supervisor showcase + profile editor |
| `/api/settings` | AccountSettings | Profile edit, change password, sign out |

Auth is **not** enforced client-side (no route guard); enforcement is server-side.

## Data & state flow

- **AuthContext** — `user`, `login`, `logout`, `loading`. On mount, verifies stored token via `POST /api/auth/verify`; stores `userData` (renames `_id` → `id`). Token persistence is done by Login.js (`localStorage`/`sessionStorage`), read by the axios interceptor.
- **SimulationContext** — `simulations`, `loading`, `error`, `activeSimulation`, `isSimulating`; actions: `fetchSimulations`, `deleteSimulation`, `addSimulation`. On API failure it **logs + exposes `error`** (banner in Dashboard/SimulationHistory) instead of silently swapping in `mockSimulations`. It also **polls active simulations** (`pending`/`running`) via `simulationService.getResults(id)` every 5s and merges live `status`/`progress`/`completedModels`/`bestFitness` into the display records; polling stops once all sims reach a terminal state and timers are cleared on unmount.
- **api.js** — `API_BASE_URL` from `REACT_APP_API_URL` (full URL wins) else `{REACT_APP_BACKEND_PROTOCOL}://{REACT_APP_BACKEND_HOST}:{REACT_APP_BACKEND_PORT}` (defaults `http://localhost:3000`). `.env` at repo root (git-tracked — see hygiene note).
- **fitnessData.js** (120 KB) — pre-computed `avgLowestFitness` per (crossover × selection × function × model). All 4 crossovers (exponential, binomial, onepoint, twopoint) × both selections (sts, greedy) are populated. Functions are named like `axisParallelHyperEllipsoid` → display name "Axis Parallel Hyper Ellipsoid Function" with a KaTeX description.
- **mockData.js** — 80 fake simulation records + `deVariants` + 8 `benchmarkFunctions` names.

## API contract (backend: `DE-website-backend`, mounted at `/api/v1`)

- `POST /api/v1/login` → `{ message, token }` (full user fetched via profile)
- `POST /api/v1/register` → body `{ username, email, password }` (no affiliation field)
- `POST /api/v1/verify` → `{ status, userData: { userId, username } }`
- `GET /api/v1/user/profile` → `{ user }`; `PATCH /api/v1/user/profile` → `{ username, email }`; `PATCH /api/v1/user/password` → `{ currentPassword, newPassword }`
- `GET /api/v1/simulation/get` → `{ simulations, simulationCount }`; `GET /api/v1/simulation/get/:id`; `GET /api/v1/simulation/get/:id/results` → `{ simulationId, status, totalModels, completedModels, progress, simulationData }` (polled for live progress); `POST /api/v1/simulation/create` → body `{ functions: [int], methods: { mutation, crossover, selection }, np, f, cr, gen, dim }`; `DELETE /api/v1/simulation/delete/:id`
- Backend Simulation record: `_id, functions[1-10], methods{mutation[1-10], crossover[1-4], selection[1-2]}, np (10-40), f (0.1-2.0), cr (0.01-1.0), gen (>=1), dim (1-30), totalModels, completedModels, progress, status (pending|running|completed|failed|cancelled), simulationData[], createdAt`
- The UI keeps mock-style display records (`id, model, benchmark, np, f, cr, generations, bestFitness, timestamp, status`) via `simulationToDisplay()` in `src/data/variantMappings.js` (maps backend `gen` → `generations`, `dim` → `dimension`).

## Conventions

- Page components: default-exported PascalCase `.js` (`export default function Dashboard`).
- shadcn primitives: named-exported PascalCase `.jsx` (`export { Button }`).
- Contexts: `createContext` → `export const useX = () => useContext(X)` + `export const XProvider`.
- Services: named-exported objects (`authService.login`, `simulationService.getAll`).
- `@/` alias → `src/` (jsconfig.json) available but relative imports are the convention.
- Colors: Tailwind `primary-900` (#0f172a), `accent-600` (#2563eb), `neutral-50` background — defined in `tailwind.config.js` + CSS vars in `index.css`.
- ESLint: react-app preset (`npm run build` runs lint as part of CRA).

## Commands

```bash
npm start        # dev server on PORT 3001 (CRA default 3000 is overridden)
npm run build    # production build → build/
npm test         # Jest + RTL (react-scripts test) — 42/42 passing (TASK 3)
```

Note: node v26.5.1 / npm 11.17.0 are available on the dev machine, so `npm test` / `npm run build` can be run locally.

## Known issues / gaps (as of this audit)

1. ✅ **RESOLVED — Simulator.js corruption**: commit `c671eef` ("2/8 After agenting") committed a 38,805-byte all-NUL file. **Fixed in `1fc981a`** (restored valid 37,944-byte source).
2. ✅ **RESOLVED — repo hygiene**: `.env` and `.idea/` untracked + gitignored in `1fc981a`; `npm start` made cross-platform (`PORT=3001 react-scripts start`, was Windows-only `set PORT=5000`).
3. **`/api/forgot-password` link** in Login.js has no matching route → 404.
4. **Dead UI**: Dashboard table `ExternalLink`/`Download` buttons have no handlers; Portfolio "Enable 2FA", "View Alerts", "Update Avatar", camera/pen icons are non-functional.
5. **Portfolio is placeholder-heavy**: supervisor shows "Dr. [Supervisor Name]" (PRD wants "Ts Dr. Lim Seng Poh"); hardcoded stats (Rank #12, Impact High, Premium Researcher, "3 new simulation results", "Last updated: April 13, 2026").
6. **Benchmark-name mismatch**: table filter uses `mockData.benchmarkFunctions` (8 names, e.g. "Sphere Function") while analytics charts use `fitnessData` names (10, e.g. "Axis Parallel Hyper Ellipsoid Function") — filter options won't match real simulation records.
7. **`/api/data` (SimulationHistory) duplicates** the Dashboard table view; Dashboard's unique value is the Analytics chart view.
8. ✅ **RESOLVED (TASK 3) — Mock fallback hides errors**: `fetchSimulations` no longer swaps in mock data on API failure — it logs and exposes `error`, rendered as a red banner in Dashboard + SimulationHistory (`mockSimulations` remains in `src/data/mockData.js` for an explicit offline mode).
9. **Unused files/deps**: `src/logo.svg` and `src/components/Login.css` are unreferenced (note: `src/App.css` **is** imported by `src/App.js:12`); `socket.io-client`, `date-fns`, `react-day-picker` still in `package.json` and unused (only `react-katex` is used, in FitnessChart.js).
10. **No 404 catch-all route** — unknown `/api/*` URLs render a blank page; no error boundary.
11. ⚠️ **Partial (TASK 3) — component tests added for Simulator** (`src/components/__tests__/Simulator.test.js`: param submission incl. np/f/cr/gen/dim, backend-range validation). Dashboard/Portfolio render tests still missing.
12. ✅ **RESOLVED (TASK 3) — No real-time updates**: `SimulationContext` now polls `GET /simulation/get/:id/results` every 5s for pending/running simulations and live-updates progress/completedModels/status/bestFitness; Dashboard shows a status badge + progress bar; polling stops on terminal states and timers are cleared on unmount. (`socket.io-client` still unused — polling replaced the need.)
13. ✅ **RESOLVED — frontend↔backend integration**: `src/services/api.js` now targets the real `/api/v1` endpoints (was unversioned `/api/*` that 404'd); register sends `{username,email,password}`, login fetches the profile for user state, simulation list is unwrapped + normalized via `variantMappings.js`, Simulator submits integer IDs, and `bestFitness`/`np/f/cr` render guards added. Port fixed to 3001 (5000 was owned by macOS AirTunes).
