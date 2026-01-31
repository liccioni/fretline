import type { Drill, DrillType, TriadType } from "../models/drills";
import { DEFAULT_BEATS_PER_BAR } from "../models/defaults";

export interface DrillEditorErrors {
  type?: string;
  name?: string;
  durationSeconds?: string;
  bpm?: string;
  beatsPerBar?: string;
  string?: string;
  note?: string;
  fretRange?: string;
  triadType?: string;
  stringSet?: string;
  key?: string;
  pattern?: string;
}

interface DrillEditorProps {
  drill: Drill;
  errors: DrillEditorErrors;
  onChange: (next: Drill) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

const parseNumberInput = (value: string): number => {
  if (value.trim() === "") {
    return 0;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const parseNumberArray = (value: string): number[] => {
  if (value.trim() === "") {
    return [];
  }
  const parts = value.split(",").map((part) => part.trim());
  if (parts.some((part) => part === "")) {
    return [];
  }
  const numbers = parts.map((part) => Number(part));
  if (numbers.some((num) => Number.isNaN(num))) {
    return [];
  }
  return numbers;
};

const formatNumberArray = (values: number[]): string => values.join(", ");

const buildDrillForType = (drill: Drill, nextType: DrillType): Drill => {
  const base = {
    id: drill.id,
    type: nextType,
    name: drill.name || "New Drill",
    durationSeconds: drill.durationSeconds > 0 ? drill.durationSeconds : 60,
    metronome: {
      bpm: drill.metronome.bpm > 0 ? drill.metronome.bpm : 80,
      beatsPerBar:
        drill.metronome.beatsPerBar ?? DEFAULT_BEATS_PER_BAR,
    },
  };

  switch (nextType) {
    case "note-location":
      return {
        ...base,
        type: "note-location",
        string: 1,
        note: "C",
        fretRange: [1, 4],
      };
    case "triad-location":
      return {
        ...base,
        type: "triad-location",
        triadType: "major",
        stringSet: [1, 2, 3],
        key: "C",
      };
    case "spider":
      return {
        ...base,
        type: "spider",
        pattern: "1234",
        fretRange: [1, 4],
      };
    case "generic":
    default:
      return {
        ...base,
        type: "generic",
      };
  }
};

export function DrillEditor({
  drill,
  errors,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: DrillEditorProps): JSX.Element {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div>
      <div>
        <label htmlFor={`drill-type-${drill.id}`}>Drill Type</label>
        <select
          id={`drill-type-${drill.id}`}
          value={drill.type}
          onChange={(event) =>
            onChange(buildDrillForType(drill, event.target.value as DrillType))
          }
        >
          <option value="generic">Generic</option>
          <option value="note-location">Note Location</option>
          <option value="triad-location">Triad Location</option>
          <option value="spider">Spider</option>
        </select>
      </div>
      <div>
        <label htmlFor={`drill-name-${drill.id}`}>Drill Name</label>
        <input
          id={`drill-name-${drill.id}`}
          type="text"
          value={drill.name}
          onChange={(event) => onChange({ ...drill, name: event.target.value })}
        />
      </div>
      <div>
        <label htmlFor={`drill-duration-${drill.id}`}>Duration (seconds)</label>
        <input
          id={`drill-duration-${drill.id}`}
          type="number"
          value={Number.isNaN(drill.durationSeconds) ? "" : drill.durationSeconds}
          onChange={(event) =>
            onChange({
              ...drill,
              durationSeconds: parseNumberInput(event.target.value),
            })
          }
        />
      </div>
      <div>
        <label htmlFor={`drill-bpm-${drill.id}`}>BPM</label>
        <input
          id={`drill-bpm-${drill.id}`}
          type="number"
          value={Number.isNaN(drill.metronome.bpm) ? "" : drill.metronome.bpm}
          onChange={(event) =>
            onChange({
              ...drill,
              metronome: {
                ...drill.metronome,
                bpm: parseNumberInput(event.target.value),
              },
            })
          }
        />
      </div>
      <div>
        <label htmlFor={`drill-beats-${drill.id}`}>Beats Per Bar</label>
        <input
          id={`drill-beats-${drill.id}`}
          type="number"
          value={
            Number.isNaN(drill.metronome.beatsPerBar)
              ? ""
              : drill.metronome.beatsPerBar
          }
          onChange={(event) =>
            onChange({
              ...drill,
              metronome: {
                ...drill.metronome,
                beatsPerBar: parseNumberInput(event.target.value),
              },
            })
          }
        />
      </div>
      {drill.type === "note-location" && (
        <>
          <div>
            <label htmlFor={`drill-string-${drill.id}`}>String (1–6)</label>
            <input
              id={`drill-string-${drill.id}`}
              type="number"
              value={drill.string ?? 0}
              onChange={(event) =>
                onChange({
                  ...drill,
                  string: parseNumberInput(event.target.value),
                })
              }
            />
          </div>
          <div>
            <label htmlFor={`drill-note-${drill.id}`}>Note</label>
            <input
              id={`drill-note-${drill.id}`}
              type="text"
              value={drill.note ?? ""}
              onChange={(event) =>
                onChange({
                  ...drill,
                  note: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label htmlFor={`drill-fret-start-${drill.id}`}>Fret Range</label>
            <div>
              <input
                id={`drill-fret-start-${drill.id}`}
                type="number"
                value={drill.fretRange?.[0] ?? 0}
                onChange={(event) =>
                  onChange({
                    ...drill,
                    fretRange: [
                      parseNumberInput(event.target.value),
                      drill.fretRange?.[1] ?? 0,
                    ],
                  })
                }
              />
              <input
                id={`drill-fret-end-${drill.id}`}
                type="number"
                value={drill.fretRange?.[1] ?? 0}
                onChange={(event) =>
                  onChange({
                    ...drill,
                    fretRange: [
                      drill.fretRange?.[0] ?? 0,
                      parseNumberInput(event.target.value),
                    ],
                  })
                }
              />
            </div>
          </div>
        </>
      )}
      {drill.type === "triad-location" && (
        <>
          <div>
            <label htmlFor={`drill-triad-${drill.id}`}>Triad Type</label>
            <select
              id={`drill-triad-${drill.id}`}
              value={drill.triadType ?? "major"}
              onChange={(event) =>
                onChange({
                  ...drill,
                  triadType: event.target.value as TriadType,
                })
              }
            >
              <option value="major">major</option>
              <option value="minor">minor</option>
              <option value="diminished">diminished</option>
              <option value="augmented">augmented</option>
            </select>
          </div>
          <div>
            <label htmlFor={`drill-string-set-${drill.id}`}>String Set</label>
            <input
              id={`drill-string-set-${drill.id}`}
              type="text"
              value={formatNumberArray(drill.stringSet ?? [])}
              onChange={(event) =>
                onChange({
                  ...drill,
                  stringSet: parseNumberArray(event.target.value),
                })
              }
            />
          </div>
          <div>
            <label htmlFor={`drill-key-${drill.id}`}>Key</label>
            <input
              id={`drill-key-${drill.id}`}
              type="text"
              value={drill.key ?? ""}
              onChange={(event) =>
                onChange({
                  ...drill,
                  key: event.target.value,
                })
              }
            />
          </div>
        </>
      )}
      {drill.type === "spider" && (
        <>
          <div>
            <label htmlFor={`drill-pattern-${drill.id}`}>Pattern</label>
            <input
              id={`drill-pattern-${drill.id}`}
              type="text"
              value={drill.pattern ?? ""}
              onChange={(event) =>
                onChange({
                  ...drill,
                  pattern: event.target.value,
                })
              }
            />
          </div>
          <div>
            <label htmlFor={`drill-fret-start-${drill.id}`}>Fret Range</label>
            <div>
              <input
                id={`drill-fret-start-${drill.id}`}
                type="number"
                value={drill.fretRange?.[0] ?? 0}
                onChange={(event) =>
                  onChange({
                    ...drill,
                    fretRange: [
                      parseNumberInput(event.target.value),
                      drill.fretRange?.[1] ?? 0,
                    ],
                  })
                }
              />
              <input
                id={`drill-fret-end-${drill.id}`}
                type="number"
                value={drill.fretRange?.[1] ?? 0}
                onChange={(event) =>
                  onChange({
                    ...drill,
                    fretRange: [
                      drill.fretRange?.[0] ?? 0,
                      parseNumberInput(event.target.value),
                    ],
                  })
                }
              />
            </div>
          </div>
        </>
      )}
      <div>
        <button type="button" onClick={onMoveUp}>Move Up</button>
        <button type="button" onClick={onMoveDown}>Move Down</button>
        <button type="button" onClick={onRemove}>Remove</button>
      </div>
      {hasErrors && (
        <ul>
          {errors.type && <li>{errors.type}</li>}
          {errors.name && <li>{errors.name}</li>}
          {errors.durationSeconds && <li>{errors.durationSeconds}</li>}
          {errors.bpm && <li>{errors.bpm}</li>}
          {errors.beatsPerBar && <li>{errors.beatsPerBar}</li>}
          {errors.string && <li>{errors.string}</li>}
          {errors.note && <li>{errors.note}</li>}
          {errors.fretRange && <li>{errors.fretRange}</li>}
          {errors.triadType && <li>{errors.triadType}</li>}
          {errors.stringSet && <li>{errors.stringSet}</li>}
          {errors.key && <li>{errors.key}</li>}
          {errors.pattern && <li>{errors.pattern}</li>}
        </ul>
      )}
    </div>
  );
}
