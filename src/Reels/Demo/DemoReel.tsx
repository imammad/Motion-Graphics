import React from "react";
import { PlanReel } from "../../ReelKit";
import { demoPlan } from "./plan";
import { demoScenes } from "./scenes";

// Scene components can't travel through Remotion props (they must be JSON),
// so each reel gets a tiny wrapper that wires its plan to its scene registry.
export const DemoReel: React.FC = () => <PlanReel plan={demoPlan} scenes={demoScenes} />;
