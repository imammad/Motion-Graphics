# Motion Graphics

Remotion project for SaaS-style explainer animations.

## Field Marketing Manager, V2 (`FieldMarketingV2`)

A redesign of the same script, built with the mgskill motion design rules (`src/MGKit.tsx` is the
mgskill kit) in the brand style: white ground, `#3D8AFC` accent, deep-navy ink, Inter for regular words
and Instrument Serif Italic for the one special phrase per line. The brand profile is `src/FieldMarketingV2/brand.ts`.
1920×1080, 30fps, about 25s.

Each scene has one focal object, supporting elements, faint depth elements at the edges, a moving camera
and one "snap" moment. A beat sheet is at the top of each scene file.

1. `HookScene`: "Ask *10 people*". A 10-person tracker fills up and snaps to 10/10
2. `RoleScene`: an ID badge drops in on a lanyard. Its "What they do" field stamps `???`
3. `AnswersScene`: 10 answer pills orbit "*10 different answers*". The camera snaps to a new angle for "will be *wrong*" and 8 answers strike through
4. `EventsScene`: an event ticket gets a BOOKED stamp
5. `BoothScene`: a branded pen swings in, the count runs to × 500, and an order toast lands
6. `ShrugScene`: a ¯\\_(ツ)\_/¯ tile shrugs twice. The hook's tracker returns, complete: 8 wrong, 2 shrugs

Scene lengths are in `FieldMarketingV2.tsx` (`SCENES_V2`). Change them to sync a voice-over.

## Field Marketing Manager, V1 (`FieldMarketing`)

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

## Commands

```console
npm i                                              # install
npm run dev                                        # open Remotion Studio
npx remotion render FieldMarketingV2 out/field-marketing-v2.mp4   # render V2
npx remotion render FieldMarketing out/field-marketing.mp4        # render V1
```
