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
import { planDuration } from "./ReelKit";
import { DemoReel } from "./Reels/Demo/DemoReel";
import { demoPlan } from "./Reels/Demo/plan";
import { FPS, HEIGHT, WIDTH } from "./FieldMarketing/theme";

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
      <Folder name="Reels">
        <Composition
          id="ReelDemo"
          component={DemoReel}
          durationInFrames={planDuration(demoPlan)}
          fps={demoPlan.fps}
          width={demoPlan.width}
          height={demoPlan.height}
        />
      </Folder>
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
    </>
  );
};
