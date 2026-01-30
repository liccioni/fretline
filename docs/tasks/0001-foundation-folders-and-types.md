# Task 0001 — Foundation folders and types

## Goal
Create the initial `src` folder structure and TypeScript domain types per the spec.

## Scope
- In scope:
  - Create core `src` subfolders for models/types, storage, screens, components, runtime, audio, utils.
  - Define Session and Drill types (base + Generic, Note Location, Triad Location, Spider) with metronome fields.
  - Define `DrillType` union and any supporting enums/aliases needed by the spec.
- Out of scope:
  - UI components.
  - Persistence implementation.
  - Runtime runner logic or audio.

## Acceptance Criteria
- [x] Folder structure exists under `src/` to support upcoming features.
- [x] Type definitions match the spec fields and constraints.
- [x] `beatsPerBar` default handling is specified (e.g., in a factory or UI defaults).

## Files
- Create:
  - src/models/
  - src/storage/
  - src/screens/
  - src/components/
  - src/runtime/
  - src/audio/
  - src/utils/
  - src/models/drills.ts (or equivalent)
  - src/models/session.ts (or equivalent)
- Modify:
  - None

## Constraints
- Do not add new dependencies
- Do not refactor unrelated code
- Keep tests passing (`npm test`)

## Completion

- Status: Complete
- Completed date: 2026-01-30
- Summary: Folder structure created, drill/session TypeScript models added, DEFAULT_BEATS_PER_BAR defined.
