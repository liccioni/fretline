import type {
  BaseDrill,
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

type BaseFields = Omit<BaseDrill, "type">;

// docs/spec-v1.md: beatsPerBar default is 4 (Drill base type)
const DEFAULT_BPM = 80; // docs/spec-v1.md does not define default bpm
const DEFAULT_DURATION_SECONDS = 60; // docs/spec-v1.md does not define default duration
const DEFAULT_NAME = "New Drill"; // docs/spec-v1.md does not define default drill name
const DEFAULT_NOTE = "C"; // docs/spec-v1.md does not define default note
const DEFAULT_STRING = 1; // docs/spec-v1.md does not define default string
const DEFAULT_FRET_RANGE: [number, number] = [1, 4]; // docs/spec-v1.md does not define default fret range
const DEFAULT_PATTERN = "1234"; // docs/spec-v1.md does not define default spider pattern
const DEFAULT_TRIAD_TYPE: TriadLocationDrill["triadType"] = "major"; // docs/spec-v1.md does not define default triad type
const DEFAULT_STRING_SET: number[] = [1, 2, 3]; // docs/spec-v1.md does not define default string set
const DEFAULT_KEY = "C"; // docs/spec-v1.md does not define default key

const defaultFretRange = (): [number, number] =>
  [...DEFAULT_FRET_RANGE] as [number, number];

const assertNever = (value: never): never => {
  throw new Error(`Unhandled drill type: ${String(value)}`);
};

const buildBase = (id: string, overrides?: DrillBaseOverrides): BaseFields => {
  const metronome = {
    bpm: overrides?.metronome?.bpm ?? DEFAULT_BPM,
    beatsPerBar:
      overrides?.metronome?.beatsPerBar ?? DEFAULT_BEATS_PER_BAR,
  };

  return {
    id,
    name: overrides?.name ?? DEFAULT_NAME,
    durationSeconds: overrides?.durationSeconds ?? DEFAULT_DURATION_SECONDS,
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
        string: DEFAULT_STRING,
        note: DEFAULT_NOTE,
        fretRange: defaultFretRange(),
      };
      return drill;
    }
    case "triad-location": {
      const drill: TriadLocationDrill = {
        ...base,
        type: "triad-location",
        triadType: DEFAULT_TRIAD_TYPE,
        stringSet: [...DEFAULT_STRING_SET],
        key: DEFAULT_KEY,
      };
      return drill;
    }
    case "spider": {
      const drill: SpiderDrill = {
        ...base,
        type: "spider",
        pattern: DEFAULT_PATTERN,
        fretRange: defaultFretRange(),
      };
      return drill;
    }
    case "generic": {
      const drill: GenericDrill = {
        ...base,
        type: "generic",
      };
      return drill;
    }
    default:
      return assertNever(type);
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
        string: DEFAULT_STRING,
        note: DEFAULT_NOTE,
        fretRange: defaultFretRange(),
      };
      return drill;
    }
    case "triad-location": {
      const drill: TriadLocationDrill = {
        ...base,
        type: "triad-location",
        triadType: DEFAULT_TRIAD_TYPE,
        stringSet: [...DEFAULT_STRING_SET],
        key: DEFAULT_KEY,
      };
      return drill;
    }
    case "spider": {
      const drill: SpiderDrill = {
        ...base,
        type: "spider",
        pattern: DEFAULT_PATTERN,
        fretRange: defaultFretRange(),
      };
      return drill;
    }
    case "generic": {
      const drill: GenericDrill = {
        ...base,
        type: "generic",
      };
      return drill;
    }
    default:
      return assertNever(nextType);
  }
};
