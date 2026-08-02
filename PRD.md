# DE Research Dashboard — Product Requirements Document

## Problem Statement

Differential Evolution (DE) researchers need to compare 80 algorithm variants (10 mutation schemes × 4 crossover operators × 2 selection methods) across multiple benchmark functions, but have no unified web interface to configure, dispatch, and visualize these simulations side-by-side. Existing solutions are either MATLAB scripts, CLI-based, or lack persistent result storage.

## Solution

A React SPA backed by a RESTful API (separate backend) that provides:

- A simulator wizard to configure DE parameters (NP, F, Cr, dimensions, generations) and select which algorithm combinations to run
- A dashboard with tabular and chart-based result views, including per-benchmark fitness convergence charts with STS vs Greedy selection overlays
- JWT-based authentication for multi-user profile management and saved simulation history

## User Stories

1. **As a researcher**, I want to configure DE parameters (NP, F, Cr, dimensions, generations) and select which benchmark functions to simulate, so that I control the experimental setup.

2. **As a researcher**, I want to select from 10 mutation schemes, 4 crossover operators, and 2 selection methods, so that I can compare any combination of the 80 algorithm variants.

3. **As a researcher**, I want to submit simulations to a backend compute service, so that results are computed server-side and persisted for later retrieval.

4. **As a researcher**, I want to view simulation results as a sortable table with search/filter by benchmark function, so that I can quickly locate runs of interest.

5. **As a researcher**, I want to view per-benchmark fitness charts (line/bar) with STS and Greedy selection overlays, so that I can visually compare algorithm performance.

6. **As a researcher**, I want to filter charts by crossover method (Exponential, Binomial, One-Point, Two-Point), so that I can isolate the effect of each crossover strategy.

7. **As a researcher**, I want to delete individual simulation records, so that I can clean up failed or irrelevant runs.

8. **As a user**, I want to register an account with name/email/affiliation and log in with email/password, so that my simulation history is tied to my profile.

9. **As a user**, I want to edit my profile (name, email, password, affiliation), so that my account information stays current.

10. **As a researcher**, I want a portfolio/landing page that acknowledges my supervisor and showcases the project purpose, so that the tool serves as an academic presentation piece.

## Implementation Decisions

### Frontend Architecture
- **Framework**: React 19 via Create React App (react-scripts 5) — no SSR, pure SPA deployed as static files (S3 static hosting).
- **Routing**: Client-side routes under `/api/*` path prefix to mirror the backend API namespace — all routes accessible without auth guard (auth enforced server-side).
- **State**: Two React Context providers — `AuthContext` (user session) and `SimulationContext` (simulation queue/state) — no external state management library.
- **HTTP**: Axios instance with a `Bearer` token request interceptor reading from `localStorage`. Backend URL configurable via environment variables.
- **Styling**: Tailwind CSS 3 with CSS custom properties for theming. shadcn/ui components (Radix primitives) for consistent UI — Button, Card, Input, Label, Select, Tabs, Dialog, DropdownMenu, Table.
- **Charts**: Chart.js 4 via react-chartjs-2 wrapping. Each benchmark function gets a card with auto-detected log/linear Y scale and a KaTeX formula rendering below the title.

### Data Layer
- **Mock data** (`src/data/mockData.js`): 8 benchmark functions + 80 random simulation records for offline development.
- **Fitness data** (`src/data/fitnessData.js`): Pre-computed convergence values for 10 benchmark functions across 10 mutation schemes, keyed by crossover + selection method. Currently populated only for Exponential Crossover (STS + Greedy).
- **API service layer** (`src/services/api.js`): Thin wrappers around Axios — `authService` (login, register, verifyToken, updateProfile) and `simulationService` (CRUD for simulation records).

### Theming
- CSS variables for light mode (default) with `.dark` class support.
- shadcn's `slate` base color palette, custom primary-900 and accent-600 preserving the original design tokens.
- `@/` import alias configured in `jsconfig.json` but rarely used in existing code — relative imports are the convention.

## Testing Decisions

- **Test runner**: Jest via `react-scripts test` with React Testing Library.
- **Prior art**: Single smoke test in `App.test.js` — renders `<App />` and asserts a "learn react" text target (CRA default, currently stale/not aligned with actual UI).
- **Coverage**: No unit tests for components, contexts, services, or utility functions exist. No integration tests.
- **Acceptance criteria for future tests**: Each service function, context action, and component render path should have a focused test. Chart rendering should validate data shape changes produce correct visual output. Auth flows should be tested via mock API responses.

## Out of Scope

- **Backend**: Not in this repository. The API contract (`/api/login`, `/api/register`, `/api/auth/verify`, `/api/user/profile`, `/api/simulations`) is documented but implemented in a separate backend project.
- **WebSocket / real-time updates**: `socket.io-client` is a dependency but unused — no push-based simulation status updates.
- **Migration from CRA**: No Vite, Next.js, or other bundler migration planned.
- **End-to-end tests**: No Cypress, Playwright, or similar e2e suite.
- **DE algorithm implementation**: The algorithm logic runs on the backend (likely Python/EC2). The frontend only sends parameters and displays results.
- **Multi-language/frontend i18n**: All UI is in English with no i18n infrastructure.
