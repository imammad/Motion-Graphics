# Wave: client style guide

This is the house style for the client's motion graphics. It is taken from the reference video "Digital Business Card – For Individuals & Teams" (1920×1080, 24fps, about 45s). The beat timings below are in seconds from the start of that video.

The background to use is `public/backgrounds/grid-background.webp` (see the README).

## Look

- **Overall:** a bright, airy, "soft UI" look. It is mostly white and very pale blue, with one saturated blue accent. There is no dark mode and nothing harsh.
- **Font:** **Poppins** for everything. Names and headlines use 600–700 weight, labels 500, and secondary text 400 in grey.
- **Logo:** `wave` in lowercase, in a heavy, wide, geometric font in near-black. It sits inside a soft white disc or a blue disc.
- **Colours** (sampled from the video):
  | Role | Value |
  | --- | --- |
  | Primary blue (buttons, card headers) | `#5497FC` to `#64A1FF` |
  | Light blue (button highlight, top of gradients) | `#76ACFD` |
  | Pale blue (card header fade, chat bubbles) | `#D4E6FC` |
  | Ink (names, headlines, logo) | `#0A0A16` |
  | Secondary text | `#7B7C7F` |
  | Cards and pills | `#FFFFFF` |
- **Cards:** white, with large corner radii (about 24–40px). They have a very soft, wide shadow with a faint blue tint, and a thin light border or inner glow. Profile cards have a blue header that fades from `#5497FC` to pale blue.
- **Buttons:** fully rounded blue pills with white Poppins 500 text and a subtle top highlight that looks slightly glassy.
- **Pills and chips:** small white rounded pills holding an icon and a label, such as job title, email, city or phone.
- **Avatars:** real photos in circles, with a white ring and a pale blue glow. The background behind the face is a light blue gradient. Each one has a name label below it.
- **Placeholder content:** rounded pale blue bars stand in for text.

## Motion

- **Depth of field is the signature move.** Layers in the foreground and background are blurred, and focus "pulls" between them. Elements blur in and blur out rather than simply fading.
- **Camera:** slow push-ins and drifts. There is a slight 3D perspective tilt on phone and card UIs, and long vertical scrolls through lists and profiles.
- **Entrances:** soft scale-up (about 0.9 to 1) combined with blur to sharp and opacity 0 to 1. Items stagger in one after another, and chat bubbles pop in in sequence.
- **Exits:** blur out with a fade, or the camera pushes past the element.
- **Transitions:** scenes cross-dissolve through blur, or one scene's element becomes the next scene's hero. For example, an avatar grows into a profile card.
- **Easing:** smooth ease-in-out with no bounce, apart from a gentle overshoot on small pops. Nothing snaps.
- **Pacing:** about 3–5s per beat, calm and premium.

## Beats in the reference video (seconds)

| Time | Beat |
| --- | --- |
| 0–3 | Floating constellation of named avatars, with focus pulls between them |
| 4–8 | Profile card (Emma Caldwell) with info pills orbiting it: title, email, city, phone, mail form |
| 9–12 | Chat conversation, with bubbles staggering in, then the scene tilts away |
| 13–14 | One avatar alone in the centre, with soft concentric rings |
| 15–17 | `wave` logo in the centre of an orbit of avatars and icons (info, building, @, pin, briefcase) |
| 17–23 | "Contacts" list card scrolling, with a 3D tilt |
| 24–28 | Digital business card profile scrolls down to a QR code, then the "Add to contacts" button grows |
| 29–31 | Network: a central avatar linked to contact cards |
| 32–37 | Carousel of profile cards, then a message notification ("Hey! Would a short call this week be helpful?") |
| 38–40 | "Stay connected": clusters of blue `wave` discs, each surrounded by avatars |
| 41–44 | End card: `wave` logo in soft rings, with the tagline "Remember everyone you meet" |
