import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Ground } from "./Ground";
import { S1TradeOff } from "./S1TradeOff";
import { S2Income } from "./S2Income";
import { S3Benefits } from "./S3Benefits";
import { S4GivingUp } from "./S4GivingUp";
import { S5OverHundredK } from "./S5OverHundredK";

// Full-screen VO-synced piece. Beat timings live in theme.ts (VO).
//  0.0  - 6.2   Pensions: important but a trade-off (balance beam)
//  6.2  - 14.4  Contribution cuts adjusted net income below £100K (income bar)
//  14.3 - 19.5  Childcare allowances back, no 62% (check vs struck 62%)
//  19.5 - 23.2  But you give up that money (tokens into pension)
//  23.2 - 30.6  Over £100K: 62% tax vs 38% kept (client reference frame)
//  30.6 - 36.0  The 38p pays for cost of living, childcare, everything else
export const PensionTradeOff: React.FC = () => {
  return (
    <AbsoluteFill>
      <Ground />
      <S1TradeOff />
      <S2Income />
      <S3Benefits />
      <S4GivingUp />
      <S5OverHundredK />
      <Audio src={staticFile("audio/pension-tradeoff.mp3")} />
    </AbsoluteFill>
  );
};
