# Remotion cookbook

## Which kit to use

- **Repo has `src/ReelKit`** (the user's main repo): use it. `StyleContext.Provider` with a `StyleProfile`, plus `FullScreen`, `HalfScreen`, `Paper`, `WhiteCard`, `GlassCard`, `LowerThird`, `Caption`, `StepTracker`, `SliderUI`, `Cursor`, `Badge`, `Pill`, `MicroLabel`, `Confetti`, `progress`, `pop`, `easeOut`, `easeInOut`. Add a new profile in `src/ReelKit/styles/`.
- **Any other project:** copy `assets/MGKit.tsx` from this skill into `src/MGKit.tsx`. It only needs `remotion`. It has `Style` (with `BLUE_MINIMAL` and `DARK_SAAS` as examples), `StyleProvider`, `useMGStyle`, `Ground`, `Card`, `MicroLabel`, `Headline`, `Camera`, `Reveal`, `Burst`, `progress`, `pop`, `mix`, `easeOut`, `easeInOut`, `useBeat`.
- **No Remotion yet:** `npx create-video@latest --blank`, then `npm i`.

## Fonts

Load fonts before rendering. In a new project, the easiest route is `npm i @remotion/google-fonts`:

```tsx
import { loadFont as inter } from "@remotion/google-fonts/Inter";
import { loadFont as garamond } from "@remotion/google-fonts/EBGaramond";
inter("normal", { weights: ["500", "600"] });
garamond("italic", { weights: ["700"] });
```

Offline: put the woff2 in `public/fonts` and use `loadFont` from `@remotion/fonts` with `staticFile(...)`.

## A standalone full-screen scene (pattern)

```tsx
// Beat sheet in a comment at the top: message, category, focal/supporting/depth, beats.
export const MyScene: React.FC<{ style: Style }> = ({ style }) => (
  <StyleProvider value={style}>
    <Reveal kind="circle">
      <Ground focusY={52}>
        <Camera keys={[{ at: 0, scale: 1.08 }, { at: 150, scale: 1 }]}>
          {/* headline: top third */}
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
            <Headline rows={["Lead-in words", "*special phrase*"]} at={2} />
          </AbsoluteFill>
          {/* focal: centre zone */}
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <Card at={8} style={{ padding: 36, width: 720 }}>…</Card>
          </AbsoluteFill>
          {/* supporting: absolute, around the focal card; depth: faint + blurred at the edges */}
        </Camera>
      </Ground>
    </Reveal>
  </StyleProvider>
);

// Root.tsx
<Composition id="MyScene" component={MyScene} durationInFrames={150} fps={30}
  width={1080} height={1920} defaultProps={{ style: BLUE_MINIMAL }} />
```

Props must be JSON-serialisable (the style object is fine; React components are not). To render the same scene in another style, register a second composition with a different `style` prop.

## Half screen

Render the scene at 1080×960 (`height={960}`), or inside a parent at the top half: `<div style={{position:"absolute", inset:"0 0 50% 0", overflow:"hidden"}}><Ground>…</Ground></div>` with the speaker video (`<OffthreadVideo>`) in the bottom half, scaled about 1.25× on the face.

## On-screen UI over footage

```tsx
<AbsoluteFill>
  <OffthreadVideo src={staticFile("footage/cut.mp4")} />
  {/* darken + blur the lower half */}
  <AbsoluteFill style={{ backdropFilter: "blur(14px)", maskImage: "linear-gradient(180deg, transparent 38%, black 62%)",
    WebkitMaskImage: "linear-gradient(180deg, transparent 38%, black 62%)",
    background: "linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(0,0,0,.7) 70%, rgba(0,0,0,.85) 100%)" }} />
  {/* UI at 75% scale, lower third */}
  <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", justifyContent: "center",
    transform: "scale(0.75)", transformOrigin: "50% 0%" }}>
    <div style={{ background: style.uiGlass, border: "1px solid rgba(255,255,255,.08)", borderRadius: 26, padding: "22px 30px" }}>…</div>
  </div>
</AbsoluteFill>
```

## Useful snippets

- Draw-on line: an SVG `path` with `strokeDasharray={L}` and `strokeDashoffset={L * (1 - progress(frame, start, 40))}`.
- Count-up: `interpolate(progress(frame, s, 40), [0, 1], [from, to]).toFixed(1)`.
- Snap: `scale = interpolate(progress(frame, 34, 10), [0, 1], [1.45, 1])`.
- Float: `translateY(Math.sin(frame / 20) * 6)`.
- Deterministic randomness: `Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1` (never `Math.random()`).
- Images: `<Img src={staticFile("assets/x.png")} />`; video: `<OffthreadVideo>`.

## Render and check

```bash
npx tsc --noEmit
npx remotion still MyScene out/myscene-60.png --frame=60
npx remotion render MyScene out/myscene.mp4
```

In a sandbox without Remotion's browser download, pass `--browser-executable=<path to chrome-headless-shell>`. Look at stills at every beat before rendering the video.
