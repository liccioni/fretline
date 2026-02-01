import { describe, expect, it } from "vitest";
import type { Drill } from "../models/drills";
import { DEFAULT_BEATS_PER_BAR } from "../models/defaults";
import { changeDrillType, createDrill } from "./drills";

describe("createDrill", () => {
  it("creates a valid generic drill", () => {
    const drill = createDrill("generic");
    expect(drill.type).toBe("generic");
    expect(drill.id).toBeTruthy();
    expect(drill.name).toBeTruthy();
    expect(drill.durationSeconds).toBeGreaterThan(0);
    expect(drill.metronome.bpm).toBeGreaterThan(0);
    expect(drill.metronome.beatsPerBar).toBe(DEFAULT_BEATS_PER_BAR);
  });

  it("creates a valid note-location drill", () => {
    const drill = createDrill("note-location");
    expect(drill.type).toBe("note-location");
    expect(drill.string).toBeGreaterThanOrEqual(1);
    expect(drill.string).toBeLessThanOrEqual(6);
    expect(drill.note).toMatch(/^[A-G](#|b)?$/);
    expect(drill.fretRange).toHaveLength(2);
  });

  it("creates a valid triad-location drill", () => {
    const drill = createDrill("triad-location");
    expect(drill.type).toBe("triad-location");
    expect(drill.triadType).toBeTruthy();
    expect(drill.stringSet.length).toBeGreaterThan(0);
    expect(drill.key).toBeTruthy();
  });

  it("creates a valid spider drill", () => {
    const drill = createDrill("spider");
    expect(drill.type).toBe("spider");
    expect(drill.pattern).toBeTruthy();
    expect(drill.fretRange).toHaveLength(2);
  });
});

describe("changeDrillType", () => {
  it("preserves base fields when switching types", () => {
    const existing: Drill = {
      id: "drill-123",
      type: "note-location",
      name: "Custom",
      durationSeconds: 120,
      metronome: { bpm: 95, beatsPerBar: 3 },
      string: 2,
      note: "D",
      fretRange: [3, 7],
    };

    const changed = changeDrillType(existing, "triad-location");

    expect(changed.id).toBe(existing.id);
    expect(changed.name).toBe(existing.name);
    expect(changed.durationSeconds).toBe(existing.durationSeconds);
    expect(changed.metronome.bpm).toBe(existing.metronome.bpm);
    expect(changed.metronome.beatsPerBar).toBe(existing.metronome.beatsPerBar);
  });

  it("resets type-specific fields on switch", () => {
    const existing: Drill = {
      id: "drill-456",
      type: "note-location",
      name: "Note",
      durationSeconds: 60,
      metronome: { bpm: 90, beatsPerBar: 4 },
      string: 1,
      note: "C",
      fretRange: [1, 4],
    };

    const changed = changeDrillType(existing, "spider");
    expect(changed.type).toBe("spider");
    expect("note" in changed).toBe(false);
    expect("string" in changed).toBe(false);
    expect(changed.pattern).toBeTruthy();
    expect(changed.fretRange).toHaveLength(2);
  });

  it("removes triad-specific fields when switching to generic", () => {
    const existing: Drill = {
      id: "drill-789",
      type: "triad-location",
      name: "Triad",
      durationSeconds: 90,
      metronome: { bpm: 110, beatsPerBar: 4 },
      triadType: "minor",
      stringSet: [2, 3, 4],
      key: "A",
    };

    const changed = changeDrillType(existing, "generic");
    expect(changed.type).toBe("generic");
    expect("triadType" in changed).toBe(false);
    expect("stringSet" in changed).toBe(false);
    expect("key" in changed).toBe(false);
  });
});
