import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #1a2d44 0%, #1f3a55 50%, #2d4d6e 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {/* Barbell compacta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            marginBottom: 8,
          }}
        >
          <div style={{ width: 10, height: 26, background: "#fff", borderRadius: 1.5 }} />
          <div style={{ width: 6, height: 20, background: "#fff", borderRadius: 1 }} />
          <div style={{ width: 80, height: 7, background: "#fff", borderRadius: 1.5 }} />
          <div style={{ width: 6, height: 20, background: "#fff", borderRadius: 1 }} />
          <div style={{ width: 10, height: 26, background: "#fff", borderRadius: 1.5 }} />
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          ECK
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.25em",
            marginTop: 2,
          }}
        >
          FITNESS
        </div>
      </div>
    ),
    { ...size }
  )
}
