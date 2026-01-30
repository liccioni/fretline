import type { BaseDrill } from "../models/drills";
import type { Session } from "../models/session";

export type SessionRunnerPhase = "idle" | "countdown" | "running" | "completed";

export interface SessionRunnerState {
  phase: SessionRunnerPhase;
  countdownSeconds: number | null;
  activeDrillIndex: number | null;
  activeDrill: BaseDrill | null;
  remainingSeconds: number | null;
  completed: boolean;
}

type Listener = (state: SessionRunnerState) => void;

export class SessionRunner {
  private readonly session: Session;
  private readonly listeners = new Set<Listener>();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private state: SessionRunnerState;
  private countdownEndMs: number | null = null;
  private drillEndMs: number | null = null;

  constructor(session: Session) {
    this.session = session;
    this.state = {
      phase: "idle",
      countdownSeconds: null,
      activeDrillIndex: null,
      activeDrill: null,
      remainingSeconds: null,
      completed: false,
    };
  }

  getState(): SessionRunnerState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  start(): void {
    if (this.intervalId || this.state.phase === "completed") {
      return;
    }

    this.countdownEndMs = Date.now() + 3000;
    this.drillEndMs = null;

    this.updateState({
      phase: "countdown",
      countdownSeconds: this.getRemainingSeconds(this.countdownEndMs),
      activeDrillIndex: null,
      activeDrill: null,
      remainingSeconds: null,
      completed: false,
    });

    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.countdownEndMs = null;
    this.drillEndMs = null;

    this.updateState({
      phase: "idle",
      countdownSeconds: null,
      activeDrillIndex: null,
      activeDrill: null,
      remainingSeconds: null,
      completed: false,
    });
  }

  private tick(): void {
    if (this.state.phase === "countdown") {
      const remaining = this.getRemainingSeconds(this.countdownEndMs);
      if (remaining > 0) {
        this.updateState({ countdownSeconds: remaining });
        return;
      }

      if (this.session.drills.length === 0) {
        this.completeSession();
        return;
      }

      this.startDrill(0);
      return;
    }

    if (this.state.phase === "running") {
      const remaining = this.getRemainingSeconds(this.drillEndMs);
      if (remaining > 0) {
        this.updateState({ remainingSeconds: remaining });
        return;
      }

      const nextIndex = (this.state.activeDrillIndex ?? 0) + 1;
      if (nextIndex < this.session.drills.length) {
        this.startDrill(nextIndex);
        return;
      }

      this.completeSession();
    }
  }

  private startDrill(index: number): void {
    const drill = this.session.drills[index] ?? null;
    this.countdownEndMs = null;
    this.drillEndMs = drill ? Date.now() + drill.durationSeconds * 1000 : null;
    this.updateState({
      phase: "running",
      countdownSeconds: null,
      activeDrillIndex: drill ? index : null,
      activeDrill: drill,
      remainingSeconds: this.getRemainingSeconds(this.drillEndMs),
      completed: false,
    });
  }

  private completeSession(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.countdownEndMs = null;
    this.drillEndMs = null;

    this.updateState({
      phase: "completed",
      countdownSeconds: null,
      activeDrillIndex: null,
      activeDrill: null,
      remainingSeconds: 0,
      completed: true,
    });
  }

  private getRemainingSeconds(endMs: number | null): number {
    if (!endMs) {
      return 0;
    }
    const remainingMs = endMs - Date.now();
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }

  private updateState(partial: Partial<SessionRunnerState>): void {
    this.state = { ...this.state, ...partial };
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}
