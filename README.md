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

## Commands

```console
npm i                                              # install
npm run dev                                        # open Remotion Studio
npx remotion render FieldMarketing out/field-marketing.mp4   # render MP4
```

## Reference background

`public/backgrounds/grid-background.webp` (1920×1080) is the background to use going forward. Use it with `<Img src={staticFile("backgrounds/grid-background.webp")} />`, or rebuild it in code from these measurements:

- **Base:** a diagonal gradient from neutral off-white `#F2F2F2` (top-left) to pale periwinkle `#E7EEFE` (bottom-right), about `#ECEEF9` at the center
- **Grid:** thin 1px lines in `#E3E7EF`, at low contrast against the base. The cells are rectangles about 82px wide by 56px tall, not squares
- **Vignette:** the grid fades softly toward the edges, most at the top-left corner
- **Feel:** flat and calm, no glows or dots. The content on top carries the blue (`#3D8AFC`)

## Field marketing ROI (`EventROI`)

A 1920×1080, 30fps, 26s animation in the Wave client style (`docs/wave-style-guide.md`), on the reference grid background, for the script:

> Real opportunities that trace back to the event, demos that got booked, deals that sales can point and say, that one started at the show. So when the quarter closes, finance asks what that $40,000 sponsorship actually returned, and sales asks where the leads are, and both of them are looking at the same person for an answer.

Scenes (in `src/EventROI/`, joined with a blur dissolve; durations in `EventROIVideo.tsx`):

1. `OpportunitiesScene` (0–4s): opportunity cards connect back to the event card
2. `DemosScene` (4–7s): a demo slot is booked and "Demo booked" notifications stack up
3. `DealsScene` (7–12s): one deal in the pipeline is picked out with "Source: SaaS Connect 2026"
4. `QuarterScene` (12–14s): the Q3 progress bar fills and the quarter closes
5. `FinanceScene` (14–18.5s): finance asks what the $40,000 sponsorship returned
6. `SalesScene` (18.5–21s): sales asks where the leads are, next to an empty leads list
7. `SamePersonScene` (21–26s): both of them look to the Field Marketing Manager

```console
npx remotion render EventROI out/event-roi.mp4
```
