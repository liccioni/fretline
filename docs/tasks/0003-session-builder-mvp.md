# Task 0003 — Session builder MVP (in-memory, Generic drills)

## Goal
Implement the Session Builder screen to construct a Session in memory, supporting adding, editing, reordering, and removing drills. MVP supports **Generic drills only**.

## Scope
- In scope:
  - A **Session Builder** screen that constructs a `Session` object in memory.
  - Add drills (Generic only), edit drills, reorder drills, remove drills.
  - Show total session duration as the sum of drill durations.
  - Inline, blocking validation: invalid drills cannot be added/saved.
  - Defaults applied automatically:
    - `metronome.beatsPerBar` defaults to 4 if not specified.
- Out of scope:
  - Persistence (localStorage) or any storage layer.
  - Session List screen (create/edit/delete multiple sessions).
  - Supporting non-Generic drill types beyond showing them as disabled/unavailable.
  - UI polish beyond basic functional layout.

## Acceptance Criteria
- [ ] User can set Session name.
- [ ] User can add a Generic drill by providing:
      - name
      - durationSeconds
      - metronome.bpm
      - metronome.beatsPerBar (defaults to 4 if omitted)
- [ ] User can edit an existing drill’s fields.
- [ ] User can reorder drills (up/down controls acceptable).
- [ ] User can remove drills.
- [ ] Total session duration is displayed as the sum of drill durations.
- [ ] Invalid drills are blocked with inline validation (at minimum):
      - Session name non-empty
      - Drill name non-empty
      - durationSeconds > 0
      - bpm > 0
      - beatsPerBar > 0 (or defaulted to 4)
- [ ] Builder produces a valid in-memory `Session` object and exposes it via a callback prop (e.g., `onRun(session)`), without implementing navigation.

## Files
- Create:
  - `src/screens/SessionBuilder.tsx`
  - `src/components/DrillEditor.tsx` (or `src/components/GenericDrillForm.tsx`)
  - `src/utils/ids.ts` (simple id generator helper) OR inline id generation in screen (no deps)
- Modify:
  - `src/App.tsx` to render SessionBuilder as the main view.

## Implementation Notes (Constraints)
- Do not add new dependencies.
- Do not refactor unrelated code.
- Keep changes minimal and deterministic.
- Drill type selection UI may exist but only “Generic” is enabled; other types are shown disabled or omitted.
- Use existing domain types (`Session`, `BaseDrill`/`GenericDrill`, metronome fields).
- Use `DEFAULT_BEATS_PER_BAR` for default handling.
- Drag-and-drop reordering is out of scope; use simple up/down controls.

## Definition of Done
- All Acceptance Criteria checked.
- No features beyond v1 spec.
