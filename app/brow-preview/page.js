import BrowPreviewStudio from "./studio";
import Link from "next/link";

export function generateMetadata() {
  const openInProduction = process.env.NEXT_PUBLIC_ENABLE_BROW_PREVIEW === "true";
  const isPreviewOpen = process.env.NODE_ENV !== "production" || openInProduction;

  return {
    title: "Brow Preview Studio",
    description: "Upload a face photo and preview eyebrow shape changes before booking.",
    alternates: {
      canonical: "/brow-preview"
    },
    robots: isPreviewOpen
      ? {
          index: true,
          follow: true
        }
      : {
          index: false,
          follow: false
        }
  };
}

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
            ← 홈으로 돌아가기
          </Link>
          <h1 style={{ margin: "0.45rem 0 0.4rem", fontSize: "2rem" }}>눈썹 프리뷰 스튜디오</h1>
          <p style={{ margin: 0, color: "#586371" }}>
            로컬 모드: FLUX Fill 인페인팅 워크플로우 (API 과금 없음)
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
            <p style={{ margin: 0, color: "#4f5963", fontSize: "0.86rem" }}>사진 업로드</p>
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
              이미지를 여기로 드래그하세요
              <br />
              또는 클릭해서 파일을 선택하세요
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
            <p style={{ margin: 0, color: "#445261", fontSize: "0.78rem", fontWeight: 700 }}>스타일 프리셋</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.45rem" }}>
              {["초자연 일자", "남성형 일자", "중간 아치", "글램", "볼드", "옴브레", "애쉬", "웜브라운", "그라파이트"].map(
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
              이미지 생성하기
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
          <h2 style={{ margin: 0, fontSize: "0.9rem", color: "#354150" }}>비포 / 애프터</h2>
        </section>

        <section
          style={{
            border: "1px solid #cfdcff",
            borderLeft: "6px solid #4f78ff",
            borderRadius: "12px",
            background: "linear-gradient(145deg, #f4f7ff 0%, #edf3ff 100%)",
            padding: "0.95rem 1rem"
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#2b3e66",
              fontWeight: 800,
              letterSpacing: "0.02em",
              fontSize: "0.82rem"
            }}
          >
            안내
          </p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: "#1f2f4f",
              lineHeight: 1.62,
              fontSize: "1.12rem",
              fontWeight: 700
            }}
          >
            현재 배포 버전에서는 ComfyUI 서버/모델 미연동으로 생성 기능이 제한됩니다.
          </p>
          <p
            style={{
              margin: "0.45rem 0 0",
              color: "#2a3d62",
              lineHeight: 1.62,
              fontSize: "0.95rem",
              fontWeight: 600
            }}
          >
            준비 중: GPU 서버 구축, ComfyUI 모델 파일 배치, API 연동, 요청 큐/모니터링.
          </p>
        </section>
        <Link href="/" className="brow-floating-home-btn" aria-label="Go to home">
          <span>Home</span>
          <small>Back</small>
        </Link>
      </main>
    );
  }

  return <BrowPreviewStudio />;
}
