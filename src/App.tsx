import type { Session } from "./models/session";
import { DEFAULT_BEATS_PER_BAR } from "./models/defaults";
import { SessionRunnerScreen } from "./screens/SessionRunner";
import "./App.css";

function App() {
  const testSession: Session = {
    id: "session-1",
    name: "Test Session",
    drills: [
      {
        id: "drill-1",
        type: "generic",
        name: "Alternate Picking",
        durationSeconds: 30,
        metronome: { bpm: 90, beatsPerBar: DEFAULT_BEATS_PER_BAR },
      },
      {
        id: "drill-2",
        type: "generic",
        name: "Scale Sequences",
        durationSeconds: 45,
        metronome: { bpm: 100, beatsPerBar: DEFAULT_BEATS_PER_BAR },
      },
      {
        id: "drill-3",
        type: "generic",
        name: "String Skipping",
        durationSeconds: 30,
        metronome: { bpm: 80, beatsPerBar: DEFAULT_BEATS_PER_BAR },
      },
    ],
  };

  return <SessionRunnerScreen session={testSession} />;
}

export default App;
