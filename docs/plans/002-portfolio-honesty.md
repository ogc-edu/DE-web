# Feature 002 — Portfolio: Honest, Data-Driven, No Dead UI

**ID:** 002
**Status:** Done
**Depends on:** none
**Closes:** PRD User Story 10 (supervisor acknowledgment + project showcase)

## Objective

Make the Portfolio page an honest, data-driven academic showcase: real supervisor
name, no hardcoded fake statistics, simulation count derived from real data, and
no dead or non-functional buttons / navigation items.

## Context

`src/components/Portfolio.js` currently:
- Hardcodes `Dr. [Supervisor Name]`, `Department of [Department Name]`,
  `[University/Organization Name]` — the PRD intent (noted in `docs/CONTEXT.md`)
  is **"Ts Dr. Lim Seng Poh"**.
- Shows fake stats: `Rank #12`, `Impact High`, `Premium Researcher`,
  `3 new simulation results`, `Last updated: April 13, 2026`.
- Simulation count uses `user?.simulationCount || simulations.length || 42` — a
  fabricated `42` fallback.
- Has dead controls: `Enable 2FA`, `View Alerts`, and non-functional sidebar nav
  items (`Security & Privacy`, `Notification Settings`, `Subscription Plan`, `Preferences`).

## Requirements

1. Show the real supervisor name **"Dr Lim Seng Poh"** and the real university
   **"Universiti Tunku Abdul Rahman"** in the Supervisor Acknowledgment card
   (replace the `Dr. [Supervisor Name]`, `[Department Name]`, `[University/Organization Name]`
   placeholders). Department: leave unset / omit if no specific department is provided — do not
   invent one. *(Recorded decision, 2026: name = Dr Lim Seng Poh, university = Universiti Tunku
   Abdul Rahman. Note: an earlier `docs/CONTEXT.md` note wrote "Ts Dr. Lim Seng Poh" — if the
   "Ts" title is also desired it is a trivial change; the approved value here omits it.)*
2. Remove all hardcoded fake statistics (Rank, Impact, Premium Researcher badge,
   "3 new simulation results", "Last updated: ...").
3. Derive the simulation count from real data only: drop the `|| 42` fallback so it
   reflects `simulations.length` (from `useSimulation`).
4. Remove or de-functionalize dead buttons (`Enable 2FA`, `View Alerts`) and dead
   sidebar nav items. Prefer removing the fake Security Checkup / Notifications
   cards (or replace with honest "not available" content) so no control implies an
   action that doesn't exist.
5. Keep the working profile-edit + avatar-upload flows intact.

## Technical design

- Edit `src/components/Portfolio.js` in place (default-export `.js`, relative imports —
  existing conventions).
- Keep the "Supervisor Acknowledgment" and "About This Project" cards (they satisfy US-10).
- `simulationCount = simulations.length` (from `useSimulation`), no `|| 42`.
- Remove `Enable 2FA` / `View Alerts` buttons and their cards, or convert them to
  non-interactive informational content. Remove the dead sidebar nav list.
- Keep `updateUser`, avatar upload, and profile save unchanged.

## Files / components affected

- **Touches (existing):** `src/components/Portfolio.js`
- **Creates:** `src/components/__tests__/Portfolio.test.js` (render test)
- **Does NOT touch:** `AccountSettings.js`, `Layout.js`, `App.js`

## API changes

None. (`useSimulation.simulations` and `useAuth.user` already provide the data.)

## Tests

- **New file:** `src/components/__tests__/Portfolio.test.js`
  - Renders the real supervisor name `Dr Lim Seng Poh` and `Universiti Tunku Abdul Rahman`.
  - Does **not** render hardcoded fake stats (assert absence of `#12`, `Impact High`,
    `Premium Researcher`).
  - Shows the real simulation count when `simulations.length` is provided (mock
    `useSimulation`); does not fall back to `42`.
  - Does not render `Enable 2FA` / `View Alerts` buttons.
- Follow the existing mock pattern used in `ImportData.test.js` / `AdminQueue.test.js`:
  `jest.mock("../../context/AuthContext", () => ({ useAuth: () => mockAuth }))` and
  `jest.mock("../../context/SimulationContext", () => ({ useSimulation: () => mockSim }))`.
  Mock `Layout` is not required if `Portfolio` renders inside `<Layout>` — verify the
  component tree renders without real router/API calls (you may need to mock
  `react-router-dom` via `src/__mocks__/react-router-dom.js`, which already exists).
- **Verify command:** `npm test`
- Also run the full suite to confirm no regressions.

## Edge cases

- If `simulations` is `[]` (no runs), the count should render `0`, not `42`.
- If exact department/university is unknown, remove bracketed placeholders instead of
  shipping fake text — do not invent values.

## Acceptance criteria

- Supervisor shows `Dr Lim Seng Poh` and `Universiti Tunku Abdul Rahman` (no `[placeholder]` text).
- No hardcoded fake stats render.
- Simulation count reflects real `simulations.length` (no `|| 42`).
- No dead/non-functional buttons or nav items remain.
- Profile-edit and avatar-upload still work.
- `npm test` passes, including the new `Portfolio.test.js`.

## Out of scope

- Rebuilding Portfolio as a different page structure.
- Adding 2FA / notifications features (not in PRD).
- Changing `AccountSettings` (duplicate profile editing lives there and is out of scope here).
