import { ImageResponse } from "next/og"

export const size = { width: 512, height: 512 }
export const contentType = "image/png"

export default function Icon() {
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
          gap: 8,
        }}
      >
        {/* Barbell estilizada */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{ width: 30, height: 80, background: "#fff", borderRadius: 4 }}
            />
          </div>
          <div
            style={{ width: 16, height: 60, background: "#fff", borderRadius: 3 }}
          />
          <div
            style={{ width: 240, height: 22, background: "#fff", borderRadius: 4 }}
          />
          <div
            style={{ width: 16, height: 60, background: "#fff", borderRadius: 3 }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{ width: 30, height: 80, background: "#fff", borderRadius: 4 }}
            />
          </div>
        </div>

        {/* ECK */}
        <div
          style={{
            fontSize: 160,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          ECK
        </div>
        {/* FITNESS */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.25em",
            marginTop: 6,
          }}
        >
          FITNESS
        </div>
      </div>
    ),
    { ...size }
  )
}
