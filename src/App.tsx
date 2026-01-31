import { useState } from "react";
import type { Session } from "./models/session";
import { SessionBuilder } from "./screens/SessionBuilder";
import { SessionRunnerScreen } from "./screens/SessionRunner";
import "./App.css";

function App() {
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  if (!activeSession) {
    return <SessionBuilder onRun={(session) => setActiveSession(session)} />;
  }

  return (
    <SessionRunnerScreen
      session={activeSession}
      onExit={() => setActiveSession(null)}
    />
  );
}

export default App;
