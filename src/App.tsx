import { useState } from "react";
import type { Session } from "./models/session";
import { loadSessions, saveSessions } from "./storage/sessions";
import { SessionBuilder } from "./screens/SessionBuilder";
import { SessionList } from "./screens/SessionList";
import { SessionRunnerScreen } from "./screens/SessionRunner";
import "./App.css";

function App() {
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions());
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [view, setView] = useState<"list" | "builder" | "runner">("list");

  const persistSession = (session: Session) => {
    setSessions((prev) => {
      const index = prev.findIndex((item) => item.id === session.id);
      const next =
        index >= 0 ? prev.map((item) => (item.id === session.id ? session : item)) : [...prev, session];
      saveSessions(next);
      return next;
    });
  };

  const handleDelete = (sessionId: string) => {
    if (view === "runner") {
      return;
    }
    setSessions((prev) => {
      const next = prev.filter((session) => session.id !== sessionId);
      saveSessions(next);
      return next;
    });
  };

  if (view === "builder") {
    return (
      <SessionBuilder
        initialSession={editingSession}
        onRun={(session) => {
          persistSession(session);
          setActiveSession(session);
          setView("runner");
        }}
        onSave={(session) => {
          persistSession(session);
          setEditingSession(null);
          setView("list");
        }}
        onCancel={() => {
          setEditingSession(null);
          setView("list");
        }}
      />
    );
  }

  if (view === "runner" && activeSession) {
    return (
      <SessionRunnerScreen
        session={activeSession}
        onExit={() => {
          setActiveSession(null);
          setView("list");
        }}
      />
    );
  }

  return (
    <SessionList
      sessions={sessions}
      onCreate={() => {
        setEditingSession(null);
        setView("builder");
      }}
      onEdit={(sessionId) => {
        const session = sessions.find((item) => item.id === sessionId) ?? null;
        setEditingSession(session);
        setView("builder");
      }}
      onRun={(sessionId) => {
        const session = sessions.find((item) => item.id === sessionId);
        if (!session) {
          return;
        }
        setActiveSession(session);
        setView("runner");
      }}
      onDelete={handleDelete}
    />
  );
}

export default App;
