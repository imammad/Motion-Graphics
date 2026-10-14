import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";
import { blurDissolve } from "../Wave/blurDissolve";
import { GridBackground } from "../Wave/GridBackground";
import { AutomationScene } from "./AutomationScene";
import { CalendarScene } from "./CalendarScene";
import { CRMScene } from "./CRMScene";
import { LivesInsideScene } from "./LivesInsideScene";
import { ShowFloorScene } from "./ShowFloorScene";
import { StackScene } from "./StackScene";

export const SCENES = {
  livesInside: 150,
  stack: 180,
  crm: 240,
  automation: 150,
  calendar: 225,
  showFloor: 210,
};
const TRANSITION = 15;

export const TOTAL_DURATION =
  Object.values(SCENES).reduce((a, b) => a + b, 0) - (Object.keys(SCENES).length - 1) * TRANSITION;

const Dissolve = () => (
  <TransitionSeries.Transition presentation={blurDissolve()} timing={linearTiming({ durationInFrames: TRANSITION })} />
);

// The grid background sits outside the transitions so it stays steady while scenes blur into each other.
export const ToolStackVideo: React.FC = () => (
  <AbsoluteFill>
    <GridBackground />
    <TransitionSeries>
      <TransitionSeries.Sequence name="Lives inside" durationInFrames={150}>
        <LivesInsideScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="Stack of tools" durationInFrames={180}>
        <StackScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="CRM" durationInFrames={240}>
        <CRMScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="Automation" durationInFrames={150}>
        <AutomationScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="Event calendar" durationInFrames={225}>
        <CalendarScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="Show floor" durationInFrames={210}>
        <ShowFloorScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
