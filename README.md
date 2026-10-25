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

## Inflation explainer (`Inflation` folder)

Four 1920×1080, 30fps graphics for the client's inflation episode (C0080), in the client palette (`#01572A` / `#DDDDDD`). Each one comes in a dark (A · Forest) and light (B · Paper) version, and is timed word-by-word to the voice-over:

| Composition | Script line | Length |
| --- | --- | --- |
| `T1-PriceLine-*` | "…the overall price index rose by around 27%. So something that cost £100 in 2021 now costs about £127 today." | 14s |
| `T2-ValueShift-*` | "…your monthly cost £2,000 five years ago… today would cost you around £2,500… an extra £500 a month" | 15s |
| `T3-Staircase-*` | "…if it was 10% before and it's now 5%… it's risen by 15.5%. It's not gone up by 10% and back down by 5%." | 17.5s |
| `T4-HubSpokes-*` | "…that headline figure of 27% is a national average… gas prices, car insurance, mortgage interest, they all rose faster" | 21s |

Cue times live in a `CUE` object at the top of each file in `src/Inflation/`; shared colours, fonts (Poppins, bundled) and easing are in `src/Inflation/theme.ts`.

The voice clips are not committed. Cut them from the episode audio first:

```console
scripts/cut-inflation-audio.sh path/to/C0080.mp3
npx remotion render T1-PriceLine-Dark out/inflation/T1-PriceLine-Dark.mp4
```
