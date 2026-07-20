import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Z AI na Ty — technologia po ludzku";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f1eee5",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#0033ff",
          }}
        >
          Z AI NA TY
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: "#18181b",
              maxWidth: 900,
            }}
          >
            Technologia po ludzku.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.4,
              color: "#3f3f46",
              maxWidth: 760,
            }}
          >
            Kursy, materiały i konsultacje AI — bez stresu i bez technobełkotu.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            fontWeight: 700,
            color: "#f24a00",
          }}
        >
          zainaty.pl
        </div>
      </div>
    ),
    { ...size },
  );
}
