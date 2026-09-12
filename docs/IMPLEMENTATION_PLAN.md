# DE Research Dashboard — Master Implementation Plan

> Status: MID-BUILD reconciliation complete (see `docs/PRD.md`, `docs/CONTEXT.md`).
> Only **remaining** work is planned below. Everything else in the PRD is DONE
> and verified against the code (reconciliation in the STEP 1 discussion, and
> summarized in `docs/ARCHITECTURE.md`).

## Health baseline (verified)

- `npm test` → **61/61 pass** (11 suites, after Feature 002)
- `npm run build` → **currently fails** only because `node_modules/language-subtag-registry`
  is incomplete (`data/json/registry.json` missing). Environment prerequisite, **not a code
  feature** — restore with `npm ci` before running any verify/build step.

## Demo / reference data (recorded decision)

Demo data exists **only in the frontend**. The backend will serve **no endpoint** for demo data.
- `src/data/fitnessData.js` is the intended client-bundled demo/reference dataset (Dashboard
  Reference-charts tab) — **keep it, frontend-only**.
- `src/data/mockData.js` is a **separate, dead** file (no app references) and is removed in Feature 001;
  removing it must NOT touch `fitnessData.js`.

## Conventions to preserve (all features)

- Relative imports (no `@/` alias, though configured).
- Page components: default-export PascalCase `.js`; shadcn primitives: named-export `.jsx`.
- Tests colocated in `src/**/__tests__/`, mock pattern `jest.mock("../../services/api")`.
- State via `AuthContext` / `SimulationContext` only — **no new state libraries**.
- API under `/api/v1/*`.

## Features (in implementation order)

| ID | Name | Closes | Depends on | Status |
|----|------|--------|-----------|--------|
| 001 | Repo Hygiene: remove dead code & unused deps | repo-quality gap | — | **Done** |
| 002 | Portfolio: honest, data-driven, no dead UI | US-10 | — | **Done** |
| 003 | Routing Resilience: 404 catch-all + ErrorBoundary | context gap #10 | — | Planned |
| 004 | Component & Routing Test Coverage | PRD Testing Decision | 002, 003 | Planned |

Sequencing: `001 → 002 → 003 → 004`. **004 must run last** (it tests the final shapes of
002 and 003). 001–003 touch disjoint files and have no inter-dependencies.

---

## Feature 001 — Repo Hygiene

- **ID:** 001
- **Name:** Remove dead code & unused dependencies
- **Goal:** Eliminate unused deps and dead files so the repo is honest and the build stays clean.
- **Scope:** `package.json` deps; `src/logo.svg`, `src/components/Login.css`, `src/data/mockData.js`;
  unused `fitnessData.js` exports.
- **Dependencies:** none.
- **Inputs:** `package.json`, `src/data/fitnessData.js`, `src/data/mockData.js`, dead files.
- **Outputs:** cleaned deps + files; `fitnessData.js` exports only what app code uses.
- **Acceptance criteria:** zero `src/` imports of removed modules/files; `npm test` passes; `npm run build` passes (after `npm ci`).
- **Closes:** repo-quality gap from reconciliation.

## Feature 002 — Portfolio Honesty & Data-Driven Completion

- **ID:** 002
- **Name:** Portfolio: honest, data-driven, no dead UI
- **Goal:** Close US-10 (supervisor acknowledgment + project showcase) with real content and working UI.
- **Scope:** `src/components/Portfolio.js` — real supervisor name, remove hardcoded fake stats, real sim count, remove/de-functionalize dead buttons and dead nav items.
- **Dependencies:** none.
- **Inputs:** `src/components/Portfolio.js`, `useSimulation`/`useAuth`.
- **Outputs:** honest Portfolio + `Portfolio.test.js`.
- **Acceptance criteria:** no hardcoded fake stats; supervisor shows "Ts Dr. Lim Seng Poh"; sim count is real; no dead/non-functional buttons or nav entries.
- **Closes:** US-10.

## Feature 003 — Routing Resilience (404 + ErrorBoundary)

- **ID:** 003
- **Name:** Routing resilience: 404 catch-all + ErrorBoundary
- **Goal:** Unknown `/api/*` renders NotFound (not blank); render errors show a fallback.
- **Scope:** new `NotFound.js`, `ErrorBoundary.js`; catch-all `*` route and ErrorBoundary wrap in `App.js`.
- **Dependencies:** none.
- **Inputs:** `src/App.js`, new components.
- **Outputs:** NotFound + ErrorBoundary + light render tests.
- **Acceptance criteria:** unknown `/api/*` renders NotFound; thrown render error shows fallback, not blank screen.
- **Closes:** context gap #10 (not a PRD user story).

## Feature 004 — Component & Routing Test Coverage

- **ID:** 004
- **Name:** Component & routing test coverage
- **Goal:** Satisfy the PRD Testing Decision ("each component render path should have a focused test").
- **Scope:** render/behaviour tests for every page component; real App routing test; upgrade `App.test.js`.
- **Dependencies:** 002, 003.
- **Inputs:** final page components + `App.js`.
- **Outputs:** `src/components/__tests__/*`, expanded `App.test.js`.
- **Acceptance criteria:** every page component has a focused test; App routing test covers auth redirect + protected render; `npm test` passes.
- **Closes:** PRD Testing Decision acceptance criterion.
