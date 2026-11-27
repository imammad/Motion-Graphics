import { Composition, Folder } from "remotion";
import { CollectionVideo } from "./HubBoxCollection/CollectionVideo";
import { ObsessivelyDesigned } from "./ObsessivelyDesigned/ObsessivelyDesigned";
import { PickupPointMap } from "./PickupPointMap/PickupPointMap";
import * as HB from "./HubBoxCollection/theme";
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
        id="PickupPointMap"
        component={PickupPointMap}
        durationInFrames={612}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="ObsessivelyDesigned"
        component={ObsessivelyDesigned}
        durationInFrames={420}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="HubBoxCollection"
        component={CollectionVideo}
        durationInFrames={HB.DURATION}
        fps={HB.FPS}
        width={HB.WIDTH}
        height={HB.HEIGHT}
      />
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
    </>
  );
};
