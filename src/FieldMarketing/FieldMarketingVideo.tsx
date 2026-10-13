import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AnswersScene } from "./AnswersScene";
import { AskScene } from "./AskScene";
import { BoothScene } from "./BoothScene";
import { EventsScene } from "./EventsScene";
import { RoleScene } from "./RoleScene";
import { ShrugScene } from "./ShrugScene";

export const SCENES = {
  ask: 150,
  role: 135,
  answers: 190,
  events: 135,
  booth: 150,
  shrug: 150,
};
const TRANSITION = 15;

export const TOTAL_DURATION =
  Object.values(SCENES).reduce((a, b) => a + b, 0) -
  (Object.keys(SCENES).length - 1) * TRANSITION;

export const FieldMarketingVideo: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Ask 10 people" durationInFrames={150}>
      <AskScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: TRANSITION })}
    />
    <TransitionSeries.Sequence name="The role" durationInFrames={135}>
      <RoleScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={slide({ direction: "from-bottom" })}
      timing={springTiming({ durationInFrames: TRANSITION, config: { damping: 200 } })}
    />
    <TransitionSeries.Sequence name="10 answers" durationInFrames={190}>
      <AnswersScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={slide({ direction: "from-right" })}
      timing={springTiming({ durationInFrames: TRANSITION, config: { damping: 200 } })}
    />
    <TransitionSeries.Sequence name="Booked the events" durationInFrames={135}>
      <EventsScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={slide({ direction: "from-right" })}
      timing={springTiming({ durationInFrames: TRANSITION, config: { damping: 200 } })}
    />
    <TransitionSeries.Sequence name="Booth and pens" durationInFrames={150}>
      <BoothScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={wipe({ direction: "from-bottom" })}
      timing={linearTiming({ durationInFrames: TRANSITION })}
    />
    <TransitionSeries.Sequence name="Shrug" durationInFrames={150}>
      <ShrugScene />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
