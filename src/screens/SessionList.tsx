import type { Session } from "../models/session";

interface SessionListProps {
  sessions: Session[];
  onCreate: () => void;
  onEdit: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onRun: (sessionId: string) => void;
}

const getTotalDuration = (session: Session): number =>
  session.drills.reduce((sum, drill) => sum + drill.durationSeconds, 0);

export function SessionList({
  sessions,
  onCreate,
  onEdit,
  onDelete,
  onRun,
}: SessionListProps): JSX.Element {
  return (
    <div>
      <h1>Sessions</h1>
      <button type="button" onClick={onCreate}>
        New Session
      </button>

      {sessions.length === 0 && <p>No sessions saved yet.</p>}

      {sessions.map((session) => (
        <div key={session.id}>
          <div>
            <strong>{session.name}</strong>
          </div>
          <div>Duration: {getTotalDuration(session)}s</div>
          <div>
            <button type="button" onClick={() => onRun(session.id)}>
              Run
            </button>
            <button type="button" onClick={() => onEdit(session.id)}>
              Edit
            </button>
            <button type="button" onClick={() => onDelete(session.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
