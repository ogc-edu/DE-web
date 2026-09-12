# Feature 004 — Component & Routing Test Coverage

**ID:** 004
**Status:** Planned
**Depends on:** **002, 003** (must run after Portfolio and App.js are final)
**Closes:** PRD Testing Decision — "each component render path should have a focused test"

## Objective

Add focused render/behaviour tests for every page component and a real App routing
test (unauthenticated redirect + authenticated protected render), satisfying the
PRD's testing acceptance criterion. Also upgrade the weak `App.test.js` smoke test.

## Context

The suite has 59 passing tests covering contexts, services, data modules, utils,
and three components (Simulator, ImportData, AdminQueue). **Missing:** tests for
Dashboard, Portfolio, AccountSettings, Login, Register, SimulationsTable,
SimulationDetail, Layout, FitnessChart, ProtectedRoute, and any real routing test.
`App.test.js` only renders `<App />` and asserts nothing (no crash check target).

## Requirements

1. A focused test for each page component: `Dashboard`, `Portfolio`,
   `AccountSettings`, `Login`, `Register`, `SimulationsTable`, `SimulationDetail`,
   `Layout`, `FitnessChart`, `ProtectedRoute`.
2. A real App routing test:
   - Unauthenticated visit to a protected route redirects to `/api/login`.
   - Authenticated visit renders the protected page.
3. Upgrade `App.test.js` to assert meaningful content (e.g. login screen when
   unauthenticated, or the redirected route), not just "renders without crashing".

## Technical design

- Colocate tests in `src/components/__tests__/` next to their component
  (existing convention).
- Mock dependencies with the established pattern:
  - `jest.mock("../../context/AuthContext", () => ({ useAuth: () => mockAuth }))`
  - `jest.mock("../../context/SimulationContext", () => ({ useSimulation: () => mockSim }))`
  - `jest.mock("../../services/api", () => ({ simulationService: {...}, authService: {...} }))`
  - `react-router-dom` is already mocked via `src/__mocks__/react-router-dom.js`.
- For `Login` / `Register` / `ProtectedRoute`, exercise behaviour:
  - Login submit calls `login` and navigates; empty-fields error path.
  - Register sends `{username,email,password,affiliation}`; validation error path.
  - ProtectedRoute shows a spinner while `loading`, redirects to `/api/login` when
    `!user`, renders children when `user`.
- For `Dashboard`, mock `useSimulation` returning a couple of records; assert the
  table (or its toggle) renders and the stats reflect `simulations.length`.
- For `FitnessChart`, pass a small `functionData` fixture and assert the card title /
  KaTeX description render; assert the "no data" branch.
- For `Layout`, mock `useAuth`/`useLocation`; assert nav links render and the
  admin item appears only for `role === "admin"`.
- For the App routing test, render `<App />` with axios mocked (per `App.test.js`),
  mock `AuthContext`/`SimulationContext` as needed, and assert the redirect vs
  protected render. `App.test.js` is already the axios-mock pattern home.

## Files / components affected

- **Touches (existing):** `src/App.test.js`
- **Creates (new test files in `src/components/__tests__/`):**
  `Dashboard.test.js`, `Portfolio.test.js`, `AccountSettings.test.js`,
  `Login.test.js`, `Register.test.js`, `SimulationsTable.test.js`,
  `SimulationDetail.test.js`, `Layout.test.js`, `FitnessChart.test.js`,
  `ProtectedRoute.test.js`
- **Does NOT touch** any production component source (unless a test reveals a real
  bug — then stop and report rather than silently fixing).

## API changes

None.

## Tests

- This feature is itself the test authoring work. Each new file must run green
  independently.
- **Verify command:** `npm test`
- Confirm the count increases by ~10+ new files and all pass.

## Edge cases

- Component tests must isolate all real API/network calls via mocks; no component
  should attempt a real fetch.
- `ProtectedRoute`'s loading branch must be asserted (spinner before `loading` flips).
- Router-dependent components need the `react-router-dom` mock; ensure `useNavigate`
  and `useLocation` are provided by the mock.
- Keep assertions meaningful (presence of real headings/labels), not just "renders".

## Acceptance criteria

- Every page component has at least one focused test.
- App routing test covers: unauthenticated → `/api/login` redirect; authenticated → protected page renders.
- `App.test.js` asserts meaningful content, not just "no crash".
- `npm test` passes with all existing + new tests.

## Out of scope

- E2E tests (Cypress/Playwright) — explicitly out of scope in the PRD.
- Snapshot tests.
- Integration tests hitting a real backend.
