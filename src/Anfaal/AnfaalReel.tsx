import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import "./brand";
import { Captions } from "./Captions";
import { LiquidityScene, RumoursScene } from "./FullScreens";
import { sec } from "./kit";
import { HookPills, LessonPills } from "./Overlays";
import { FullScreen, Speaker, SplitPanel } from "./Speaker";
import { CtaSplit, OddsSplit, RangeSplit, RateSplit, SupportSplit } from "./Splits";
import { BEHIND, DURATION_S, SCENES } from "./timeline";

// Anfaal · "FOMC gold facts" reel, 60 s, 1080×1920 @30.
// Base: graded + denoised cut (public/anfaal/cut.mp4). Layers: speaker (camera,
// text behind head) → split panels / full screens → overlays → captions.
export const ANFAAL_FRAMES = Math.ceil(DURATION_S * 30);

const S = (k: keyof typeof SCENES) => ({ from: sec(SCENES[k].from), dur: sec(SCENES[k].to) - sec(SCENES[k].from) });

const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 1 }) => (
  <Sequence from={Math.max(0, sec(at))} durationInFrames={30} layout="none">
    <Audio src={staticFile(`anfaal/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

const Split: React.FC<{ k: keyof typeof SCENES; children: React.ReactNode }> = ({ k, children }) => {
  const { from, dur } = S(k);
  return (
    <Sequence from={from} durationInFrames={dur}>
      <SplitPanel from={SCENES[k].from} to={SCENES[k].to}>
        {children}
      </SplitPanel>
    </Sequence>
  );
};

const Full: React.FC<{ k: keyof typeof SCENES; children: React.ReactNode }> = ({ k, children }) => {
  const { from, dur } = S(k);
  return (
    <Sequence from={from} durationInFrames={dur}>
      <FullScreen dur={dur}>{children}</FullScreen>
    </Sequence>
  );
};

export const AnfaalReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#07100C" }}>
      <Audio src={staticFile("anfaal/cut.mp4")} />
      <Speaker />

      <Split k="rateSplit">
        <RateSplit />
      </Split>
      <Split k="oddsSplit">
        <OddsSplit />
      </Split>
      <Split k="rangeSplit">
        <RangeSplit />
      </Split>
      <Split k="supportSplit">
        <SupportSplit />
      </Split>
      <Split k="ctaSplit">
        <CtaSplit />
      </Split>

      <Full k="rumours">
        <RumoursScene />
      </Full>
      <Full k="liquidity">
        <LiquidityScene />
      </Full>

      <Sequence from={0} durationInFrames={sec(3.55)}>
        <HookPills />
      </Sequence>
      <Sequence from={sec(45.6)} durationInFrames={sec(51.73) - sec(45.6)}>
        <LessonPills />
      </Sequence>

      <Captions />

      {/* sound design: soft, low in the mix */}
      {Object.values(SCENES).map((s) => (
        <Sfx key={s.from} at={s.from - 0.15} src="whoosh" vol={0.35} />
      ))}
      {BEHIND.map((b) => (
        <Sfx key={b.word} at={b.from} src="whoosh" vol={0.22} />
      ))}
      <Sfx at={0.9} src="pop" vol={0.5} />
      <Sfx at={1.95} src="pop" vol={0.5} />
      <Sfx at={6.35} src="thud" vol={0.7} />
      <Sfx at={14.55} src="pop" vol={0.5} />
      <Sfx at={19.0} src="pop" vol={0.45} />
      <Sfx at={36.4} src="pop" vol={0.45} />
      <Sfx at={42.7} src="thud" vol={0.7} />
      <Sfx at={45.6} src="pop" vol={0.45} />
      <Sfx at={47.53} src="pop" vol={0.45} />
      <Sfx at={50.85} src="thud" vol={0.6} />
      <Sfx at={58.3} src="pop" vol={0.5} />
    </AbsoluteFill>
  );
};
