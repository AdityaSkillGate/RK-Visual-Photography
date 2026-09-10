import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RK Visual Photography | Luxury Editorial Wedding Photography";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0C0E",
          backgroundImage: "radial-gradient(circle at 50% 45%, rgba(197, 168, 128, 0.15) 0%, rgba(11, 12, 14, 0.95) 75%)",
          padding: "60px 80px",
          border: "1px solid rgba(197, 168, 128, 0.3)",
          boxSizing: "border-box",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Subtle Decorative Gold Borders */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: "1px solid rgba(197, 168, 128, 0.25)",
            pointerEvents: "none",
          }}
        />

        {/* Studio Monogram Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 90,
            height: 90,
            borderRadius: 45,
            border: "2px solid #C5A880",
            backgroundColor: "rgba(11, 12, 14, 0.8)",
            marginBottom: 28,
            boxShadow: "0 0 35px rgba(197, 168, 128, 0.35)",
          }}
        >
          <span
            style={{
              fontSize: 42,
              fontWeight: 300,
              color: "#F5F2EB",
              letterSpacing: 2,
            }}
          >
            RK
          </span>
        </div>

        {/* Main Title */}
        <div
          style={{
            display: "flex",
            fontSize: 54,
            fontWeight: 300,
            color: "#F5F2EB",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          RK VISUAL
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontWeight: 400,
            color: "#C5A880",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          PHOTOGRAPHY & CINEMA
        </div>

        {/* Tagline / Geo */}
        <div
          style={{
            display: "flex",
            fontSize: 16,
            fontWeight: 300,
            color: "#A39E93",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            borderTop: "1px solid rgba(197, 168, 128, 0.25)",
            paddingTop: 18,
          }}
        >
          TAMIL NADU, INDIA • AVAILABLE WORLDWIDE
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
