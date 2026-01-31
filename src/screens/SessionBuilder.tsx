import { useMemo, useState } from "react";
import type { GenericDrill } from "../models/drills";
import type { Session } from "../models/session";
import { DEFAULT_BEATS_PER_BAR } from "../models/defaults";
import { createId } from "../utils/ids";
import { DrillEditor, type DrillEditorErrors } from "../components/DrillEditor";

interface SessionBuilderProps {
  onRun?: (session: Session) => void;
}

export function SessionBuilder({ onRun }: SessionBuilderProps): JSX.Element {
  const [sessionName, setSessionName] = useState("");
  const [drills, setDrills] = useState<GenericDrill[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const totalDuration = useMemo(() => {
    return drills.reduce((sum, drill) => sum + drill.durationSeconds, 0);
  }, [drills]);

  const drillErrors = useMemo<DrillEditorErrors[]>(() => {
    return drills.map((drill) => {
      const error: DrillEditorErrors = {};

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

  const addDrill = () => {
    const newDrill: GenericDrill = {
      id: createId("drill"),
      type: "generic",
      name: "",
      durationSeconds: 60,
      metronome: {
        bpm: 80,
        beatsPerBar: DEFAULT_BEATS_PER_BAR,
      },
    };
    setDrills([...drills, newDrill]);
  };

  const updateDrill = (index: number, nextDrill: GenericDrill) => {
    setDrills(
      drills.map((drill, drillIndex) =>
        drillIndex === index
          ? { ...nextDrill, id: drills[index].id, type: drills[index].type }
          : drill
      )
    );
  };

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
    const session: Session = {
      id: createId("session"),
      name: sessionName.trim(),
      drills,
    };
    onRun?.(session);
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
        <button type="button" onClick={addDrill}>
          Add Drill
        </button>
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

      <button type="button" onClick={handleRun} disabled={hasErrors}>
        Run
      </button>
    </div>
  );
}
