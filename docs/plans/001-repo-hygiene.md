# Feature 001 — Repo Hygiene: Remove Dead Code & Unused Dependencies

**ID:** 001
**Status:** Done
**Depends on:** none
**Closes:** repo-quality gap from reconciliation (not a PRD user story)

## Objective

Remove unused dependencies and dead files so the repository is honest, the
production build stays clean, and future agents don't waste time reconciling
files that ship nowhere.

## Context

Reconciliation found:
- `socket.io-client`, `date-fns`, `react-day-picker` are in `package.json` but have
  **zero imports** in `src/` (only `react-katex` of the "extra" deps is used).
- `src/logo.svg` and `src/components/Login.css` are unreferenced.
- `src/data/mockData.js` is **dead** — only a comment in `src/context/SimulationContext.js:48`
  mentions `mockSimulations`; no app code imports it. The PRD's "mock data as the data layer"
  decision is obsolete (real `/api/v1` is wired).
- `src/data/fitnessData.js` exports several helpers used **only by tests**, not app code:
  `getCrossoverMethods`, `getSelectionMethods`, `getAllFunctionData`, `getFunctionDataByCrossover`,
  `fitnessDataByCrossover`, `fitnessData`, `getFunctionData`.

> **Demo-data decision:** `fitnessData.js` is the **intentional frontend-only demo/reference dataset**
> (backend serves no demo endpoint). This feature only prunes **dead helper exports** and **test
> cases** from it — it must NOT delete the dataset itself or `getFunctionNames` /
> `getFunctionDataByCrossoverAndSelection` / `crossoverMethods` / `selectionMethods` (all used by
> Dashboard/Simulator/CrossoverNavigation). `mockData.js` is a separate dead file unrelated to the
> demo dataset.

## Requirements

1. Remove `socket.io-client`, `date-fns`, `react-day-picker` from `package.json`
   (both `dependencies` and `package-lock.json`).
2. Delete `src/logo.svg`, `src/components/Login.css`, `src/data/mockData.js`.
3. Remove unused `fitnessData.js` exports and any test cases that only exercised them.
4. Keep every export actually imported by app code.

## Technical design

- **Verify-then-remove:** before deleting anything, run
  `grep -rn "socket.io-client\|date-fns\|react-day-picker\|logo.svg\|Login.css\|mockData\|mockSimulations" src` and confirm zero real imports (ignore comments).
- For `fitnessData.js`: grep each candidate export
  (`getCrossoverMethods|getSelectionMethods|getAllFunctionData|getFunctionDataByCrossover|fitnessDataByCrossover|fitnessData|getFunctionData`)
  across `src/`. If an export is used only in `src/data/__tests__/fitnessData.test.js`, remove the
  export and its corresponding `test(...)` block. **Do not** remove
  `getFunctionNames`, `getFunctionDataByCrossoverAndSelection`, `crossoverMethods`, `selectionMethods`
  (used by `Dashboard.js`, `Simulator.js`, `CrossoverNavigation.js`).
- Update `package.json` via `npm uninstall <pkg> --save` (also updates the lockfile), or edit
  `package.json` and run `npm install` to refresh the lockfile.
- Update `docs/ARCHITECTURE.md` and `docs/CONTEXT.md` "Unused deps" notes to reflect the removals.

## Files / components affected

- **Touches (existing):**
  - `package.json`, `package-lock.json`
  - `src/data/fitnessData.js` (remove unused exports)
  - `src/data/__tests__/fitnessData.test.js` (remove orphan test cases)
  - `docs/ARCHITECTURE.md`, `docs/CONTEXT.md` (note updates)
- **Deletes:**
  - `src/logo.svg`, `src/components/Login.css`, `src/data/mockData.js`
- **Creates:** none

## API changes

None.

## Tests

- Run the full suite to confirm nothing depended on removed code:
  `npm test`
- Specific checks (no new test file needed; existing tests must still pass):
  - `src/context/__tests__/SimulationContext.test.js` still green (it mocks `api.js`, does not use `mockData`).
  - `src/data/__tests__/fitnessData.test.js` still green after removing orphan cases.
- Verify the build compiles (requires a healthy `node_modules` — run `npm ci` first if the
  `language-subtag-registry` issue persists):
  `npm run build`

## Edge cases

- If any of the "unused" exports is actually imported somewhere, keep it and note the discrepancy.
- `package-lock.json` must stay consistent — prefer `npm uninstall` over hand-editing.

## Acceptance criteria

- Zero `src/` imports of the removed deps/files.
- `fitnessData.js` exports only what app code imports.
- `npm test` passes.
- `npm run build` passes (after `npm ci`).

## Out of scope

- Removing `react-katex`, `chart.js`, or any dependency that IS used.
- Migrating off CRA, or touching `App.css` (still imported by `App.js`).
