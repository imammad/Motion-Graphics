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
import { DealsScene } from "./EventROI/DealsScene";
import { DemosScene } from "./EventROI/DemosScene";
import { EventROIVideo, SCENES as ROI_SCENES, TOTAL_DURATION as EVENT_ROI_DURATION } from "./EventROI/EventROIVideo";
import { FinanceScene } from "./EventROI/FinanceScene";
import { AutomationScene } from "./ToolStack/AutomationScene";
import { CalendarScene } from "./ToolStack/CalendarScene";
import { CRMScene } from "./ToolStack/CRMScene";
import { LivesInsideScene } from "./ToolStack/LivesInsideScene";
import { ShowFloorScene } from "./ToolStack/ShowFloorScene";
import { StackScene } from "./ToolStack/StackScene";
import { SCENES as STACK_SCENES, ToolStackVideo, TOTAL_DURATION as TOOL_STACK_DURATION } from "./ToolStack/ToolStackVideo";
import { withBackground } from "./Wave/GridBackground";
import { OpportunitiesScene } from "./EventROI/OpportunitiesScene";
import { QuarterScene } from "./EventROI/QuarterScene";
import { SalesScene } from "./EventROI/SalesScene";
import { SamePersonScene } from "./EventROI/SamePersonScene";

const scenes = [
  { id: "Ask", component: AskScene, durationInFrames: SCENES.ask },
  { id: "Role", component: RoleScene, durationInFrames: SCENES.role },
  { id: "Answers", component: AnswersScene, durationInFrames: SCENES.answers },
  { id: "Events", component: EventsScene, durationInFrames: SCENES.events },
  { id: "Booth", component: BoothScene, durationInFrames: SCENES.booth },
  { id: "Shrug", component: ShrugScene, durationInFrames: SCENES.shrug },
];

const roiScenes = [
  { id: "Opportunities", component: OpportunitiesScene, durationInFrames: ROI_SCENES.opportunities },
  { id: "Demos", component: DemosScene, durationInFrames: ROI_SCENES.demos },
  { id: "Deals", component: DealsScene, durationInFrames: ROI_SCENES.deals },
  { id: "Quarter", component: QuarterScene, durationInFrames: ROI_SCENES.quarter },
  { id: "Finance", component: FinanceScene, durationInFrames: ROI_SCENES.finance },
  { id: "Sales", component: SalesScene, durationInFrames: ROI_SCENES.sales },
  { id: "SamePerson", component: SamePersonScene, durationInFrames: ROI_SCENES.samePerson },
].map((s) => ({ ...s, component: withBackground(s.component) }));

const toolStackScenes = [
  { id: "LivesInside", component: LivesInsideScene, durationInFrames: STACK_SCENES.livesInside },
  { id: "Stack", component: StackScene, durationInFrames: STACK_SCENES.stack },
  { id: "CRM", component: CRMScene, durationInFrames: STACK_SCENES.crm },
  { id: "Automation", component: AutomationScene, durationInFrames: STACK_SCENES.automation },
  { id: "Calendar", component: CalendarScene, durationInFrames: STACK_SCENES.calendar },
  { id: "ShowFloor", component: ShowFloorScene, durationInFrames: STACK_SCENES.showFloor },
].map((s) => ({ ...s, component: withBackground(s.component) }));

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
      <Composition
        id="EventROI"
        component={EventROIVideo}
        durationInFrames={EVENT_ROI_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ToolStack"
        component={ToolStackVideo}
        durationInFrames={TOOL_STACK_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Folder name="ToolStack-Scenes">
        {toolStackScenes.map((s) => (
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
      <Folder name="EventROI-Scenes">
        {roiScenes.map((s) => (
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
