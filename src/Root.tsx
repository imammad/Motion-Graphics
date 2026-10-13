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
import { CollectionLocations } from "./HubBox/CollectionLocations";
import * as HubBox from "./HubBox/theme";

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
      <Folder name="HubBox">
        <Composition
          id="HubBoxCollectionLocations"
          component={CollectionLocations}
          durationInFrames={HubBox.DURATION_S * HubBox.FPS}
          fps={HubBox.FPS}
          width={HubBox.WIDTH}
          height={HubBox.HEIGHT}
        />
        {/* Same animation at 8 subframes per frame; blended down to 60fps for motion blur. */}
        <Composition
          id="HubBoxCollectionLocations-480"
          component={CollectionLocations}
          durationInFrames={HubBox.DURATION_S * HubBox.FPS * 8}
          fps={HubBox.FPS * 8}
          width={HubBox.WIDTH}
          height={HubBox.HEIGHT}
        />
      </Folder>
    </>
  );
};
