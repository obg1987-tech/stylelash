import Image from "next/image";
import MagneticLayer from "./magnetic-layer";

const instagramUrl =
  "https://www.instagram.com/stylelash_kr?igsh=N3B1N2J5aWY2dWhr";
const kakaoChannelUrl = "";
const reservationUrl = kakaoChannelUrl || instagramUrl;
const reservationCtaLabel = kakaoChannelUrl
  ? "카카오톡 채널 문의하기"
  : "인스타그램 DM 문의하기";
const naverPlaceUrl = "https://m.place.naver.com/place/778319613/home";
const naverMapUrl = "https://map.naver.com/p/entry/place/778319613";

const navItems = [
  { label: "서비스", href: "#services" },
  { label: "전후사진", href: "#before-after" },
  { label: "가격", href: "#pricing" },
  { label: "매장정보", href: "#info" },
  { label: "문의", href: "#contact" }
];

const serviceCards = [
  {
    title: "Lash Styling",
    subtitle: "속눈썹 디자인",
    copy: "눈매와 모질을 고려해 컬과 볼륨을 맞춤 설계합니다.",
    image: "/assets/service/1.png"
  },
  {
    title: "Brow Balance",
    subtitle: "브로우 디자인",
    copy: "얼굴 비율에 맞춘 정돈된 인상을 제안합니다.",
    image: "/assets/service/2.png"
  }
];

const serviceHighlights = [
  "속눈썹 펌 / 연장: 눈매 맞춤 컬 디자인",
  "브로우 디자인: 얼굴 비율 기반 균형 보정",
  "왁싱 케어: 피부 민감도 고려한 진정 루틴",
  "반영구 디자인: 일상 메이크업 시간 단축"
];

const priceMenus = [
  { name: "수분영양펌", price: "35,000원" },
  { name: "블랙틴트펌", price: "40,000원" },
  { name: "프리미엄 복구펌", price: "50,000원" }
];

const process = [
  "상담: 현재 눈매/피부 상태, 원하는 무드 체크",
  "디자인: 얼굴 비율에 맞춘 맞춤 디자인 제안",
  "시술: 위생 기준 기반의 섬세한 진행",
  "애프터케어: 유지 기간과 홈케어 안내"
];

const businessInfo = [
  { label: "상호", value: "스타일래쉬 (STYLE LASH)" },
  { label: "업종", value: "속눈썹증모, 연장" },
  { label: "대표 연락처", value: "0507-1405-3087" },
  { label: "예약 채널", value: "인스타그램 DM @stylelash_kr" },
  { label: "운영시간", value: "매일 11:00 - 21:00" },
  { label: "휴무", value: "공휴일" },
  { label: "도로명 주소", value: "경기 군포시 산본로323번길 4-21 미성빌딩 3층" },
  { label: "지번 주소", value: "경기 군포시 산본동 1131-1" }
];

const faqItems = [
  {
    q: "처음 방문인데 어떤 시술이 맞는지 모르겠어요.",
    a: "사전 상담에서 눈매, 모질, 평소 메이크업 습관을 확인한 뒤 가장 자연스러운 방향으로 안내드립니다."
  },
  {
    q: "예약은 어떻게 진행되나요?",
    a: "인스타그램 DM으로 성함, 희망 날짜/시간, 희망 시술을 보내주시면 가능한 슬롯을 안내드립니다."
  },
  {
    q: "시술 후 바로 세안 가능한가요?",
    a: "시술별 주의사항이 다르며, 당일 관리법은 시술 후 안내해드립니다. 유지력에 직접 영향을 주니 꼭 지켜주세요."
  }
];

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "스타일래쉬",
  image: "/assets/hero/1.png",
  url: naverPlaceUrl,
  sameAs: [instagramUrl, naverPlaceUrl],
  address: {
    "@type": "PostalAddress",
    streetAddress: "산본로323번길 4-21 미성빌딩 3층",
    addressLocality: "군포시",
    addressRegion: "경기도",
    addressCountry: "KR"
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      opens: "11:00",
      closes: "21:00"
    }
  ],
  keywords: ["속눈썹증모", "속눈썹연장", "브로우", "왁싱", "반영구"]
};

