import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AnswersScene } from "./AnswersScene";
import { BoothScene } from "./BoothScene";
import { EventsScene } from "./EventsScene";
import { HookScene } from "./HookScene";
import { RoleScene } from "./RoleScene";
import { ShrugScene } from "./ShrugScene";

// Scene lengths at ~2.5 spoken words per second; adjust these to sync a voice-over.
export const SCENES_V2 = {
  hook: 100,
  role: 110,
  answers: 210,
  events: 120,
  booth: 140,
  shrug: 130,
};
const T = 10;

export const TOTAL_V2 =
  Object.values(SCENES_V2).reduce((a, b) => a + b, 0) - (Object.keys(SCENES_V2).length - 1) * T;

// Same ground in every scene, so a short fade reads as content dissolving while the camera keeps moving.
const cut = <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />;

export const FieldMarketingV2: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Hook" durationInFrames={100}>
      <HookScene />
    </TransitionSeries.Sequence>
    {cut}
    <TransitionSeries.Sequence name="Role" durationInFrames={110}>
      <RoleScene />
    </TransitionSeries.Sequence>
    {cut}
    <TransitionSeries.Sequence name="10 answers" durationInFrames={210}>
      <AnswersScene />
    </TransitionSeries.Sequence>
    {cut}
    <TransitionSeries.Sequence name="Booked the events" durationInFrames={120}>
      <EventsScene />
    </TransitionSeries.Sequence>
    {cut}
    <TransitionSeries.Sequence name="Booth and pens" durationInFrames={140}>
      <BoothScene />
    </TransitionSeries.Sequence>
    {cut}
    <TransitionSeries.Sequence name="Shrug" durationInFrames={130}>
      <ShrugScene />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
