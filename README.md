# Motion Graphics

Remotion project for SaaS-style explainer animations.

## Field Marketing Manager (`FieldMarketing`)

A 1920×1080, 30fps, ~28s animation in white and `#3D8AFC` for the script:

> Ask 10 people at your company what the field marketing manager actually does, and you'll get 10 different answers, and most of them will be wrong. One person will tell you they booked the events, another will say they ordered the booth and the branded pens, and a couple will just shrug.

Scenes (in `src/FieldMarketing/`, each also registered as its own composition):

1. `AskScene`: "Ask 10 people at your company", with 10 avatars popping in
2. `RoleScene`: a role profile card for the Field Marketing Manager with a "?" badge
3. `AnswersScene`: a team poll with 10 different answers, 8 of them struck through as wrong
4. `EventsScene`: "They booked the events", shown as a calendar UI with a click
5. `BoothScene`: "They ordered the booth and the branded pens", shown as a checkout UI
6. `ShrugScene`: "And a couple will just shrug", on a blue gradient

Colors and the font live in `src/FieldMarketing/theme.ts`. Scene durations are set in `FieldMarketingVideo.tsx`.

## HubBox: Collection Locations (`HubBoxCollectionLocations`)

A 1080×1920, 60fps, 6s shot for the line:

> A locker, pickup point, supermarket or other collection location

It follows the HubBox brand guidelines: Midnight Black, Navy and Violet surfaces, HubBox Pink `#EF296A` as the accent, and Satoshi Bold only for the hero headings. The through-line is a pink isometric parcel, whose hexagon outline echoes the HubBox logomark. It lands in a locker, on a pickup counter and in a supermarket while the camera glides between them. Then the camera pulls out to show the three are blocks on a map. The parcel drops into a pink pin, and the other collection points ripple in around it.

| Time | Beat |
| --- | --- |
| 0.00–1.00 | **Locker**: unit unfolds, door swings open, parcel lands, screen fills pink, tick |
| 1.00–1.75 | Camera glides right, parcel hops across, locker door closes behind it |
| 1.28–2.15 | **Pickup Point**: awning unrolls, sign grows, parcel lands on the counter, tick |
| 2.15–2.90 | Camera glides on, shelves stock, sliding doors open |
| 2.42–3.40 | **Supermarket**: parcel lands at the collection desk, tick |
| 3.40–4.45 | Pull-out: the blocks become a map, and the parcel rises into the pink pin |
| 3.72–6.00 | **Or Any Other Collection Point**: other pins ripple out from the parcel, slow push |

Storyboard: `docs/hubbox-storyboard.png`. All timings live in `src/HubBox/timeline.ts`, so you can retime against the voiceover there. Every style is a pure function of time. Camera and travel use quintic smootherstep, reveals use expo-out, and landings use a lightly damped spring (about 2% overshoot).

```console
# Motion blur: render 8 subframes per frame, then blend 4 of every 8 (180° shutter) down to 60fps
npx remotion render HubBoxCollectionLocations-480 out/raw480.mp4 --codec=h264 --crf=8
ffmpeg -i out/raw480.mp4 -vf "tmix=frames=4:weights='1 1 1 1',select='eq(mod(n\,8)\,3)',setpts=N/60/TB" \
  -r 60 -c:v libx264 -crf 14 -pix_fmt yuv420p -movflags +faststart out/hubbox-collection-locations.mp4
```

Satoshi (`public/fonts/Satoshi-Variable.woff2`) is by Indian Type Foundry and free for commercial use under the ITF Free Font License.

## Commands

```console
npm i                                              # install
npm run dev                                        # open Remotion Studio
npx remotion render FieldMarketing out/field-marketing.mp4   # render MP4
```