export default function Home() {
  return (
    <>
      <header className="top-nav">
        <a className="brand" href="#home">
          STYLE LASH
        </a>
        <nav>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <details className="mobile-menu">
          <summary aria-label="메뉴 열기">Menu</summary>
          <div className="mobile-menu-panel">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <a href={reservationUrl} target="_blank" rel="noreferrer">
              예약문의
            </a>
          </div>
        </details>
        <a href={reservationUrl} target="_blank" rel="noreferrer" className="nav-cta">
          예약문의
        </a>
      </header>

      <main className="site-main">
        <MagneticLayer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />

        <section className="hero" id="home">
          <div className="hero-copy-block reveal">
            <p className="eyebrow">STYLELASH_KR</p>
            <h1>
              Precision Brows,
              <br />
              Effortless Beauty.
            </h1>
            <p>
              부드러운 움직임과 선명한 결과. 스타일래쉬는 속눈썹과 브로우 디자인을
              더 가볍고 세련된 일상 루틴으로 바꿉니다.
            </p>
            <div className="hero-actions">
              <a href="#pricing" className="btn-main">
                가격 보기
              </a>
              <a href="#contact" className="btn-sub">
                예약 방법
              </a>
            </div>
            <div className="hero-metrics">
              <article data-magnetic="true">
                <span>Review</span>
                <strong>18 + 43</strong>
              </article>
              <article data-magnetic="true">
                <span>Open</span>
                <strong>11:00-21:00</strong>
              </article>
              <article data-magnetic="true">
                <span>Closed</span>
                <strong>공휴일</strong>
              </article>
            </div>
          </div>
          <div className="hero-visual reveal" data-magnetic="true">
            <Image
              src="/assets/hero/1.png"
              alt="STYLE LASH 메인 비주얼"
              fill
              priority
              quality={84}
              sizes="(max-width: 960px) 100vw, 46vw"
            />
            <div className="floating-chip chip-a">Private 1:1 Care</div>
            <div className="floating-chip chip-b">Sanbon, Gunpo</div>
          </div>
          <div className="hero-glow" aria-hidden />
        </section>

        <section className="services" id="services">
          <div className="section-head reveal">
            <p>Services</p>
            <h2>시선이 머무는 디테일</h2>
          </div>
          <div className="service-highlights reveal">
            {serviceHighlights.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="service-grid">
            {serviceCards.map((card) => (
              <article key={card.title} className="service-card reveal" data-magnetic="true">
                <div className="service-media">
                  <Image
                    src={card.image}
                    alt={`${card.subtitle} 시술 이미지`}
                    fill
                    quality={78}
                    sizes="(max-width: 800px) 100vw, 50vw"
                  />
                </div>
                <p>{card.subtitle}</p>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ba-section" id="before-after">
          <div className="section-head reveal">
            <p>Before / After</p>
            <h2>자연스럽게, 확실하게</h2>
          </div>
          <div className="ba-grid">
            <figure className="reveal" data-magnetic="true">
              <Image
                src="/assets/before-after/1.png"
                alt="시술 전 이미지"
                fill
                quality={74}
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <figcaption>Before</figcaption>
            </figure>
            <figure className="reveal" data-magnetic="true">
              <Image
                src="/assets/before-after/2.png"
                alt="시술 후 이미지"
                fill
                quality={74}
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <figcaption>After</figcaption>
            </figure>
          </div>
        </section>

        <section className="pricing" id="pricing">
          <div className="pricing-left reveal">
            <div className="section-head">
              <p>Pricing</p>
              <h2>시술 메뉴 / 가격</h2>
            </div>
            <p className="price-note">
              가격 기준: 2026-02-14 네이버 플레이스 공개 정보 (변동 가능)
            </p>
          </div>
          <div className="pricing-table reveal">
            {priceMenus.map((menu) => (
              <article key={menu.name} className="price-row" data-magnetic="true">
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
              <article key={item.label} className="info-card reveal" data-magnetic="true">
                <p className="info-label">{item.label}</p>
                <p className="info-value">{item.value}</p>
              </article>
            ))}
          </div>
          <div className="review-panel reveal" data-magnetic="true">
            <div className="review-media">
              <Image
                src="/assets/review/1.png"
                alt="고객 리뷰 무드 이미지"
                fill
                quality={72}
                sizes="100vw"
              />
            </div>
            <div className="review-copy">
              <p>네이버 기준 리뷰</p>
              <strong>방문자리뷰 18 · 블로그리뷰 43</strong>
              <a href={naverPlaceUrl} target="_blank" rel="noreferrer">
                네이버 플레이스 보기
              </a>
            </div>
          </div>
        </section>

        <section className="experience">
          <div className="section-head reveal">
            <p>Flow</p>
            <h2>예약 프로세스</h2>
          </div>
          <ol className="timeline">
            {process.map((step) => (
              <li key={step} className="reveal" data-magnetic="true">
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
              <details key={item.q} className="reveal" data-magnetic="true">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <p className="eyebrow">Contact</p>
          <h2>원하는 날짜를 보내주시면 빠르게 안내드릴게요.</h2>
          <div className="contact-actions">
            <a href={reservationUrl} target="_blank" rel="noreferrer" className="btn-main">
              인스타그램 DM 예약
            </a>
            <a href={naverMapUrl} target="_blank" rel="noreferrer" className="btn-sub">
              네이버 지도 위치 확인
            </a>
          </div>
        </section>
      </main>

      <a href={reservationUrl} target="_blank" rel="noreferrer" className="floating-cta">
        {reservationCtaLabel}
      </a>
    </>
  );
}


