import type { GenericDrill } from "../models/drills";

export interface DrillEditorErrors {
  name?: string;
  durationSeconds?: string;
  bpm?: string;
  beatsPerBar?: string;
}

interface DrillEditorProps {
  drill: GenericDrill;
  errors: DrillEditorErrors;
  onChange: (next: GenericDrill) => void;
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
      <div>
        <button type="button" onClick={onMoveUp}>Move Up</button>
        <button type="button" onClick={onMoveDown}>Move Down</button>
        <button type="button" onClick={onRemove}>Remove</button>
      </div>
      {hasErrors && (
        <ul>
          {errors.name && <li>{errors.name}</li>}
          {errors.durationSeconds && <li>{errors.durationSeconds}</li>}
          {errors.bpm && <li>{errors.bpm}</li>}
          {errors.beatsPerBar && <li>{errors.beatsPerBar}</li>}
        </ul>
      )}
    </div>
  );
}
