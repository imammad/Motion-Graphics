import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import "./brand";
import { BreakQBox, CtaBox, DateBox, PressureBox, ScenariosBox, TickerBox, ZoneBox } from "./BoxScenes";
import { Captions } from "./Captions";
import { sec } from "./kit";
import { Speaker } from "./Speaker";
import { DURATION_S, G } from "./timeline";

// "Gold 1st November update" reel, 55 s, 1080×1920 @30, Forex Trading style.
// Captions + all graphics in the client's box over the ceiling (no splits/full screens:
// the face fills the frame). Music: client-supplied Timeless instrumental from its
// second beat drop (112 s), levelled to −29 LUFS.
export const NOV_FRAMES = Math.ceil(DURATION_S * 30);

const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 1 }) => (
  <Sequence from={Math.max(0, sec(at))} durationInFrames={30} layout="none">
    <Audio src={staticFile(`anfaal3/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

const Box: React.FC<{ w: { from: number; to: number }; C: React.FC<{ dur: number }> }> = ({ w, C }) => {
  const dur = sec(w.to) - sec(w.from);
  return (
    <Sequence from={sec(w.from)} durationInFrames={dur}>
      <C dur={dur} />
    </Sequence>
  );
};

export const AnfaalNovReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#07100C" }}>
    <Audio src={staticFile("anfaal3/cut.mp4")} />
    <Audio src={staticFile("anfaal3/music.wav")} volume={(f) => Math.min(1, f / 4) * Math.min(1, (NOV_FRAMES - f) / 30)} />
    <Speaker />

    <Box w={G.ticker} C={TickerBox} />
    <Box w={G.breakQ} C={BreakQBox} />
    <Box w={G.zone} C={ZoneBox} />
    <Box w={G.pressure} C={PressureBox} />
    <Box w={G.scenarios} C={ScenariosBox} />
    <Box w={G.date} C={DateBox} />
    <Box w={G.cta} C={CtaBox} />

    <Captions />

    {Object.values(G).map((w) => (
      <Sfx key={w.from} at={w.from - 0.2} src="whoosh" vol={0.14} />
    ))}
    <Sfx at={1.9} src="pop" vol={0.3} />
    <Sfx at={17.0} src="pop" vol={0.3} />
    <Sfx at={19.3} src="thud" vol={0.35} />
    <Sfx at={24.7} src="pop" vol={0.25} />
    <Sfx at={27.2} src="pop" vol={0.25} />
    <Sfx at={28.5} src="pop" vol={0.25} />
    <Sfx at={30.9} src="thud" vol={0.3} />
    <Sfx at={33.4} src="pop" vol={0.25} />
    <Sfx at={36.2} src="pop" vol={0.25} />
    <Sfx at={40.8} src="pop" vol={0.3} />
    <Sfx at={46.6} src="pop" vol={0.25} />
    <Sfx at={48.3} src="pop" vol={0.25} />
    <Sfx at={54.0} src="pop" vol={0.3} />
  </AbsoluteFill>
);
