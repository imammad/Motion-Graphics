import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";
import { blurDissolve } from "../Wave/blurDissolve";
import { GridBackground } from "../Wave/GridBackground";
import { PileScene } from "./PileScene";
import { PipelineScene } from "./PipelineScene";
import { SpreadsheetScene } from "./SpreadsheetScene";
import { WhoGetsAskedScene } from "./WhoGetsAskedScene";

export const SCENES = {
  pile: 150,
  spreadsheet: 90,
  pipeline: 105,
  whoGetsAsked: 150,
};
const TRANSITION = 15;

export const TOTAL_DURATION =
  Object.values(SCENES).reduce((a, b) => a + b, 0) - (Object.keys(SCENES).length - 1) * TRANSITION;

const Dissolve = () => (
  <TransitionSeries.Transition presentation={blurDissolve()} timing={linearTiming({ durationInFrames: TRANSITION })} />
);

// The grid background sits outside the transitions so it stays steady while scenes blur into each other.
export const NoPipelineVideo: React.FC = () => (
  <AbsoluteFill>
    <GridBackground />
    <TransitionSeries>
      <TransitionSeries.Sequence name="Pile of badges" durationInFrames={150}>
        <PileScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="Spreadsheet nobody opens" durationInFrames={90}>
        <SpreadsheetScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="No pipeline" durationInFrames={105}>
        <PipelineScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="Who gets asked" durationInFrames={150}>
        <WhoGetsAskedScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
