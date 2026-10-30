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

## Pension Trade-Off (`PensionTradeOff`)

A 1920×1080, 60fps, 36s full-screen animation synced to the voice-over in `public/audio/pension-tradeoff.mp3`, in the client's dark forest-green / mint / rust style (Big Shoulders Display + Inter).

Beats (in `src/PensionTradeOff/`; word times live in `theme.ts` as `VO`):

1. `S1TradeOff`: "pensions ... really important but a very difficult trade-off", a balance beam (TODAY vs RETIREMENT)
2. `S2Income`: a pension contribution cuts adjusted net income from £110K to £98K, below the £100K threshold
3. `S3Benefits`: childcare allowances come back, and the 62% tax rate is struck through
4. `S4GivingUp`: "but you are giving up all of that money", £ tokens move into a pension box
5. `S5OverHundredK`: OVER £100K, 62% tax vs 38% kept; the 38p then splits into cost of living, childcare and everything else

```console
npx remotion render PensionTradeOff out/pension-tradeoff.mp4
```

## Commands

```console
npm i                                              # install
npm run dev                                        # open Remotion Studio
npx remotion render FieldMarketing out/field-marketing.mp4   # render MP4
```
