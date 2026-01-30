export type DrillType = "generic" | "note-location" | "triad-location" | "spider";

export interface MetronomeSettings {
  bpm: number;
  beatsPerBar: number;
}

export interface BaseDrill {
  id: string;
  type: DrillType;
  name: string;
  durationSeconds: number;
  metronome: MetronomeSettings;
}

export interface GenericDrill extends BaseDrill {
  type: "generic";
}

export interface NoteLocationDrill extends BaseDrill {
  type: "note-location";
  string: number;
  note: string;
  fretRange: [number, number];
}

export type TriadType = "major" | "minor" | "diminished" | "augmented";

export interface TriadLocationDrill extends BaseDrill {
  type: "triad-location";
  triadType: TriadType;
  stringSet: number[];
  key: string;
}

export interface SpiderDrill extends BaseDrill {
  type: "spider";
  pattern: string;
  fretRange: [number, number];
}

export type Drill =
  | GenericDrill
  | NoteLocationDrill
  | TriadLocationDrill
  | SpiderDrill;
