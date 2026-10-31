# Template: Forex Trading reel (Remotion)

Copy into a Remotion 4 project (`npx create-video@latest --blank`, then `npm i @remotion/fonts`):

- `src/Anfaal/` → `src/<Project>/` (rename freely)
- `public/fonts/*` → `public/fonts/`
- register in `src/Root.tsx`:

```tsx
import { Composition, Still } from "remotion";
import { ANFAAL_FRAMES, AnfaalReel } from "./Anfaal/AnfaalReel";
import { AnfaalCover } from "./Anfaal/Cover";
<Composition id="AnfaalFOMC" component={AnfaalReel} durationInFrames={ANFAAL_FRAMES} fps={30} width={1080} height={1920} />
<Still id="AnfaalCover" component={AnfaalCover} width={1080} height={1920} />
```

Media the code expects in `public/anfaal/` (generate with the skill's scripts, or swap your own):
`cut.mp4` (build_cut.py), `person.webm` (segment_person.py + ffmpeg alphamerge), `music.wav` and `sfx/*.wav`
(make_audio.py), `pnl.png` / `signals.png` (client screenshots for the CTA), `cover_frame.png` / `cover_head.png`
(cover), optional `fed_chair.jpg`.

`timeline.ts` holds everything per-video: cut map, captions, scene windows, behind-head words, camera keys, face table.
