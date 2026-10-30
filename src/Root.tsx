import { Composition, Folder } from "remotion";
import { CardsScene } from "./DocusignVertical/CardsScene";
import { DocsScene } from "./DocusignVertical/DocsScene";
import { DocUIScene } from "./DocusignVertical/DocUIScene";
import { DocusignVertical } from "./DocusignVertical/DocusignVertical";
import { FinaleScene } from "./DocusignVertical/FinaleScene";
import { Split } from "./DocusignVertical/Footage";
import * as V from "./DocusignVertical/theme";
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

const verticalScenes = [
  {
    id: "V-DocUI",
    component: DocUIScene,
    from: V.CUTS.docUi,
    to: V.CUTS.talk2,
  },
  { id: "V-Docs", component: DocsScene, from: V.CUTS.docs, to: V.CUTS.split },
  { id: "V-Split", component: Split, from: V.CUTS.split, to: V.CUTS.meeting },
  {
    id: "V-Cards",
    component: CardsScene,
    from: V.CUTS.cards,
    to: V.CUTS.talk3,
  },
  {
    id: "V-Finale",
    component: FinaleScene,
    from: V.CUTS.finale,
    to: V.CUTS.end,
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DocusignVertical"
        component={DocusignVertical}
        durationInFrames={V.TOTAL_DURATION}
        fps={V.FPS}
        width={V.WIDTH}
        height={V.HEIGHT}
      />
      <Folder name="DocusignVertical-Scenes">
        {verticalScenes.map((s) => (
          <Composition
            key={s.id}
            id={s.id}
            component={s.component}
            durationInFrames={s.to - s.from}
            fps={V.FPS}
            width={V.WIDTH}
            height={V.HEIGHT}
          />
        ))}
      </Folder>
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
