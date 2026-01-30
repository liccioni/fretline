# Guitar Practice App – Specification (v1)

## Purpose

Build a **focused, no‑nonsense guitar practice tool** that lets a single user design and run timed practice sessions made of structured drills. The app is meant to be used daily during real guitar practice, hands‑free once a session starts.

This spec defines the **minimum viable product** to be completed within 30 days.

---

## Design Philosophy

* Practice first, software second
* Explicit > clever
* Deterministic behavior (no surprises)
* Data‑driven drills
* Zero fluff

---

## Non‑Goals (Strict)

The following are explicitly **out of scope** for this version:

* User accounts or authentication
* Cloud sync or persistence beyond local storage
* Social features
* AI‑generated practice plans
* Gamification (points, streaks, badges)
* Recording or audio analysis
* MIDI / pitch detection
* Mobile app (web only)

If it’s not listed elsewhere in this document, it does not exist.

---

## Core Concepts

### Session

A **Session** is an ordered list of drills run sequentially.

**Properties**:

* `id: string`
* `name: string`
* `drills: Drill[]` (ordered)

**Rules**:

* Session duration is derived from drills
* Sessions run start‑to‑finish without user interaction

---

### Drill (Base Type)

All drills share the same base shape.

**Properties**:

* `id: string`
* `type: DrillType`
* `name: string`
* `durationSeconds: number`
* `metronome:`

  * `bpm: number`
  * `beatsPerBar: number` (default: 4)

**Rules**:

* The runner does not interpret drill meaning
* Drill logic is purely data
* UI decides how to display each drill type

---

## Drill Types

### 1. Generic Drill

Used for open‑ended technique practice.

**Additional properties**: none

**Examples**:

* Alternate picking
* Scale sequences
* String skipping

---

### 2. Note Location Drill

Used for fretboard note memorization.

**Additional properties**:

* `string: number` (1–6)
* `note: string` (A–G, with # or b)
* `fretRange: [number, number]`

---

### 3. Triad Location Drill

Used for triad shapes across the neck.

**Additional properties**:

* `triadType: "major" | "minor" | "diminished" | "augmented"`
* `stringSet: number[]` (e.g. [1,2,3])
* `key: string`

---

### 4. Spider / Finger Independence Drill

Used for mechanical finger control.

**Additional properties**:

* `pattern: string` (e.g. "1234")
* `fretRange: [number, number]`

---

## Screens

### Session List

* View existing sessions
* Create new session
* Edit or delete session

---

### Session Builder

Used to construct a session.

**Capabilities**:

* Add drills
* Select drill type
* Set name, duration, BPM
* Reorder drills
* Remove drills

**Rules**:

* Session duration is shown as sum of drills
* Invalid drills cannot be added

---

### Drill Editor

Edits a single drill.

**Behavior**:

* Form fields change based on drill type
* Defaults are applied automatically
* Validation is inline and blocking

---

### Session Runner

Used during practice.

**Behavior**:

* Fullscreen or distraction‑free view
* No required interaction after start
* Automatically advances drills

**Displays**:

* Current drill name
* Remaining time (seconds)
* BPM
* Beat indicator
* Simple progress bar

**Audio**:

* Metronome click
* Accented downbeat

---

## Runtime Rules

* Session starts only after explicit user action
* Countdown before first drill (3 seconds)
* Drill transitions are automatic
* Runner must never crash mid‑session

---

## Persistence

* Sessions stored locally (e.g. localStorage)
* No backend

---

## Acceptance Criteria

* User can build a 20, 30, or 60 minute session
* Multiple drill types can coexist in one session
* Metronome changes per drill
* Session completes without user input
* App is usable while holding a guitar

---

## Definition of Done (v1)

* Sessions can be created, edited, deleted
* Session runner works reliably
* All drill types defined here are supported
* No additional features beyond this spec

