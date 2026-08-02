# DE Research Dashboard — Reasonix orientation

## Stack
- **React 19** — SPA via Create React App (react-scripts 5.0.1)
- **Tailwind CSS 3** + shadcn/ui (Radix primitives, CSS variables, dark mode via `.dark` class)
- **Chart.js 4** + react-chartjs-2 — line/bar visualizations
- **React Router 7** — client-side routing under `/api/*` prefix
- **Axios** — HTTP client with Bearer token interceptor
- **date-fns**, **KaTeX** (math rendering), **lucide-react** (icons)
- **Socket.io-client 4** — in deps but unused in current `.js` code

## Layout
- `src/components/` — page components (PascalCase.js) + `ui/` (shadcn primitives, PascalCase.jsx)
- `src/context/` — AuthContext, SimulationContext (React.createContext + Provider + hook export)
- `src/services/api.js` — Axios instance + `authService` / `simulationService` objects
- `src/lib/utils.js` — `cn()` helper (clsx + tailwind-merge)
- `src/data/` — mockData.js, fitnessData.js (benchmark functions, crossover/selection methods)

## Commands
- **dev**: `npm start` — runs on port 5000, not 3000
- **build**: `npm run build` — react-scripts build
- **test**: `npm test` — react-scripts test (Jest + React Testing Library)
- **eject**: `npm run eject` (irreversible)

## Conventions
- Page components: default-exported PascalCase.js (`export default function Dashboard`)
- shadcn/ui primitives: named-exported PascalCase.jsx (`export { Button }`)
- Contexts: `createContext` → `export const useX = () => useContext(X)` + `export const XProvider`
- API services: named-exported objects (`authService.login`, `simulationService.getAll`)
- `@/` import alias maps to `src/` (jsconfig.json) — available but rarely used in current code
- Routes are all under `/api/*` path prefix (/api, /api/login, /api/register, /api/simulator, /api/portfolio)
- Auth token stored in `localStorage("token")`, attached via Axios request interceptor
- ESLint via react-app preset, no Prettier config detected

## Watch out for
- Backend URL resolved from env vars: `REACT_APP_API_URL` (full URL) overrides `REACT_APP_BACKEND_PROTOCOL` + `HOST` + `PORT` composite. Defaults to `http://localhost:3000`
- `.env` file exists at root — not `.env.local`. Editing `.env` may cause CRA hot-reload misses
- simulators can't work without a running backend — dev must start the backend separately (not in this repo)
- shadcn components use `.jsx` extension (tsx:false in components.json) despite the rest of the codebase being `.js`
- CRA is deprecated — no Vite/Next migration attempted yet
