import { ImageResponse } from "next/og"

export const alt = "Prode Mundial 2026 · ECK Fitness"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0a1224 0%, #142139 45%, #1d3358 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 90px",
          position: "relative",
        }}
      >
        {/* Glow azul radial */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(64,128,255,0.35) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(115,180,255,0.18) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top — branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            zIndex: 1,
          }}
        >
          {/* Logo barbell + ECK FITNESS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "16px 22px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                marginBottom: 4,
              }}
            >
              <div style={{ width: 8, height: 24, background: "#fff", borderRadius: 1 }} />
              <div style={{ width: 5, height: 18, background: "#fff", borderRadius: 1 }} />
              <div style={{ width: 56, height: 6, background: "#fff", borderRadius: 1 }} />
              <div style={{ width: 5, height: 18, background: "#fff", borderRadius: 1 }} />
              <div style={{ width: 8, height: 24, background: "#fff", borderRadius: 1 }} />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "0.05em",
                lineHeight: 1,
              }}
            >
              ECK
            </div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.3em",
              }}
            >
              FITNESS
            </div>
          </div>
        </div>

        {/* Hero text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 18px",
              background: "rgba(64,128,255,0.18)",
              border: "1px solid rgba(64,128,255,0.4)",
              borderRadius: 99,
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: "#5aa0f0",
              }}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#5aa0f0",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Mundial 2026 · Edición Especial
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 130,
                fontWeight: 900,
                color: "#fff",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              PRODE
            </div>
            <div
              style={{
                fontSize: 130,
                fontWeight: 900,
                background: "linear-gradient(90deg, #5aa0f0 0%, #7ec7ff 50%, #5aa0f0 100%)",
                backgroundClip: "text",
                color: "transparent",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              ECK FITNESS
            </div>
          </div>

          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 800,
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            Predecí los resultados, competí contra el resto del gym y llevate los premios.
          </div>
        </div>

        {/* Bottom — stats */}
        <div
          style={{
            display: "flex",
            gap: 22,
            zIndex: 1,
          }}
        >
          {[
            { value: "48", label: "Selecciones" },
            { value: "104", label: "Partidos" },
            { value: "1°", label: "Premio" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                padding: "16px 24px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14,
                minWidth: 140,
              }}
            >
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginTop: 6,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
