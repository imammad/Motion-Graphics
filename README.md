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

## Docusign vertical (`DocusignVertical`)

The 45.5s horizontal Docusign master (3840×2160, 25fps, `public/source/horizontal.mp4`) rebuilt as a 1080×1920 vertical on the exact same frames, with the original soundtrack.

- **Footage** (talking heads, b-roll) is taken frame-for-frame from the 4K master: full-height 9:16 windows centred on the speaker, and eased pans across the b-roll so the action stays in frame. The burned-in corner logo is kept out of every crop and redrawn on top.
- **Opening lower third** is rebuilt for vertical. The old one is painted out of the first shot (`public/footage/th1.mp4`).
- **Motion graphics** are rebuilt in vertical rather than cropped: document UI with the Erstellen / Zustimmen / Verwalten panels, flying document stack, torn page and circuit network, gradient page, pen + office split-screen cards (driven by per-frame tracking of the original cards in `splitTrack.ts`), product cards with the three benefit pills, document wall, orb ring and the `docusign IAM` end card.

Each motion-graphics section is also registered as its own composition under `DocusignVertical-Scenes`. Cut points live in `src/DocusignVertical/theme.ts` (`CUTS`). `scripts/prepare-footage.sh` regenerates the derived footage and brand mattes from the master.

## Commands

```console
npm i                                              # install
npm run dev                                        # open Remotion Studio
npx remotion render FieldMarketing out/field-marketing.mp4   # render MP4
npx remotion render DocusignVertical out/docusign-vertical.mp4 --crf=16   # vertical Docusign
```
