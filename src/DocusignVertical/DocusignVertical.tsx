import { AbsoluteFill, Audio, Sequence } from "remotion";
import { CardsScene } from "./CardsScene";
import { DocsScene } from "./DocsScene";
import { DocUIScene } from "./DocUIScene";
import { FinaleScene } from "./FinaleScene";
import { BRoll, OpeningTalkingHead, Split, TalkingHead } from "./Footage";
import { CornerLogo } from "./Logo";
import { LowerThird } from "./LowerThird";
import { CUTS, SOURCE } from "./theme";

const len = (a: number, b: number) => b - a;

// Every shot of the horizontal master, rebuilt for 9:16 on the same frames,
// with the original soundtrack underneath.
export const DocusignVertical: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence
      name="Talking head 1"
      durationInFrames={len(CUTS.talk1, CUTS.typing)}
    >
      <OpeningTalkingHead />
      <LowerThird
        name="Dennis Torchetti"
        title="Regional Vice President Enterprise Sales, DACH"
      />
    </Sequence>
    <Sequence
      name="B-roll: typing"
      from={CUTS.typing}
      durationInFrames={len(CUTS.typing, CUTS.docUi)}
    >
      <BRoll
        startFrom={CUTS.typing}
        duration={len(CUTS.typing, CUTS.docUi)}
        from={0.32}
        to={0.72}
      />
    </Sequence>
    <Sequence
      name="MG: document UI"
      from={CUTS.docUi}
      durationInFrames={len(CUTS.docUi, CUTS.talk2)}
    >
      <DocUIScene />
    </Sequence>
    <Sequence
      name="Talking head 2"
      from={CUTS.talk2}
      durationInFrames={len(CUTS.talk2, CUTS.docs)}
    >
      <TalkingHead startFrom={CUTS.talk2} cx={0.474} />
    </Sequence>
    <Sequence
      name="MG: documents"
      from={CUTS.docs}
      durationInFrames={len(CUTS.docs, CUTS.split)}
    >
      <DocsScene />
    </Sequence>
    <Sequence
      name="Split: pen + office"
      from={CUTS.split}
      durationInFrames={len(CUTS.split, CUTS.meeting)}
    >
      <Split />
    </Sequence>
    <Sequence
      name="B-roll: meeting"
      from={CUTS.meeting}
      durationInFrames={len(CUTS.meeting, CUTS.cards)}
    >
      <BRoll
        startFrom={CUTS.meeting}
        duration={len(CUTS.meeting, CUTS.cards)}
        from={0.5}
        to={0.44}
      />
    </Sequence>
    <Sequence
      name="MG: cards"
      from={CUTS.cards}
      durationInFrames={len(CUTS.cards, CUTS.talk3)}
    >
      <CardsScene />
    </Sequence>
    <Sequence
      name="Talking head 3"
      from={CUTS.talk3}
      durationInFrames={len(CUTS.talk3, CUTS.berlin)}
    >
      <TalkingHead startFrom={CUTS.talk3} cx={0.466} />
    </Sequence>
    <Sequence
      name="B-roll: Berlin"
      from={CUTS.berlin}
      durationInFrames={len(CUTS.berlin, CUTS.finale)}
    >
      <BRoll
        startFrom={CUTS.berlin}
        duration={len(CUTS.berlin, CUTS.finale)}
        from={0.5}
        to={0.52}
      />
    </Sequence>
    <Sequence name="Corner logo" durationInFrames={CUTS.finale}>
      <CornerLogo />
    </Sequence>
    <Sequence
      name="Finale"
      from={CUTS.finale}
      durationInFrames={len(CUTS.finale, CUTS.end)}
    >
      <FinaleScene />
    </Sequence>
    <Audio src={SOURCE} />
  </AbsoluteFill>
);
