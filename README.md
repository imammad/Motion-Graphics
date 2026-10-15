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

## HubBox: Collection Points (`HubBoxCollection`)

A 1080×1920 (9:16), 60fps, 5.5s clip for the VO line at 0:06.00–0:10.03:

> A locker, pickup point, supermarket or other collection location.

The look follows the HubBox brand guidelines: Midnight ground with the brand's ambient pink arc and hex-network pattern, frosted glass shapes, HubBox Pink icons with a soft glow and bounce, and Satoshi Bold hero headings only. One continuous move with no cuts:

1. A glass card gradient-reveals. **Locker** bounces in and a door swings open.
2. The locker drops into a glass dock. **Pickup Point** bounces in and its pin drops.
3. The pickup point docks. **Supermarket** bounces in and a parcel drops into the cart.
4. On "or other", the card opens into a glass map and every icon flies onto it. A shopper hub links out to three more pins on "collection", and a pulse rings across the network on "location".

Files live in `src/HubBoxCollection/`. Word timings are in the `T` table in `theme.ts`, and colours, easing and the bounce spring are in the same file. Rendering uses a 180° camera motion blur (6 sub-frames).

**Font:** to use the real Satoshi, put `Satoshi-Bold.woff2` in `public/fonts/` and it is picked up automatically. Until then, Plus Jakarta Sans Bold stands in.

```console
npx remotion render HubBoxCollection out/hubbox-collection.mp4
```

## Commands

```console
npm i                                              # install
npm run dev                                        # open Remotion Studio
npx remotion render FieldMarketing out/field-marketing.mp4   # render MP4
```
