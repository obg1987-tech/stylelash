import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import BeforeAfterSlider from "./before-after-slider";
import FloatingToolButton from "../components/floating-tool-button";
import FloatingCallCta from "../components/floating-call-cta";
import ReviewCarousel from "../components/review-carousel";
import MobileMenu from "../components/mobile-menu";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylash.vercel.app";
const instagramUrl = "https://www.instagram.com/stylelash_kr?igsh=N3B1N2J5aWY2dWhr";
const reservationUrl = instagramUrl;
const reservationCtaLabel = "Instagram DM 문의하기";
const naverPlaceUrl = "https://m.place.naver.com/place/778319613/home";
const naverReviewUrl = "https://m.place.naver.com/place/778319613/review/visitor";
const naverMapUrl = "https://map.naver.com/p/entry/place/778319613";
const communityUrl = "/community";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Before/After", href: "#before-after" },
  { label: "Pricing", href: "#pricing" },
  { label: "Info", href: "#info" },
  { label: "Guide", href: "#guide" },
  { label: "Board", href: communityUrl }
];

const serviceCards = [
  {
    title: "Brow Tattoo",
    subtitle: "Natural design",
    copy: "얼굴 비율과 근육 움직임을 고려해 맞춤 눈썹 라인을 디자인합니다.",
    image: "/assets/service/1.png",
    className: "service-card--brow-tattoo"
  },
  {
    title: "Retouch & Balance",
    subtitle: "Retouch service",
    copy: "기존 눈썹의 비대칭과 컬러를 정리해 더 균형감 있게 보정합니다.",
    image: "/assets/service/2.png",
    className: "service-card--retouch"
  }
];

const serviceHighlights = [
  "1:1 맞춤 눈썹 라인 설계",
  "자연 결 / 콤보 스타일 선택",
  "리터치 및 컬러 밸런스 보정",
  "상담 중심의 디테일 프로세스"
];

const priceMenus = [
  { name: "Natural Brow", price: "문의" },
  { name: "Combo Brow", price: "문의" },
  { name: "Retouch", price: "문의" }
];

const reservationProcess = [
  "상담: 얼굴형과 기존 눈썹 상태 체크",
  "디자인: 원하는 분위기에 맞춘 라인 제안",
  "시술: 위생 중심의 정밀 시술",
  "사후관리: 착색/리터치 가이드 제공"
];

const businessInfo = [
  { label: "상호", value: "STYLE LASH" },
  { label: "업종", value: "Eyebrow Tattoo / Retouch" },
  { label: "주소", value: "경기 군포시 고산로 23번길 4-21 미성빌딩 3층" },
  { label: "전화", value: "0507-1405-3087" },
  { label: "운영시간", value: "매일 11:00 - 21:00" },
  { label: "휴무", value: "공휴일" }
];

const faqItems = [
  {
    q: "처음 방문인데 어떤 시술이 맞을까요?",
    a: "상담에서 골격, 기존 눈썹 상태, 원하는 분위기를 확인 후 가장 적합한 시술을 추천해드립니다."
  },
  {
    q: "예약은 어떻게 하나요?",
    a: "인스타그램 DM으로 이름, 연락처, 희망 날짜/시간, 원하는 시술을 보내주시면 순차 안내드립니다."
  },
  {
    q: "사후관리 방법도 알려주나요?",
    a: "시술 직후 관리 방법과 주의사항을 상세하게 안내해드립니다."
  }
];

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

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": `${siteUrl}#beautysalon`,
  name: "STYLE LASH",
  image: `${siteUrl}/assets/hero/1.png`,
  url: siteUrl,
  telephone: "+82-507-1405-3087",
  sameAs: [instagramUrl, naverPlaceUrl, naverReviewUrl],
  address: {
    "@type": "PostalAddress",
    streetAddress: "경기 군포시 고산로 23번길 4-21 미성빌딩 3층",
    addressLocality: "군포시",
    addressRegion: "경기",
    addressCountry: "KR"
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "11:00",
      closes: "21:00"
    }
  ],
  priceRange: "문의",
  keywords: ["eyebrow tattoo", "retouch", "stylelash"]
};

