import { useEffect, useMemo, useState } from "react";
import type { Drill, DrillType } from "../models/drills";
import type { Session } from "../models/session";
import { DEFAULT_BEATS_PER_BAR } from "../models/defaults";
import { createId } from "../utils/ids";
import { DrillEditor, type DrillEditorErrors } from "../components/DrillEditor";

interface SessionBuilderProps {
  initialSession?: Session | null;
  onRun?: (session: Session) => void;
  onSave?: (session: Session) => void;
  onCancel?: () => void;
}

export function SessionBuilder({
  initialSession,
  onRun,
  onSave,
  onCancel,
}: SessionBuilderProps): JSX.Element {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState("");
  const [drills, setDrills] = useState<Drill[]>([]);
  const [newDrillType, setNewDrillType] = useState<DrillType>("generic");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (initialSession) {
      setSessionId(initialSession.id);
      setSessionName(initialSession.name);
      setDrills(initialSession.drills);
      setErrors([]);
      return;
    }

    setSessionId(createId("session"));
    setSessionName("");
    setDrills([]);
    setErrors([]);
  }, [initialSession]);

  const totalDuration = useMemo(() => {
    return drills.reduce((sum, drill) => sum + drill.durationSeconds, 0);
  }, [drills]);

  const drillErrors = useMemo<DrillEditorErrors[]>(() => {
    return drills.map((drill) => {
      const error: DrillEditorErrors = {};

      if (!drill.type) {
        error.type = "Drill type is required.";
      }
      if (!drill.name.trim()) {
        error.name = "Drill name is required.";
      }
      if (drill.durationSeconds <= 0) {
        error.durationSeconds = "Duration must be greater than 0.";
      }
      if (drill.metronome.bpm <= 0) {
        error.bpm = "BPM must be greater than 0.";
      }
      const beatsPerBar = drill.metronome.beatsPerBar ?? DEFAULT_BEATS_PER_BAR;
      if (beatsPerBar <= 0) {
        error.beatsPerBar = "Beats per bar must be greater than 0.";
      }

      if (drill.type === "note-location") {
        if (!Number.isInteger(drill.string) || drill.string < 1 || drill.string > 6) {
          error.string = "String must be an integer from 1 to 6.";
        }
        const notePattern = /^[A-G](#|b)?$/;
        if (!drill.note || !notePattern.test(drill.note)) {
          error.note = "Note must be A–G with optional #/b.";
        }
        const [start, end] = drill.fretRange ?? [];
        if (
          !Number.isInteger(start) ||
          !Number.isInteger(end) ||
          start < 0 ||
          end < start
        ) {
          error.fretRange = "Fret range must be valid (start ≤ end, both ≥ 0).";
        }
      }

      if (drill.type === "triad-location") {
        const validTriads = ["major", "minor", "diminished", "augmented"];
        if (!drill.triadType || !validTriads.includes(drill.triadType)) {
          error.triadType = "Triad type must be major, minor, diminished, or augmented.";
        }
        if (!drill.stringSet || drill.stringSet.length === 0) {
          error.stringSet = "String set must include at least one string.";
        } else if (
          drill.stringSet.some(
            (value) => !Number.isInteger(value) || value < 1 || value > 6
          )
        ) {
          error.stringSet = "String set must contain values 1–6.";
        }
        if (!drill.key || !drill.key.trim()) {
          error.key = "Key is required.";
        }
      }

      if (drill.type === "spider") {
        if (!drill.pattern || !drill.pattern.trim()) {
          error.pattern = "Pattern is required.";
        }
        const [start, end] = drill.fretRange ?? [];
        if (
          !Number.isInteger(start) ||
          !Number.isInteger(end) ||
          start < 0 ||
          end < start
        ) {
          error.fretRange = "Fret range must be valid (start ≤ end, both ≥ 0).";
        }
      }

      return error;
    });
  }, [drills]);

  const hasErrors = useMemo(() => {
    if (!sessionName.trim()) {
      return true;
    }

    return drillErrors.some((error) => Object.keys(error).length > 0);
  }, [sessionName, drillErrors]);

  const moveDrill = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= drills.length) {
      return;
    }
    const next = [...drills];
    const [removed] = next.splice(index, 1);
    next.splice(targetIndex, 0, removed);
    setDrills(next);
  };

  const removeDrill = (index: number) => {
    setDrills(drills.filter((_, drillIndex) => drillIndex !== index));
  };

  const buildNewDrill = (type: DrillType): Drill => {
    const base = {
      id: createId("drill"),
      name: "New Drill",
      durationSeconds: 60,
      metronome: {
        bpm: 80,
        beatsPerBar: DEFAULT_BEATS_PER_BAR,
      },
    };

    switch (type) {
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

  const addDrill = () => {
    const newDrill = buildNewDrill(newDrillType);
    setDrills([...drills, newDrill]);
  };

  const updateDrill = (index: number, nextDrill: Drill) => {
    setDrills(
      drills.map((drill, drillIndex) =>
        drillIndex === index ? { ...nextDrill, id: drills[index].id } : drill
      )
    );
  };

  const buildSession = (): Session => ({
    id: sessionId ?? createId("session"),
    name: sessionName.trim(),
    drills: drills.map((drill) => ({
      ...drill,
      metronome: {
        ...drill.metronome,
        beatsPerBar: drill.metronome.beatsPerBar ?? DEFAULT_BEATS_PER_BAR,
      },
    })),
  });

  const handleRun = () => {
    if (!sessionName.trim()) {
      setErrors(["Session name is required."]);
      return;
    }

    const drillErrorMessages = drillErrors.flatMap((error, index) => {
      const messages: string[] = [];
      if (error.name) messages.push(`Drill ${index + 1}: ${error.name}`);
      if (error.durationSeconds) messages.push(`Drill ${index + 1}: ${error.durationSeconds}`);
      if (error.bpm) messages.push(`Drill ${index + 1}: ${error.bpm}`);
      if (error.beatsPerBar) messages.push(`Drill ${index + 1}: ${error.beatsPerBar}`);
      return messages;
    });

    if (drillErrorMessages.length > 0) {
      setErrors(drillErrorMessages);
      return;
    }

    setErrors([]);
    onRun?.(buildSession());
  };

  const handleSave = () => {
    if (!sessionName.trim()) {
      setErrors(["Session name is required."]);
      return;
    }

    const drillErrorMessages = drillErrors.flatMap((error, index) => {
      const messages: string[] = [];
      if (error.name) messages.push(`Drill ${index + 1}: ${error.name}`);
      if (error.durationSeconds) messages.push(`Drill ${index + 1}: ${error.durationSeconds}`);
      if (error.bpm) messages.push(`Drill ${index + 1}: ${error.bpm}`);
      if (error.beatsPerBar) messages.push(`Drill ${index + 1}: ${error.beatsPerBar}`);
      return messages;
    });

    if (drillErrorMessages.length > 0) {
      setErrors(drillErrorMessages);
      return;
    }

    setErrors([]);
    onSave?.(buildSession());
  };

  return (
    <div>
      <h1>Session Builder</h1>
      <div>
        <label htmlFor="session-name">Session Name</label>
        <input
          id="session-name"
          type="text"
          value={sessionName}
          onChange={(event) => setSessionName(event.target.value)}
        />
      </div>

      <div>
        <strong>Total Duration:</strong> {totalDuration}s
      </div>

      <div>
        <h2>Drills</h2>
        {drills.length === 0 && <p>No drills added yet.</p>}
        {drills.map((drill, index) => (
          <DrillEditor
            key={drill.id}
            drill={drill}
            errors={drillErrors[index] ?? {}}
            onChange={(nextDrill) => updateDrill(index, nextDrill)}
            onMoveUp={() => moveDrill(index, "up")}
            onMoveDown={() => moveDrill(index, "down")}
            onRemove={() => removeDrill(index)}
          />
        ))}
        <div>
          <label htmlFor="new-drill-type">New Drill Type</label>
          <select
            id="new-drill-type"
            value={newDrillType}
            onChange={(event) => setNewDrillType(event.target.value as DrillType)}
          >
            <option value="generic">Generic</option>
            <option value="note-location">Note Location</option>
            <option value="triad-location">Triad Location</option>
            <option value="spider">Spider</option>
          </select>
          <button type="button" onClick={addDrill}>
            Add Drill
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div>
          <p>Fix the following issues:</p>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Back to Sessions
          </button>
        )}
        <button type="button" onClick={handleSave} disabled={hasErrors}>
          Save
        </button>
        <button type="button" onClick={handleRun} disabled={hasErrors}>
          Run
        </button>
      </div>
    </div>
  );
}
