import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import "./brand";
import { Captions } from "./Captions";
import { sec } from "./kit";
import { CashScene, HookSplit, MarketPills, OilSplit, PlanSplit } from "./Scenes";
import { FullScreen, Speaker, SplitPanel } from "./Speaker";
import { CtaSplit } from "./Splits";
import { BEHIND, DURATION_S, PILLS, SCENES } from "./timeline";

// "AI bubble burst · gold 3872 · oil $105" reel, 38.45 s, 1080×1920 @30, Forex Trading style.
// Base: client's cut, graded + voice-cleaned (public/anfaal2/cut.mp4). Music: client-supplied
// Timeless instrumental, from the beat drop, levelled to −29 LUFS (≈15 dB under the voice).
export const AI_FRAMES = Math.ceil(DURATION_S * 30);

type K = keyof typeof SCENES;
const win = (k: K) => ({ from: sec(SCENES[k].from), dur: sec(SCENES[k].to) - sec(SCENES[k].from) });

const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 1 }) => (
  <Sequence from={Math.max(0, sec(at))} durationInFrames={30} layout="none">
    <Audio src={staticFile(`anfaal2/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

const Split: React.FC<{ k: K; children: React.ReactNode }> = ({ k, children }) => (
  <Sequence from={win(k).from} durationInFrames={win(k).dur}>
    <SplitPanel from={SCENES[k].from} to={SCENES[k].to}>
      {children}
    </SplitPanel>
  </Sequence>
);

export const AnfaalAIReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#07100C" }}>
    <Audio src={staticFile("anfaal2/cut.mp4")} />
    <Audio src={staticFile("anfaal2/music.wav")} volume={(f) => Math.min(1, f / 4) * Math.min(1, (AI_FRAMES - f) / 30)} />
    <Speaker />

    <Split k="hookSplit">
      <HookSplit />
    </Split>
    <Split k="oilSplit">
      <OilSplit />
    </Split>
    <Split k="planSplit">
      <PlanSplit />
    </Split>
    <Split k="ctaSplit">
      <CtaSplit />
    </Split>

    <Sequence from={win("cash").from} durationInFrames={win("cash").dur}>
      <FullScreen dur={win("cash").dur}>
        <CashScene />
      </FullScreen>
    </Sequence>

    <Sequence from={sec(PILLS.from)} durationInFrames={sec(PILLS.to) - sec(PILLS.from)}>
      <MarketPills />
    </Sequence>

    <Captions />

    {/* soft sound design */}
    {Object.values(SCENES)
      .filter((s) => s.from > 0)
      .map((s) => (
        <Sfx key={s.from} at={s.from - 0.25} src="whoosh" vol={0.16} />
      ))}
    {BEHIND.map((b) => (
      <Sfx key={b.word} at={b.from - 0.2} src="whoosh" vol={0.1} />
    ))}
    <Sfx at={0.95} src="thud" vol={0.4} />
    <Sfx at={3.0} src="pop" vol={0.3} />
    <Sfx at={4.47} src="pop" vol={0.3} />
    <Sfx at={10.85} src="pop" vol={0.25} />
    <Sfx at={12.65} src="pop" vol={0.3} />
    <Sfx at={15.1} src="pop" vol={0.25} />
    <Sfx at={16.4} src="pop" vol={0.25} />
    <Sfx at={17.6} src="pop" vol={0.25} />
    <Sfx at={19.7} src="thud" vol={0.35} />
    <Sfx at={22.8} src="pop" vol={0.3} />
    <Sfx at={23.67} src="pop" vol={0.3} />
    <Sfx at={27.8} src="pop" vol={0.3} />
    <Sfx at={37.8} src="pop" vol={0.3} />
  </AbsoluteFill>
);
