import type {
  Drill,
  DrillType,
  GenericDrill,
  NoteLocationDrill,
  SpiderDrill,
  TriadLocationDrill,
} from "../models/drills";
import { DEFAULT_BEATS_PER_BAR } from "../models/defaults";
import { createId } from "./ids";

interface DrillBaseOverrides {
  name?: string;
  durationSeconds?: number;
  metronome?: {
    bpm?: number;
    beatsPerBar?: number;
  };
}

const buildBase = (id: string, overrides?: DrillBaseOverrides) => {
  const metronome = {
    bpm: overrides?.metronome?.bpm ?? 80,
    beatsPerBar:
      overrides?.metronome?.beatsPerBar ?? DEFAULT_BEATS_PER_BAR,
  };

  return {
    id,
    name: overrides?.name ?? "New Drill",
    durationSeconds: overrides?.durationSeconds ?? 60,
    metronome,
  };
};

export const createDrill = (type: DrillType): Drill => {
  const base = buildBase(createId("drill"));

  switch (type) {
    case "note-location": {
      const drill: NoteLocationDrill = {
        ...base,
        type: "note-location",
        string: 1,
        note: "C",
        fretRange: [1, 4],
      };
      return drill;
    }
    case "triad-location": {
      const drill: TriadLocationDrill = {
        ...base,
        type: "triad-location",
        triadType: "major",
        stringSet: [1, 2, 3],
        key: "C",
      };
      return drill;
    }
    case "spider": {
      const drill: SpiderDrill = {
        ...base,
        type: "spider",
        pattern: "1234",
        fretRange: [1, 4],
      };
      return drill;
    }
    case "generic":
    default: {
      const drill: GenericDrill = {
        ...base,
        type: "generic",
      };
      return drill;
    }
  }
};

const getBaseOverrides = (drill: Drill): DrillBaseOverrides => ({
  name: drill.name,
  durationSeconds: drill.durationSeconds,
  metronome: {
    bpm: drill.metronome.bpm,
    beatsPerBar: drill.metronome.beatsPerBar ?? DEFAULT_BEATS_PER_BAR,
  },
});

export const changeDrillType = (
  existing: Drill,
  nextType: DrillType
): Drill => {
  const base = buildBase(existing.id, getBaseOverrides(existing));

  switch (nextType) {
    case "note-location": {
      const drill: NoteLocationDrill = {
        ...base,
        type: "note-location",
        string: 1,
        note: "C",
        fretRange: [1, 4],
      };
      return drill;
    }
    case "triad-location": {
      const drill: TriadLocationDrill = {
        ...base,
        type: "triad-location",
        triadType: "major",
        stringSet: [1, 2, 3],
        key: "C",
      };
      return drill;
    }
    case "spider": {
      const drill: SpiderDrill = {
        ...base,
        type: "spider",
        pattern: "1234",
        fretRange: [1, 4],
      };
      return drill;
    }
    case "generic":
    default: {
      const drill: GenericDrill = {
        ...base,
        type: "generic",
      };
      return drill;
    }
  }
};
