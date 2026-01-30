export interface MetronomeStartOptions {
  bpm: number;
  beatsPerBar: number;
  onBeat?: (beatNumber: number) => void;
}

export class Metronome {
  private audioContext: AudioContext | null = null;
  private schedulerId: ReturnType<typeof setInterval> | null = null;
  private nextTickTime = 0;
  private beatNumber = 1;
  private bpm = 120;
  private beatsPerBar = 4;
  private onBeat?: (beatNumber: number) => void;

  start(options: MetronomeStartOptions): void {
    if (this.schedulerId) {
      this.stop();
    }

    this.bpm = options.bpm > 0 ? options.bpm : 60;
    this.beatsPerBar = options.beatsPerBar;
    this.onBeat = options.onBeat;
    this.beatNumber = 1;

    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (this.audioContext.state === "suspended") {
      void this.audioContext.resume();
    }

    const now = this.audioContext.currentTime;
    this.nextTickTime = now + 0.05;

    this.schedulerId = setInterval(() => this.schedule(), 100);
    this.schedule();
  }

  stop(): void {
    if (this.schedulerId) {
      clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
    this.onBeat = undefined;
    this.nextTickTime = 0;
    this.beatNumber = 1;
  }

  updateTempo(bpm: number, beatsPerBar = this.beatsPerBar): void {
    this.bpm = bpm > 0 ? bpm : 60;
    this.beatsPerBar = beatsPerBar;
  }

  private schedule(): void {
    if (!this.audioContext) {
      return;
    }

    const lookahead = 0.2;
    const interval = 60 / this.bpm;
    const now = this.audioContext.currentTime;

    while (this.nextTickTime < now + lookahead) {
      const isDownbeat = this.beatNumber === 1;
      this.playClick(this.nextTickTime, isDownbeat);
      if (this.onBeat) {
        this.onBeat(this.beatNumber);
      }
      this.beatNumber = this.beatNumber % this.beatsPerBar + 1;
      this.nextTickTime += interval;
    }
  }

  private playClick(time: number, isDownbeat: boolean): void {
    if (!this.audioContext) {
      return;
    }

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.frequency.value = isDownbeat ? 1200 : 900;
    gain.gain.value = isDownbeat ? 0.3 : 0.18;

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  }
}
