import { Composition, Folder } from "remotion";
import { AnswersScene } from "./FieldMarketing/AnswersScene";
import { AskScene } from "./FieldMarketing/AskScene";
import { BoothScene } from "./FieldMarketing/BoothScene";
import { EventsScene } from "./FieldMarketing/EventsScene";
import {
  FieldMarketingVideo,
  SCENES,
  TOTAL_DURATION,
} from "./FieldMarketing/FieldMarketingVideo";
import { RoleScene } from "./FieldMarketing/RoleScene";
import { ShrugScene } from "./FieldMarketing/ShrugScene";
import { FPS, HEIGHT, WIDTH } from "./FieldMarketing/theme";
import { HUB_SECONDS, HubSpokes } from "./Inflation/HubSpokes";
import { PRICE_LINE_SECONDS, PriceLine } from "./Inflation/PriceLine";
import { STAIRCASE_SECONDS, Staircase } from "./Inflation/Staircase";
import { VALUE_SHIFT_SECONDS, ValueShift } from "./Inflation/ValueShift";
import { STORYBOARD } from "./Inflation/frames";
import { NEGATIVE_SECONDS, Negative } from "./Intro/Negative";
import { ON_PAPER_SECONDS, OnPaper } from "./Intro/OnPaper";
import { THEN_NOW_SECONDS, ThenNow } from "./Intro/ThenNow";
import { FPS as INFLATION_FPS, SceneProps } from "./Inflation/theme";

const inflation = [
  { id: "T1-PriceLine", component: PriceLine, seconds: PRICE_LINE_SECONDS },
  { id: "T2-ValueShift", component: ValueShift, seconds: VALUE_SHIFT_SECONDS },
  { id: "T3-Staircase", component: Staircase, seconds: STAIRCASE_SECONDS },
  { id: "T4-HubSpokes", component: HubSpokes, seconds: HUB_SECONDS },
];
const intro = [
  { id: "Intro1-ThenNow", component: ThenNow, seconds: THEN_NOW_SECONDS },
  { id: "Intro2-OnPaper", component: OnPaper, seconds: ON_PAPER_SECONDS },
  { id: "Intro3-Negative", component: Negative, seconds: NEGATIVE_SECONDS },
];
const themes: { suffix: string; props: SceneProps }[] = [
  { suffix: "Dark", props: { theme: "dark" } },
  { suffix: "Light", props: { theme: "light" } },
];

const scenes = [
  { id: "Ask", component: AskScene, durationInFrames: SCENES.ask },
  { id: "Role", component: RoleScene, durationInFrames: SCENES.role },
  { id: "Answers", component: AnswersScene, durationInFrames: SCENES.answers },
  { id: "Events", component: EventsScene, durationInFrames: SCENES.events },
  { id: "Booth", component: BoothScene, durationInFrames: SCENES.booth },
  { id: "Shrug", component: ShrugScene, durationInFrames: SCENES.shrug },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FieldMarketing"
        component={FieldMarketingVideo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Folder name="FieldMarketing-Scenes">
        {scenes.map((s) => (
          <Composition
            key={s.id}
            id={s.id}
            component={s.component}
            durationInFrames={s.durationInFrames}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
        ))}
      </Folder>
      <Folder name="Inflation">
        {inflation.flatMap((s) =>
          themes.map((th) => (
            <Composition
              key={`${s.id}-${th.suffix}`}
              id={`${s.id}-${th.suffix}`}
              component={s.component}
              durationInFrames={Math.round(s.seconds * INFLATION_FPS)}
              fps={INFLATION_FPS}
              width={WIDTH}
              height={HEIGHT}
              defaultProps={th.props}
            />
          )),
        )}
      </Folder>
      <Folder name="Inflation-Storyboard">
        {STORYBOARD.flatMap((s) =>
          themes.map((th) => (
            <Composition
              key={`${s.id}-${th.suffix}`}
              id={`${s.id}-${th.suffix}`}
              component={s.component as React.FC<Record<string, unknown>>}
              durationInFrames={Math.round(s.seconds * INFLATION_FPS)}
              fps={INFLATION_FPS}
              width={WIDTH}
              height={HEIGHT}
              defaultProps={{ ...s.props, ...th.props }}
            />
          )),
        )}
      </Folder>
      <Folder name="Inflation-Intro">
        {intro.map((s) => (
          <Composition
            key={s.id}
            id={s.id}
            component={s.component}
            durationInFrames={Math.round(s.seconds * INFLATION_FPS)}
            fps={INFLATION_FPS}
            width={WIDTH}
            height={HEIGHT}
          />
        ))}
      </Folder>
    </>
  );
};
