# Task 0004 — Builder → Runner flow (App orchestration, in-memory)

## Goal
Wire the in-memory Session Builder to the Session Runner so that clicking “Run” launches the runner with the built Session, without persistence.

## Scope
- In scope:
  - App-level orchestration between Session Builder and Session Runner.
  - `SessionBuilder` passes a valid in-memory `Session` via `onRun(session)`.
  - `App` switches view from Builder → Runner when a session is provided.
  - Provide an explicit way to return to the Builder *after* the session completes (no mid-session interruption).
- Out of scope:
  - Persistence (localStorage).
  - Session List screen (managing multiple saved sessions).
  - Routing libraries / new dependencies.
  - Editing session while runner is active.
  - Any new drill types beyond what runner already supports.

## Acceptance Criteria
- [x] From the Builder, clicking “Run” with a valid Session shows the Session Runner using that Session.
- [x] Runner still starts only after explicit user action (Start button) and still shows the 3-second countdown.
- [x] While a session is running, the app does not allow returning to the Builder (no mid-session interruption).
- [x] After the runner reaches its completed state, the user can explicitly return to the Builder.
- [x] No persistence is added; the built Session exists only in memory.

## Files
- Modify:
  - `src/App.tsx` to own in-memory view state:
    - When no active session: render `SessionBuilder` and pass `onRun(session)` to set active session.
    - When active session: render `SessionRunnerScreen` with that session.
  - `src/screens/SessionRunner.tsx` to accept an optional callback for exiting after completion:
    - e.g. `onExit?: () => void`
    - Show an “Back to Builder” button ONLY when phase is `completed`, and call `onExit`.

## Constraints
- Do not add new dependencies.
- Do not refactor unrelated code.
- Keep behavior deterministic and minimal.

## Definition of Done
- All Acceptance Criteria checked.
- No features beyond v1 spec.

## Completion
- Status: Complete
- Completed date: 2026-01-30
- Summary: App now orchestrates in-memory Builder → Runner flow; Runner exposes Back-to-Builder only after completion.