export default function Home() {
  return (
    <>
      <header className="top-nav">
        <a className="brand" href="#home">
          STYLE LASH
        </a>
        <div className="nav-desktop">
          <nav className="nav-group nav-main">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
                  </div>
        <MobileMenu items={navItems} />
      </header>

      <main className="site-main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />

        <section className="hero" id="home">
          <div className="hero-copy-block reveal">
            <p className="eyebrow">STYLELASH_KR</p>
            <h1 className="hero-title-3d" aria-label="Precision Brows, Effortless Beauty.">
              <span className="hero-title-face">
                Precision Brows,
                <br />
                Effortless Beauty.
              </span>
              <span className="hero-title-edge" aria-hidden>
                Precision Brows,
                <br />
                Effortless Beauty.
              </span>
              <span className="hero-title-gloss" aria-hidden>
                Precision Brows,
                <br />
                Effortless Beauty.
              </span>
            </h1>
            <p>
              자연스럽고 또렷한 인상 변화를 위해 맞춤형 눈썹
              <br />
              시술을 제공합니다.
            </p>
                        <div className="hero-metrics">
              <article>
                <span>Signature 01</span>
                <strong>1:1 Face Mapping</strong>
              </article>
              <article>
                <span>Signature 02</span>
                <strong>Natural Pigment Layering</strong>
              </article>
              <article>
                <span>Signature 03</span>
                <strong>Symmetry Calibration</strong>
              </article>
            </div>
          </div>
          <div className="hero-visual reveal">
            <Image src="/assets/hero/1.png" alt="STYLE LASH 메인 비주얼" fill priority quality={84} sizes="(max-width: 960px) 100vw, 46vw" />
            <div className="floating-chip chip-a">Private 1:1 Care</div>
            <div className="floating-chip chip-b">Sanbon, Gunpo</div>
          </div>
          <div className="hero-glow" aria-hidden />
        </section>

        <section className="services" id="services">
          <div className="section-head reveal">
            <p>Services</p>
            <h2>눈썹 시술 서비스</h2>
          </div>
          <div className="service-highlights reveal">
            {serviceHighlights.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="service-grid">
            {serviceCards.map((card) => (
              <article key={card.title} className={`service-card ${card.className || ""} reveal`}>
                <div className="service-media">
                  <Image src={card.image} alt={`${card.subtitle} 이미지`} fill quality={78} sizes="(max-width: 800px) 100vw, 50vw" />
                </div>
                <p>{card.subtitle}</p>
                <h3>{card.title}</h3>
                <p>
                  {card.title === "Brow Tattoo" ? (
                    <>
                      얼굴 비율과 근육 움직임을 고려해 맞춤 눈썹
                      <br />
                      라인을 디자인합니다.
                    </>
                  ) : (
                    card.copy
                  )}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="ba-section" id="before-after">
          <div className="section-head reveal">
            <p>Before / After</p>
            <h2>자연스럽고 정교한 결과</h2>
          </div>
          <BeforeAfterSlider />
        </section>

        <section className="pricing" id="pricing">
          <div className="pricing-left reveal">
            <div className="section-head">
              <p>Pricing</p>
              <h2>시술 메뉴 / 가격</h2>
            </div>
            <p className="price-note">가격은 상담 후 확정됩니다.</p>
          </div>
          <div className="pricing-table reveal">
            {priceMenus.map((menu) => (
              <article key={menu.name} className="price-row">
                <p>{menu.name}</p>
                <strong>{menu.price}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="info" id="info">
          <div className="section-head reveal">
            <p>Shop Info</p>
            <h2>매장 정보</h2>
          </div>
          <div className="info-grid">
            {businessInfo.map((item) => (
              <article key={item.label} className="info-card reveal">
                <p className="info-label">{item.label}</p>
                <p className="info-value">{item.value}</p>
              </article>
            ))}
          </div>
          <div className="review-panel reveal">
            <div className="review-media">
              <Image src="/assets/review/1.png" alt="고객 리뷰 무드 이미지" fill quality={72} sizes="100vw" />
            </div>
            <div className="review-copy">
              <p>네이버 리뷰</p>
              <strong>방문자리뷰 18 · 블로그리뷰 43</strong>
              <a href={naverReviewUrl} target="_blank" rel="noreferrer" className="review-board-link">
                네이버 리뷰 바로가기
              </a>
            </div>
          </div>

          <div className="review-carousel reveal" aria-label="후기 카드 캐러셀">
            <div className="review-carousel-head">
              <div className="review-carousel-head-copy">
                <p>Review Feed</p>
                <h3>고객 후기 스냅</h3>
              </div>
              <a className="review-carousel-zoom board-pill" href="/snap">
                크게보기
              </a>
            </div>
            <ReviewCarousel cards={reviewCarouselCards} />
          </div>
        </section>

        <section className="experience" id="guide">
          <div className="section-head reveal">
            <p>Flow</p>
            <h2>시술 프로세스</h2>
          </div>
          <ol className="timeline">
            {reservationProcess.map((step) => (
              <li key={step} className="reveal">
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="faq-section">
          <div className="section-head reveal">
            <p>FAQ</p>
            <h2>자주 묻는 질문</h2>
          </div>
          <div className="faq-list">
            {faqItems.map((item) => (
              <details key={item.q} className="reveal">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <p className="eyebrow">Contact</p>
          <h2>
            원하는 날짜를 보내주시면 빠르게{" "}
            <span className="contact-second-line">예약 가능한 시간을 안내해드립니다.</span>
          </h2>
          <div className="contact-actions">
            <a href={reservationUrl} target="_blank" rel="noreferrer" className="btn-main">
              {reservationCtaLabel}
            </a>
            <a href={naverMapUrl} target="_blank" rel="noreferrer" className="btn-sub">
              네이버 지도 위치 확인
            </a>
          </div>
        </section>
      </main>

      <FloatingCallCta />
      <FloatingToolButton />
    </>
  );
}
