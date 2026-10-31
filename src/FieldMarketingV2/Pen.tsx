import { BRAND } from "./brand";

// Glossy branded pen, drawn horizontally (tip on the left). ~980 × 92 at scale 1.
export const Pen: React.FC = () => (
  <div style={{ position: "relative", width: 980, height: 92, display: "flex", alignItems: "center" }}>
    <div
      style={{
        width: 90,
        height: 60,
        clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
        background: "linear-gradient(180deg, #F3F6FB 0%, #B9C3D3 55%, #8C97AA 100%)",
      }}
    />
    <div
      style={{
        width: 150,
        height: 80,
        borderRadius: "14px 0 0 14px",
        background: "linear-gradient(180deg, #3A4A6B 0%, #1C2742 55%, #0F1B33 100%)",
        backgroundSize: "100% 100%",
        position: "relative",
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ position: "absolute", left: 18 + i * 22, top: 8, bottom: 8, width: 6, borderRadius: 3, background: "rgba(255,255,255,0.12)" }} />
      ))}
    </div>
    <div
      style={{
        flex: 1,
        height: 92,
        background: "linear-gradient(180deg, #A9CBFF 0%, #3D8AFC 38%, #2A70E0 70%, #1F5FD6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, top: 14, height: 8, background: "rgba(255,255,255,0.45)", borderRadius: 4 }} />
      <div
        style={{
          fontFamily: BRAND.sansFont,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 10,
          color: "rgba(255,255,255,0.92)",
          marginTop: 6,
        }}
      >
        YOUR ✦ LOGO
      </div>
    </div>
    <div
      style={{
        width: 120,
        height: 92,
        borderRadius: "0 46px 46px 0",
        background: "linear-gradient(180deg, #FFFFFF 0%, #E6ECF5 60%, #C5CFDD 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 40,
        top: -26,
        width: 330,
        height: 26,
        borderRadius: "13px 13px 4px 13px",
        background: "linear-gradient(180deg, #FFFFFF 0%, #D7DEEA 100%)",
        boxShadow: "0 6px 12px rgba(30,60,120,.15)",
      }}
    />
  </div>
);
