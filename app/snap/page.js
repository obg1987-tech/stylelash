import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import ReviewCarousel from "../../components/review-carousel";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylash.vercel.app";

const fallbackReviewCarouselCards = [
  { title: "Natural Brow Line", image: "/assets/review/1.png" },
  { title: "Soft Daily Mood", image: "/assets/service/1.png" },
  { title: "Defined Balance", image: "/assets/service/2.png" },
  { title: "Before/After Focus", image: "/assets/before-after/1.png" },
  { title: "Clean Shape Update", image: "/assets/before-after/2.png" }
];

const reviewCarouselDir = path.join(process.cwd(), "public", "assets", "review-carousel");
const reviewImagePattern = /\.(png|jpe?g|webp|avif)$/i;

function titleFromFilename(filename, index) {
  const base = filename.replace(/\.[^.]+$/, "");
  const cleaned = base.replace(/[-_]+/g, " ").trim();
  if (!cleaned) return `Review ${index + 1}`;
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function loadReviewCarouselCards() {
  try {
    if (!fs.existsSync(reviewCarouselDir)) {
      return fallbackReviewCarouselCards;
    }

    const files = fs
      .readdirSync(reviewCarouselDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && reviewImagePattern.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

    if (files.length === 0) {
      return fallbackReviewCarouselCards;
    }

    return files.map((file, index) => ({
      title: titleFromFilename(file, index),
      image: `/assets/review-carousel/${file}`
    }));
  } catch {
    return fallbackReviewCarouselCards;
  }
}

const reviewCarouselCards = loadReviewCarouselCards();

export const metadata = {
  title: "고객 후기 스냅 크게보기",
  description: "STYLE LASH 고객 후기 스냅 이미지를 크게 확인해 보세요.",
  alternates: {
    canonical: "/snap"
  },
  openGraph: {
    title: "고객 후기 스냅 크게보기",
    description: "STYLE LASH 고객 후기 스냅 이미지를 크게 확인해 보세요.",
    url: "/snap",
    images: [
      {
        url: `${siteUrl}/og/main.png`,
        width: 1200,
        height: 630,
        alt: "STYLE LASH"
      }
    ]
  }
};

export default function SnapPage() {
  return (
    <main className="snap-page">
      <section className="snap-page-shell">
        <header className="snap-page-head">
          <p>Review Feed</p>
          <h1>고객 후기 스냅 크게보기</h1>
          <Link href="/" className="snap-page-back">
            홈으로
          </Link>
        </header>

        <div className="snap-page-carousel" aria-label="고객 후기 스냅 크게보기 캐러셀">
          <ReviewCarousel cards={reviewCarouselCards} imageSizes="680px" />
        </div>
      </section>
    </main>
  );
}

