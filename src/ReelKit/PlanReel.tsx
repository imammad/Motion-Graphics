import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import "./fonts";
import { Caption } from "./Caption";
import { FullScreen, HalfScreen } from "./layouts";
import type { Plan, PlanLine } from "./plan";
import { Speaker, UIFocus, ZoomKey } from "./Speaker";
import { BLUE_MINIMAL, StyleContext, StyleProfile } from "./style";

/** Props every custom scene receives. Frames are relative to the line start. */
export type SceneProps = { line: PlanLine; durationInFrames: number; speakerSrc?: string; startFrom: number };
export type SceneRegistry = Record<string, React.FC<SceneProps>>;

/**
 * Renders a whole reel from a plan:
 * - one continuous speaker layer carries the audio,
 * - every line becomes a Sequence of its scene type,
 * - captions are drawn automatically (unless a scene owns its text).
 */
export const PlanReel: React.FC<{ plan: Plan; scenes: SceneRegistry; baseStyle?: StyleProfile }> = ({
  plan,
  scenes,
  baseStyle = BLUE_MINIMAL,
}) => {
  const { fps } = useVideoConfig();
  const style = { ...baseStyle, ...plan.style };
  const f = (s: number) => Math.round(s * fps);

  // Speaker camera: slow push-in per captions line, punch-in where requested.
  const zooms: ZoomKey[] = [];
  for (const l of plan.lines) {
    const z = l.zoom ?? (l.type === "captions" ? "push" : "none");
    const a = f(l.start);
    const b = f(l.end);
    if (z === "punch") {
      zooms.push({ at: a, scale: 1.0 }, { at: a + 8, scale: 1.18, y: 60 }, { at: b, scale: 1.22, y: 70 });
    } else if (z === "push") {
      zooms.push({ at: a, scale: 1.0 }, { at: b, scale: 1.06 });
    } else {
      zooms.push({ at: a, scale: 1.0 }, { at: b, scale: 1.0 });
    }
  }

  return (
    <StyleContext.Provider value={style}>
      <AbsoluteFill style={{ background: "#000" }}>
        <Speaker src={plan.speakerSrc} zooms={zooms} />
        {plan.lines.map((line) => {
          const from = f(line.start);
          const dur = Math.max(1, f(line.end) - from);
          const times = line.captionTimes?.map((t) => f(t) - from);
          const Scene = line.scene ? scenes[line.scene] : undefined;
          const sceneProps: SceneProps = { line, durationInFrames: dur, speakerSrc: plan.speakerSrc, startFrom: from };
          const caption = (onPaper: boolean, position = line.captionPosition) => (
            <Caption
              rows={line.caption}
              times={times}
              position={position ?? (onPaper ? "top" : "lower")}
              onPaper={onPaper}
              exitAt={dur - 6}
            />
          );

          let body: React.ReactNode;
          if (line.type === "captions") {
            body = caption(false);
          } else if (line.type === "captions_ui") {
            body = (
              <>
                <UIFocus at={0} until={dur - 8} />
                {caption(false, line.captionPosition ?? 1000)}
                {Scene ? <Scene {...sceneProps} /> : null}
              </>
            );
          } else if (line.type === "half") {
            body = (
              <HalfScreen
                speakerSrc={plan.speakerSrc}
                speakerStartFrom={from}
                top={Scene ? <Scene {...sceneProps} /> : null}
                bottom={line.captionInScene ? null : caption(false, line.captionPosition ?? 120)}
              />
            );
          } else {
            body = (
              <FullScreen>
                {Scene ? <Scene {...sceneProps} /> : null}
                {line.captionInScene ? null : caption(true)}
              </FullScreen>
            );
          }
          return (
            <Sequence key={line.id} from={from} durationInFrames={dur} name={`${line.id} · ${line.type}`}>
              {body}
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </StyleContext.Provider>
  );
};
