# Task 0002 — Session runner MVP

## Goal
Implement a SessionRunner that runs a session made of Generic drills using `durationSeconds`, including countdown, metronome click, automatic transitions, and a session complete state.

## Scope
- In scope:
  - Runtime flow: 3-second countdown, then sequential drills.
  - Automatic drill transitions and session completion state.
  - Metronome click at drill BPM with accented downbeat.
  - Works for Generic drills only (other types can display as generic for now).
- Out of scope:
  - Session builder or editing.
  - Persistence.
  - Advanced UI polish beyond basic runner display.

## Acceptance Criteria
- [ ] Runner starts only after explicit user action.
- [ ] Countdown is visible for 3 seconds before the first drill.
- [ ] Remaining time updates per second and transitions are automatic.
- [ ] Metronome click aligns with BPM and downbeat is accented.
- [ ] Session ends in a clear complete state.

## Files
- Create:
  - src/runtime/sessionRunner.ts (or equivalent)
  - src/screens/SessionRunner.tsx (or equivalent)
  - src/audio/metronome.ts (or equivalent)
- Modify:
  - src/App.tsx (or equivalent routing/wiring)

## Constraints
- Do not add new dependencies
- Do not refactor unrelated code
- Keep tests passing (`npm test`)
