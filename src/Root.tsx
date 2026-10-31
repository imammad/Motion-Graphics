import { Composition, Folder } from "remotion";
import { ANFAAL_FRAMES, AnfaalReel } from "./Anfaal/AnfaalReel";
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
import { AnswersScene as AnswersV2 } from "./FieldMarketingV2/AnswersScene";
import { BoothScene as BoothV2 } from "./FieldMarketingV2/BoothScene";
import { EventsScene as EventsV2 } from "./FieldMarketingV2/EventsScene";
import { FieldMarketingV2, SCENES_V2, TOTAL_V2 } from "./FieldMarketingV2/FieldMarketingV2";
import { HookScene as HookV2 } from "./FieldMarketingV2/HookScene";
import { RoleScene as RoleV2 } from "./FieldMarketingV2/RoleScene";
import { ShrugScene as ShrugV2 } from "./FieldMarketingV2/ShrugScene";

const scenes = [
  { id: "Ask", component: AskScene, durationInFrames: SCENES.ask },
  { id: "Role", component: RoleScene, durationInFrames: SCENES.role },
  { id: "Answers", component: AnswersScene, durationInFrames: SCENES.answers },
  { id: "Events", component: EventsScene, durationInFrames: SCENES.events },
  { id: "Booth", component: BoothScene, durationInFrames: SCENES.booth },
  { id: "Shrug", component: ShrugScene, durationInFrames: SCENES.shrug },
];

const scenesV2 = [
  { id: "V2-Hook", component: HookV2, durationInFrames: SCENES_V2.hook },
  { id: "V2-Role", component: RoleV2, durationInFrames: SCENES_V2.role },
  { id: "V2-Answers", component: AnswersV2, durationInFrames: SCENES_V2.answers },
  { id: "V2-Events", component: EventsV2, durationInFrames: SCENES_V2.events },
  { id: "V2-Booth", component: BoothV2, durationInFrames: SCENES_V2.booth },
  { id: "V2-Shrug", component: ShrugV2, durationInFrames: SCENES_V2.shrug },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AnfaalFOMC"
        component={AnfaalReel}
        durationInFrames={ANFAAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FieldMarketingV2"
        component={FieldMarketingV2}
        durationInFrames={TOTAL_V2}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Folder name="FieldMarketingV2-Scenes">
        {scenesV2.map((s) => (
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
      <Folder name="FieldMarketing-v1">
        <Composition
          id="FieldMarketing"
          component={FieldMarketingVideo}
          durationInFrames={TOTAL_DURATION}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
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
    </>
  );
};
