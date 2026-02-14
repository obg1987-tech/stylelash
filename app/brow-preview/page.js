import BrowPreviewStudio from "./studio";
import Link from "next/link";

export const metadata = {
  title: "Brow Preview Studio",
  description: "Upload a face photo and preview eyebrow shape changes before booking."
};

export default function BrowPreviewPage() {
  const openInProduction = process.env.NEXT_PUBLIC_ENABLE_BROW_PREVIEW === "true";
  const isPreviewOpen = process.env.NODE_ENV !== "production" || openInProduction;

  if (!isPreviewOpen) {
    return (
      <main style={{ width: "min(920px, calc(100vw - 1.2rem))", margin: "2rem auto", padding: "1.2rem" }}>
        <section
          style={{
            border: "1px solid #e4eaf1",
            borderRadius: "18px",
            background: "#ffffff",
            padding: "1.2rem",
            marginBottom: "0.9rem"
          }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "#2d3a47", fontSize: "0.9rem" }}>
            ← Back to Home
          </Link>
          <h1 style={{ margin: "0.45rem 0 0.4rem", fontSize: "2rem" }}>ComfyUI Brow Inpaint</h1>
          <p style={{ margin: 0, color: "#586371" }}>
            Local mode: FLUX Fill inpainting workflow (no API billing).
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: "0.9rem",
            marginBottom: "0.9rem"
          }}
        >
          <div
            style={{
              border: "1px solid #e4eaf1",
              borderRadius: "16px",
              background: "#ffffff",
              padding: "0.9rem"
            }}
          >
            <p style={{ margin: 0, color: "#4f5963", fontSize: "0.86rem" }}>Upload photo</p>
            <div
              style={{
                marginTop: "0.45rem",
                border: "1px dashed #cbd6e2",
                borderRadius: "12px",
                padding: "1rem",
                textAlign: "center",
                background: "#f9fbfd",
                color: "#5b6672"
              }}
            >
              Drag image here
              <br />
              or click to choose file
            </div>
            <div
              style={{
                marginTop: "0.7rem",
                border: "1px solid #e1e8f0",
                borderRadius: "10px",
                background: "#f8fbff",
                height: "140px"
              }}
            />
          </div>

          <div
            style={{
              border: "1px solid #e4eaf1",
              borderRadius: "16px",
              background: "#ffffff",
              padding: "0.9rem"
            }}
          >
            <p style={{ margin: 0, color: "#445261", fontSize: "0.78rem", fontWeight: 700 }}>Style Presets</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.45rem" }}>
              {["Ultra Soft", "Flat", "Mid Arch", "Glam", "Bold", "Ombre", "Ash", "Warm", "Graphite"].map(
                (label) => (
                  <span
                    key={label}
                    style={{
                      border: "1px solid #d2dbe7",
                      borderRadius: "999px",
                      padding: "0.34rem 0.65rem",
                      fontSize: "0.74rem",
                      color: "#374656",
                      background: "#ffffff"
                    }}
                  >
                    {label}
                  </span>
                )
              )}
            </div>
            <button
              type="button"
              disabled
              style={{
                marginTop: "0.9rem",
                border: "1px solid #d5dde7",
                background: "#f3f6fa",
                color: "#7a8592",
                borderRadius: "10px",
                padding: "0.5rem 0.8rem",
                cursor: "not-allowed"
              }}
            >
              Generate with ComfyUI
            </button>
          </div>
        </section>

        <section
          style={{
            border: "1px solid #e4eaf1",
            borderRadius: "16px",
            background: "#fff",
            padding: "0.9rem",
            minHeight: "140px",
            marginBottom: "0.9rem"
          }}
        >
          <h2 style={{ margin: 0, fontSize: "0.9rem", color: "#354150" }}>Before / After</h2>
        </section>

        <section
          style={{
            border: "1px solid #d7e1ec",
            borderRadius: "12px",
            background: "linear-gradient(145deg, #f8faff 0%, #f1f6ff 100%)",
            padding: "0.78rem 0.9rem"
          }}
        >
          <p style={{ margin: 0, color: "#3d4d63", lineHeight: 1.6, fontSize: "0.9rem" }}>
            프리미엄 브로우 프리뷰가 곧 오픈됩니다. 현재는 마지막 품질 튜닝 단계로, 정식 출시 후 더 정교한
            스타일 시뮬레이션을 바로 경험하실 수 있습니다.
          </p>
        </section>
      </main>
    );
  }

  return <BrowPreviewStudio />;
}
