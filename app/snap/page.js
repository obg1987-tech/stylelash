import fs from "node:fs";
import path from "node:path";
import PremiumPhotoGalleryCarousel from "../../components/premium-photo-gallery-carousel";
import SnapFloatingHomeButton from "../../components/snap-floating-home-button";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylash.vercel.app";

// Sample data (used if the public folder is missing / empty).
const fallbackCustomerPhotos = [
  { id: "fallback-1", src: "/assets/review/1.png", alt: "Customer photo 1" },
  { id: "fallback-2", src: "/assets/service/1.png", alt: "Customer photo 2" },
  { id: "fallback-3", src: "/assets/service/2.png", alt: "Customer photo 3" },
  { id: "fallback-4", src: "/assets/before-after/1.png", alt: "Customer photo 4" },
  { id: "fallback-5", src: "/assets/before-after/2.png", alt: "Customer photo 5" },
  { id: "fallback-6", src: "/assets/hero/1.png", alt: "Customer photo 6" },
  { id: "fallback-7", src: "/assets/hero/1.png", alt: "Customer photo 7" },
  { id: "fallback-8", src: "/assets/hero/1.png", alt: "Customer photo 8" }
];

const customerPhotoDir = path.join(process.cwd(), "public", "assets", "review-carousel");
const customerPhotoPattern = /\.(png|jpe?g|webp|avif)$/i;

function altFromFilename(filename, index) {
  const base = filename.replace(/\.[^.]+$/, "");
  const cleaned = base.replace(/[-_]+/g, " ").trim();
  if (!cleaned) return `Customer photo ${index + 1}`;
  const titled = cleaned
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return `Customer photo ${index + 1}: ${titled}`;
}

function loadCustomerPhotos() {
  try {
    if (!fs.existsSync(customerPhotoDir)) return fallbackCustomerPhotos;

    const files = fs
      .readdirSync(customerPhotoDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && customerPhotoPattern.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

    if (files.length === 0) return fallbackCustomerPhotos;

    return files.map((file, index) => ({
      id: `customer-${index}-${file}`,
      src: `/assets/review-carousel/${file}`,
      alt: altFromFilename(file, index)
    }));
  } catch {
    return fallbackCustomerPhotos;
  }
}

const customerPhotos = loadCustomerPhotos();

export const metadata = {
  title: "고객 후기 스냅 크게보기",
  description: "STYLE LASH 고객 후기 스냅 이미지를 크게 확인해 보세요.",
  alternates: { canonical: "/snap" },
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
          <h1 className="visually-hidden">Customer photo review gallery</h1>
        </header>

        <PremiumPhotoGalleryCarousel items={customerPhotos} ariaLabel="Customer photo review gallery" />
      </section>

      <SnapFloatingHomeButton />
    </main>
  );
}
