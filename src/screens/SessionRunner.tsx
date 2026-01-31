import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "../models/session";
import type { BaseDrill } from "../models/drills";
import { DEFAULT_BEATS_PER_BAR } from "../models/defaults";
import { Metronome } from "../audio/metronome";
import { SessionRunner, type SessionRunnerState } from "../runtime/sessionRunner";

interface SessionRunnerProps {
  session: Session;
  onExit?: () => void;
}

const initialState: SessionRunnerState = {
  phase: "idle",
  countdownSeconds: null,
  activeDrillIndex: null,
  activeDrill: null,
  remainingSeconds: null,
  completed: false,
};

function getBpm(drill: BaseDrill | null): number | null {
  if (!drill) {
    return null;
  }
  return drill.metronome.bpm;
}

function getProgressPercent(drill: BaseDrill | null, remainingSeconds: number | null): number {
  if (!drill || remainingSeconds === null) {
    return 0;
  }
  if (drill.durationSeconds <= 0) {
    return 100;
  }
  const elapsed = drill.durationSeconds - remainingSeconds;
  return Math.min(100, Math.max(0, (elapsed / drill.durationSeconds) * 100));
}

export function SessionRunnerScreen({
  session,
  onExit,
}: SessionRunnerProps): JSX.Element {
  const runner = useMemo(() => new SessionRunner(session), [session]);
  const [state, setState] = useState<SessionRunnerState>(initialState);
  const [beat, setBeat] = useState<number | null>(null);
  const metronomeRef = useRef<Metronome | null>(null);
  const metronomeRunningRef = useRef(false);
  const previousDrillIdRef = useRef<string | null>(null);

  useEffect(() => {
    return runner.subscribe(setState);
  }, [runner]);

  useEffect(() => {
    if (!metronomeRef.current) {
      metronomeRef.current = new Metronome();
    }

    if (state.phase === "running" && state.activeDrill) {
      const bpm = state.activeDrill.metronome.bpm;
      const beatsPerBar =
        state.activeDrill.metronome.beatsPerBar ?? DEFAULT_BEATS_PER_BAR;
      const drillId = state.activeDrill.id;

      if (!metronomeRunningRef.current) {
        metronomeRef.current.start({
          bpm,
          beatsPerBar,
          onBeat: (beatNumber) => setBeat(beatNumber),
        });
        metronomeRunningRef.current = true;
      } else if (previousDrillIdRef.current !== drillId) {
        metronomeRef.current.updateTempo(bpm, beatsPerBar);
      }

      previousDrillIdRef.current = drillId;
      return;
    }

    if (metronomeRunningRef.current) {
      metronomeRef.current?.stop();
      metronomeRunningRef.current = false;
      previousDrillIdRef.current = null;
    }
    setBeat(null);
  }, [state.phase, state.activeDrill]);

  useEffect(() => {
    return () => {
      metronomeRef.current?.stop();
      metronomeRunningRef.current = false;
      previousDrillIdRef.current = null;
    };
  }, []);

  const startRunner = () => {
    runner.start();
  };

  const bpm = getBpm(state.activeDrill);
  const progressPercent = getProgressPercent(state.activeDrill, state.remainingSeconds);

  return (
    <div>
      <h1>Session Runner</h1>
      {state.phase === "idle" && (
        <button type="button" onClick={startRunner}>
          Start
        </button>
      )}

      {state.phase === "countdown" && (
        <div>
          <p>Starting in {state.countdownSeconds}</p>
        </div>
      )}

      {state.phase === "running" && (
        <div>
          <p>Drill: {state.activeDrill?.name ?? ""}</p>
          <p>Remaining: {state.remainingSeconds ?? 0}s</p>
          <p>BPM: {bpm ?? "-"}</p>
          <p>Beat: {beat ?? "-"}</p>
          <div>
            <div>Progress</div>
            <div
              style={{
                width: "100%",
                height: "8px",
                border: "1px solid #ccc",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  backgroundColor: "#555",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {state.phase === "completed" && (
        <div>
          <p>Session complete.</p>
          <button type="button" onClick={() => onExit?.()}>
            Back to Builder
          </button>
        </div>
      )}
    </div>
  );
}
