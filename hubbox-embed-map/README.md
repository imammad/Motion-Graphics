# HubBox · Embed the map (HyperFrames)

A 1920×1080, 30fps, 22.5s explainer in the same white + `#3D8AFC` style as the Field Marketing piece, made for this voice-over:

> You embed the HubBox map, connect it to listen for events, like a shopper confirming their pickup point, then send that selection to your backend to save the order and update shipping rates.

## Commands

```console
npm run dev       # open HyperFrames Studio: scrub, edit and retime any scene
npm run check     # lint + runtime + layout + contrast
npm run render    # render to MP4
```

## Scenes and VO timing

Each scene is its own sub-composition, so it shows up as its own clip in Studio.

| Time (s)    | VO                                              | Scene file                    | What happens                                                                           |
| ----------- | ----------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
| 0 – 3.9     | "You embed the HubBox map,"                     | `compositions/s1-embed.html`   | Checkout window builds from pixels, `<hubbox-map>` tag wipes in, the map pixels in on "map" and pins pop |
| 3.9 – 7.6   | "connect it to listen for events,"              | `compositions/s2-listen.html`  | Code types in line by line, `map.on(...)` lights up on "listen", event chips stream in on "events" |
| 7.6 – 11.85 | "like a shopper confirming their pickup point," | `compositions/s3-confirm.html` | Cursor picks a pickup point, the detail card wipes up, Confirm is pressed, `pickup:confirmed` fires |
| 11.85 – 15.75 | "then send that selection to your backend"    | `compositions/s4-send.html`    | Payload card pixels in, the wire draws, a packet travels to "Your backend", 200 OK     |
| 15.75 – 22.5 | "to save the order and update shipping rates." | `compositions/s5-save.html`    | Status pixel-swaps Pending → Saved, home rate is struck, pickup rate is selected, totals tick down |

Transitions (`compositions/transitions.html`) sit in the pauses between phrases: a diagonal pixel sweep, rising blinds, pixels rippling out from the Confirm button, and an iris opening from the backend node.

## Where to change things

- **Colours and fonts:** `assets/hubbox-theme.css`. The `--hb-*` tokens drive every scene, the transitions and the pixel colours. Swap them for the HubBox brand-guideline values.
- **Overall speed and easing:** `EASE` and `TIMING` at the top of `assets/hb-motion.js` (word stagger, wipe length, pixel cell and wave timing).
- **Copy and UI content:** the HTML in each scene file. Headlines are plain text, and anything inside `<span class="hb-accent">` gets the blue gradient.
- **Timing of a beat:** the numbers in each scene's `<script>`. They are scene-local seconds, with the VO window noted in a comment.
- **Moving a scene cut:** change the scene's `data-start` / `data-duration` in `index.html` **and** the matching entry in `CUTS` in `compositions/transitions.html`.

## Voice-over

`assets/audio/voiceover.wav` is a placeholder read made with HyperFrames' local TTS (Kokoro, voice `bf_emma`), with each phrase placed to leave a breath between them. To use the real read, replace the file (keep the name or update `src` on `#el-voiceover` in `index.html`) and nudge the scene cuts to match its pauses.

## Helpers (`assets/hb-motion.js`)

| Helper                                     | Use                                                                       |
| ------------------------------------------ | ------------------------------------------------------------------------- |
| `HB.pixelReveal(tl, host, t, opts)`        | Builds a `.px-host > .px-target` card out of seeded blue pixels, then dissolves them to show it |
| `HB.pixelSwap(tl, host, out, in, t)`       | Pixel dissolve between two small elements (status pills)                 |
| `HB.words(tl, el, t)`                      | Word-by-word blur rise for headlines                                      |
| `HB.rise` / `HB.wipe` / `HB.pop`           | Soft rise, clip-path wipe, gentle pop                                     |
| `HB.cursorTo(tl, cursor, t, x, y, {click})` | Eased cursor glide with a press                                          |

Everything is seek-safe and deterministic: the pixel orders come from a seeded PRNG, not `Math.random()`.
