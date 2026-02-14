import { ImageResponse } from "next/og";

export const alt = "STYLE LASH";
export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "linear-gradient(140deg, #f2f7f7 0%, #ffffff 48%, #f6efe7 100%)",
          color: "#141414"
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 3,
            fontWeight: 700
          }}
        >
          STYLELASH_KR
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                fontSize: 68,
                lineHeight: 1.02,
                letterSpacing: -2,
                fontWeight: 700
              }}
            >
              STYLE LASH
            </div>
            <div style={{ fontSize: 30, opacity: 0.85 }}>
              Lash • Brow • Waxing • Semi-Permanent
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ width: 56, height: 220, background: "#0b7878" }} />
            <div style={{ width: 56, height: 220, background: "#4eb4b6" }} />
            <div style={{ width: 56, height: 220, background: "#f2ebdf" }} />
            <div style={{ width: 56, height: 220, background: "#f6c59f" }} />
            <div style={{ width: 56, height: 220, background: "#e69873" }} />
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
