# Template: Forex Premium Motion reel (Remotion 4)

1. New project: `npx create-video@latest --blank`, then `npm i @remotion/fonts`.
2. Copy `src/GoldMoves/` → `src/<Project>/` and `public/fonts/*` → `public/fonts/`.
3. Media in `public/gm/` (rename the folder and the `gm/` paths for a new project):
   `cut.mp4` (graded + voice-cleaned footage), `music.wav` (client song, levelled),
   `cut_<t>.png` (frozen outgoing frame per jump cut), `signals.png` / `pnl.png` (community screenshots),
   `frame20.png` (a still for the type board), `cover_frame.png` + `cover_person.png` (cover cut-out),
   `sfx/whoosh.wav`, `sfx/pop.wav`, `sfx/thud.wav` (make them with the skill's `make_audio.py`).
4. Register in `src/Root.tsx`:

```tsx
import { Composition, Folder, Still } from "remotion";
import { GM2_FRAMES, GoldMovesReel2 } from "./GoldMoves/Reel2";
import { GoldMovesCover } from "./GoldMoves/Cover";
import { CtaScene, DropScene, HookScene, HookTest, TypeBoard, WeekScene } from "./GoldMoves/Scenes";

<Composition id="GoldMoves2" component={GoldMovesReel2} durationInFrames={GM2_FRAMES} fps={30} width={1080} height={1920} />
<Still id="GoldMovesCover" component={GoldMovesCover} width={1080} height={1920} />
<Folder name="Storyboard">
  <Still id="GM-TypeBoard" component={TypeBoard} width={3240} height={1920} />
  <Composition id="GM-HookTest" component={HookTest} durationInFrames={240} fps={30} width={1080} height={1920} />
</Folder>
```

Per video, edit in `Reel2.tsx`: `SPEECH` (transcript chunks with times), `HOT` (green words), `CAPS` (keyword
lines), `FS` (full-screen windows), `CUTS` (jump cuts), the `OnScreen` cards, and the scene contents.
In `Cover.tsx`: `FACE` (face centre in the chosen frame), `S`, `FACE_TO`, the headline and chips.
