# Task 0005 — Session List + localStorage persistence (Option B)

## Context
The app needs a Session List screen and local persistence so sessions survive reloads. This is required by the spec (Sessions stored locally, Session List screen exists).

## Goal
Implement a minimal Session List screen and localStorage persistence for sessions, with a storage format that supports the full Drill union (Option B).

## Scope
- In scope:
  - Session List screen:
    - View existing sessions
    - Create new session
    - Edit session
    - Delete session
  - localStorage persistence for sessions
  - Safe load behavior (must not crash if storage is empty/corrupt)
  - Option B persistence requirement:
    - Storage format must support the full Drill union (Generic, Note Location, Triad Location, Spider)
    - Even though Builder can only author Generic drills for now, persistence must be capable of round-tripping any drill type
  - Integration with existing Builder → Runner flow (Task 0004), without adding routing libraries
- Out of scope:
  - Any persistence beyond localStorage (no backend/cloud)
  - Routing libraries
  - Mid-session save/resume/interruption
  - UI polish, animations, styling beyond minimal functional UI
  - Adding Builder support for non-Generic drill authoring

## Requirements / Behavior
- Storage keys:
  - Define a stable localStorage key for sessions (documented in code)
  - Use a single stable key: "fretline:sessions"
- Stored shape:
  - Persist an array of `Session` objects
  - Drill payloads must support the full Drill union (Option B)
- CRUD semantics:
  - Create: from Session List → Builder (new session)
  - Edit: from Session List → Builder (existing session)
  - Delete: from Session List (no confirmation unless a precedent already exists)
  - Delete is disabled or ignored while a session is actively running (no mid-session interruption)
- Loading semantics:
  - On app start, load sessions from localStorage
  - If missing: start with an empty list
  - If malformed: reset to empty safely and do not crash
- Save semantics:
  - On session save in Builder, persist the updated list
- Integration points:
  - Must work with the Task 0004 builder → runner flow, without routing libraries

## Acceptance Criteria
- [ ] Sessions persist across reloads using localStorage
- [ ] Session List shows all saved sessions
- [ ] User can create, edit, delete sessions from Session List
- [ ] Option B: stored data structure can represent all drill types in the spec (full union)
- [ ] App does not crash when localStorage is empty or contains malformed/unexpected data
- [ ] No routing libraries introduced
- [ ] Runner still runs start-to-finish without user interaction once started

## Implementation Notes
- Prefer a small storage module (e.g., `src/storage/sessions.ts`) if consistent with repo patterns.
- Parsing/validation should be minimal, deterministic, and safe (no dependencies).

## Deliverables
- The new markdown task file in `docs/tasks/`
