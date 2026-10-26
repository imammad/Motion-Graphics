import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";

// The synthesised kit in public/sfx (scripts/make-inflation-sfx.py).
export type SfxName =
  | "whoosh-soft"
  | "whoosh"
  | "swoosh"
  | "draw"
  | "pop"
  | "pop-high"
  | "blip1"
  | "blip2"
  | "blip3"
  | "blip4"
  | "blip5"
  | "blip-low"
  | "impact"
  | "tick"
  | "ding"
  | "riser"
  | "strike";

// Kept well under the voice-over; one place to trim the whole mix.
const SFX_GAIN = 0.55;

// Plays a sound effect starting `at` seconds into the scene. Cues that never
// fire (999) or fall before the start are skipped.
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({ name, at, volume = 0.5 }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const from = Math.round(at * fps);
  if (at < 0 || from >= durationInFrames) return null;
  return (
    <Sequence from={from} layout="none" name={`sfx ${name}`}>
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume * SFX_GAIN} />
    </Sequence>
  );
};

export const BLIPS: SfxName[] = ["blip1", "blip2", "blip3", "blip4", "blip5"];
