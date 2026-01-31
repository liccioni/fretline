import type { Session } from "../models/session";
import { DEFAULT_BEATS_PER_BAR } from "../models/defaults";

const STORAGE_KEY = "fretline:sessions";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const hasString = (value: unknown): value is string => typeof value === "string";

const hasNumber = (value: unknown): value is number => typeof value === "number";

const normalizeDrill = (value: unknown) => {
  if (!isRecord(value)) {
    return null;
  }

  const { id, type, name, durationSeconds, metronome } = value;
  if (!hasString(id) || !hasString(type) || !hasString(name) || !hasNumber(durationSeconds)) {
    return null;
  }
  if (!isRecord(metronome) || !hasNumber(metronome.bpm)) {
    return null;
  }

  const beatsPerBar =
    typeof metronome.beatsPerBar === "number"
      ? metronome.beatsPerBar
      : DEFAULT_BEATS_PER_BAR;

  return {
    ...value,
    metronome: {
      ...metronome,
      beatsPerBar,
    },
  };
};

const normalizeSession = (value: unknown): Session | null => {
  if (!isRecord(value)) {
    return null;
  }

  const { id, name, drills } = value;
  if (!hasString(id) || !hasString(name) || !Array.isArray(drills)) {
    return null;
  }

  const normalizedDrills = drills.map((drill) => normalizeDrill(drill));
  if (normalizedDrills.some((drill) => drill === null)) {
    return null;
  }

  return {
    id,
    name,
    drills: normalizedDrills as NonNullable<typeof normalizedDrills[number]>[],
  } as Session;
};

export const loadSessions = (): Session[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => normalizeSession(item))
      .filter((session): session is Session => session !== null);
  } catch {
    return [];
  }
};

export const saveSessions = (sessions: Session[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Ignore write errors to avoid crashing.
  }
};
