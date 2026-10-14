import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";
import { blurDissolve } from "./blurDissolve";
import { DealsScene } from "./DealsScene";
import { DemosScene } from "./DemosScene";
import { FinanceScene } from "./FinanceScene";
import { GridBackground } from "./GridBackground";
import { OpportunitiesScene } from "./OpportunitiesScene";
import { QuarterScene } from "./QuarterScene";
import { SalesScene } from "./SalesScene";
import { SamePersonScene } from "./SamePersonScene";

export const SCENES = {
  opportunities: 135,
  demos: 105,
  deals: 165,
  quarter: 75,
  finance: 150,
  sales: 90,
  samePerson: 150,
};
const TRANSITION = 15;

export const TOTAL_DURATION =
  Object.values(SCENES).reduce((a, b) => a + b, 0) - (Object.keys(SCENES).length - 1) * TRANSITION;

const Dissolve = () => (
  <TransitionSeries.Transition presentation={blurDissolve()} timing={linearTiming({ durationInFrames: TRANSITION })} />
);

// The grid background sits outside the transitions so it stays steady while scenes blur into each other.
export const EventROIVideo: React.FC = () => (
  <AbsoluteFill>
    <GridBackground />
    <TransitionSeries>
      <TransitionSeries.Sequence name="Real opportunities" durationInFrames={135}>
        <OpportunitiesScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="Demos booked" durationInFrames={105}>
        <DemosScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="Started at the show" durationInFrames={165}>
        <DealsScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="Quarter closes" durationInFrames={75}>
        <QuarterScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="Finance asks" durationInFrames={150}>
        <FinanceScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="Sales asks" durationInFrames={90}>
        <SalesScene />
      </TransitionSeries.Sequence>
      {Dissolve()}
      <TransitionSeries.Sequence name="Same person" durationInFrames={150}>
        <SamePersonScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
