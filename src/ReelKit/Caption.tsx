import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { easeOut, progress } from "./motion";
import { useStyle } from "./style";

/**
 * Two-font caption: small sans for regular words, big accent-coloured script
 * for *special words*. Write rows with markup, e.g.
 *   rows={["These *three mistakes*", "make your edits look like an amateur"]}
 * Each word pops up from slightly below, fades in and un-blurs. Script words
 * animate letter by letter. Pass `times` (frame of each word, relative to the
 * Sequence) to sync to a word-level transcript; otherwise words are spread
 * evenly so the whole line lands within `captionMaxSeconds`.
 */
export type CaptionPosition = "lower" | "chest" | "top" | number;

type Word = { text: string; script: boolean; row: number };

const parse = (rows: string[]): Word[] => {
  const words: Word[] = [];
  rows.forEach((row, r) => {
    // Split into *script* groups and plain text.
    const parts = row.split(/(\*[^*]+\*)/g).filter(Boolean);
    for (const part of parts) {
      const script = part.startsWith("*") && part.endsWith("*");
      const clean = script ? part.slice(1, -1) : part;
      for (const w of clean.split(/\s+/).filter(Boolean)) {
        words.push({ text: w, script, row: r });
      }
    }
  });
  return words;
};

const positionToTop = (pos: CaptionPosition, height: number) => {
  if (typeof pos === "number") return pos;
  if (pos === "top") return height * 0.1;
  if (pos === "chest") return height * 0.45;
  return height * 0.6;
};

export const Caption: React.FC<{
  rows: string[];
  times?: number[];
  position?: CaptionPosition;
  onPaper?: boolean; // dark text on the off-white background
  exitAt?: number; // frame (relative) where the line blurs out
  sansSize?: number;
  scriptSize?: number;
  align?: "center" | "left" | "right";
  x?: number; // horizontal offset in px from centre
}> = ({
  rows,
  times,
  position = "lower",
  onPaper = false,
  exitAt,
  sansSize = 36,
  scriptSize = 78,
  align = "center",
  x = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const s = useStyle();
  const words = parse(rows);

  const maxFrames = s.captionMaxSeconds * fps;
  const step = Math.min(4, Math.max(2, Math.floor(maxFrames / Math.max(words.length, 1))));
  const startOf = (i: number) => (times ? times[i] ?? times[times.length - 1] : i * step);

  const exit = exitAt === undefined ? 0 : progress(frame, exitAt, 6);
  const sansColor = onPaper ? s.ink : s.captionColor;
  const sansShadow = onPaper ? "none" : "0 2px 10px rgba(0,0,0,0.45)";

  const renderWord = (w: Word, i: number) => {
    const t0 = startOf(i);
    if (!w.script) {
      const p = progress(frame, t0, 9);
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            fontFamily: s.sansFont,
            fontWeight: s.sansWeight,
            fontSize: sansSize,
            color: sansColor,
            letterSpacing: -0.3,
            textShadow: sansShadow,
            opacity: p,
            transform: `translateY(${(1 - p) * 14}px)`,
            filter: `blur(${(1 - p) * 6}px)`,
            marginRight: sansSize * 0.26,
          }}
        >
          {w.text}
        </span>
      );
    }
    // Script word: letter by letter.
    const letters = [...w.text];
    return (
      <span
        key={i}
        style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: scriptSize * 0.22 }}
      >
        {letters.map((ch, j) => {
          const p = progress(frame, t0 + j * 1.2, 10);
          return (
            <span
              key={j}
              style={{
                display: "inline-block",
                fontFamily: s.scriptFont,
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: scriptSize,
                lineHeight: 0.95,
                color: s.accent,
                textShadow: `0 0 28px ${s.accentGlow}, 0 2px 8px rgba(0,0,0,${onPaper ? 0 : 0.25})`,
                opacity: p,
                transform: `translateY(${(1 - p) * 20}px)`,
                filter: `blur(${(1 - p) * 9}px)`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </span>
    );
  };

  const rowCount = rows.length;
  const justify = align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end";

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: positionToTop(position, height),
          left: 70 + x,
          right: 70 - x,
          display: "flex",
          flexDirection: "column",
          alignItems: justify,
          gap: 2,
          opacity: interpolate(exit, [0, 1], [1, 0]),
          filter: `blur(${exit * 10}px)`,
          transform: `translateY(${exit * -10}px)`,
        }}
      >
        {Array.from({ length: rowCount }).map((_, r) => (
          <div
            key={r}
            style={{ display: "flex", alignItems: "baseline", justifyContent: justify, flexWrap: "wrap" }}
          >
            {words.map((w, i) => (w.row === r ? renderWord(w, i) : null))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Re-exported so scenes can reuse the same entrance on any element.
export const useWordEntrance = (start: number, duration = 9) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, duration, easeOut);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * 14}px)`,
    filter: `blur(${(1 - p) * 6}px)`,
  } as React.CSSProperties;
};
