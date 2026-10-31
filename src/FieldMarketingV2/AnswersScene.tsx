/*
Scene: 10 answers · full screen · 7s (two beats) · style: brand
Message: everyone has a different answer, and most are wrong.
Category: graphic-centric
Focal (centre): beat 1 "you'll get / *10 different answers*", beat 2 "and most of them / will be *wrong*"
Supporting: 10 answer pills orbiting the headline; "8 / 10 WRONG" label in beat 2
Depth: an outer ring of blank, blurred pills
Beats: 0.1s headline · 0.5s to 2.3s pills pop one every 6f · 3.3s headline blurs out ·
       3.5s camera snaps to a new angle, beat 2 writes on · 3.9s snap: 8 pills strike through one by one · hold
Camera: zoom-out 1.08 → 1.0, hard snap to 1.06 / 1.2°, drift back to 1.0
*/
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Headline, MicroLabel, progress } from "../MGKit";
import { BRAND } from "./brand";
import { AnswerPill, DepthItem, Exit, Scene } from "./parts";

const ANSWERS: { text: string; shrug?: boolean }[] = [
  { text: "They book the events" },
  { text: "Branded pens, right?" },
  { text: "Something with leads" },
  { text: "¯\\_(ツ)_/¯", shrug: true },
  { text: "They order the booth" },
  { text: "Swag. Lots of swag." },
  { text: "Trade show logistics" },
  { text: "Party planning?" },
  { text: "¯\\_(ツ)_/¯", shrug: true },
  { text: "They travel a lot" },
];

const BEAT2 = 105;
const WRONG = 120;

export const AnswersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const spin = frame * 0.0011;
  let wrongIndex = 0;

  return (
    <Scene
      cam={[
        { at: 0, scale: 1.08 },
        { at: BEAT2 - 1, scale: 1 },
        { at: BEAT2, scale: 1.06, rotate: 1.2 },
        { at: 210, scale: 1, rotate: 0 },
      ]}
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 + 0.25 - spin * 0.6;
        return (
          <DepthItem key={i} x={960 + Math.cos(a) * 1010} y={540 + Math.sin(a) * 560} at={10} blur={4} opacity={0.35} phase={i}>
            <div
              style={{
                width: 300,
                height: 70,
                borderRadius: 999,
                background: BRAND.card,
                boxShadow: BRAND.cardShadow,
              }}
            />
          </DepthItem>
        );
      })}

      {ANSWERS.map((a, i) => {
        const ang = (i / ANSWERS.length) * Math.PI * 2 - Math.PI / 2 + spin;
        const wrongAt = a.shrug ? undefined : WRONG + wrongIndex++ * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960 + Math.cos(ang) * 720,
              top: 530 + Math.sin(ang) * 375,
              translate: "-50% -50%",
            }}
          >
            <AnswerPill text={a.text} at={14 + ((i * 7) % 10) * 6} wrongAt={wrongAt} shrug={a.shrug} />
          </div>
        );
      })}

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Exit at={BEAT2 - 8}>
          <Headline rows={["you'll get", "*10 different answers*"]} at={2} sansSize={60} displaySize={124} />
        </Exit>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 28 }}>
        <Headline rows={["and most of them", "will be *wrong*"]} at={BEAT2} sansSize={60} displaySize={124} />
        <MicroLabel
          accent
          style={{
            fontSize: 22,
            letterSpacing: 6,
            opacity: progress(frame, WRONG + 6, 10),
          }}
        >
          {Math.min(8, Math.max(0, Math.floor((frame - WRONG) / 3) + 1))} / 10 wrong
        </MicroLabel>
      </AbsoluteFill>
    </Scene>
  );
};
