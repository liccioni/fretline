import type { Drill } from "./drills";

export interface Session {
  id: string;
  name: string;
  drills: Drill[];
}
