import type { CaptionPosition } from "./Caption";
import type { StyleProfile } from "./style";

/**
 * The edit plan. It is produced by the planning page (planner/index.html →
 * "Export plan.json") and consumed by <PlanReel/>. One entry per script line.
 */
export type SceneType = "captions" | "captions_ui" | "half" | "full";

export type PlanLine = {
  id: string;
  start: number; // seconds in the cut footage
  end: number; // seconds
  text: string; // the spoken line
  caption: string[]; // caption rows, *special words* in asterisks
  captionPosition?: CaptionPosition;
  captionTimes?: number[]; // seconds (absolute) of each caption word, from the word-level transcript
  type: SceneType;
  notes: string; // what the editor wants on screen (from the planning page)
  scene?: string; // key in the scene registry for captions_ui / half / full
  zoom?: "none" | "push" | "punch"; // speaker camera for captions lines
  captionInScene?: boolean; // full/half scenes that draw their own text
};

export type Plan = {
  title: string;
  speakerSrc?: string; // path inside /public, e.g. "footage/cut.mp4"
  fps: number;
  width: number;
  height: number;
  style?: Partial<StyleProfile>; // overrides for this edit (accent, fonts…)
  constants?: Record<string, string>; // free-text rules from the planning page
  lines: PlanLine[];
};

export const planDuration = (plan: Plan) =>
  Math.ceil(Math.max(...plan.lines.map((l) => l.end)) * plan.fps);
