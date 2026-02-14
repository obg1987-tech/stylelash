import Image from "next/image";
import BeforeAfterSlider from "./before-after-slider";
import FloatingToolButton from "../components/floating-tool-button";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylash.vercel.app";
const instagramUrl = "https://www.instagram.com/stylelash_kr?igsh=N3B1N2J5aWY2dWhr";
const kakaoChannelUrl = "";
const reservationUrl = kakaoChannelUrl || instagramUrl;
const reservationCtaLabel = kakaoChannelUrl
  ? "ì¹´ì¹´?¤í†¡ ì±„ë„ ë¬¸ì˜?˜ê¸°"
  : "?¸ìŠ¤?€ê·¸ë¨ DM ë¬¸ì˜?˜ê¸°";
const naverPlaceUrl = "https://m.place.naver.com/place/778319613/home";
const naverReviewUrl = "https://m.place.naver.com/place/778319613/review/visitor";
const naverMapUrl = "https://map.naver.com/p/entry/place/778319613";
const communityUrl = "/community";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Before/After", href: "#before-after" },
  { label: "Pricing", href: "#pricing" },
  { label: "Info", href: "#info" },
  { label: "Board", href: communityUrl }
];

const serviceCards = [
  {
    title: "Brow Tattoo",
    subtitle: "?ˆì¹ë¬¸ì‹  ?”ì??,
    copy: "ê³¨ê²©ê³?ê·¼ìœ¡ ?ë¦„??ê³ ë ¤???ì—°?¤ëŸ½ê³??ë ·???ˆì¹ ?¼ì¸???¤ê³„?©ë‹ˆ??",
    image: "/assets/service/1.png",
    className: "service-card--brow-tattoo"
  },
  {
    title: "Retouch & Balance",
    subtitle: "ë¦¬í„°ì¹?ë³´ì • ?”ì??,
    copy: "ê¸°ì¡´ ?ˆì¹ ?íƒœ?€ ?¼ë? ?€?…ì„ ë°˜ì˜??ë°€?„ì? ê²°ì„ ?•êµ?˜ê²Œ ë³´ì •?©ë‹ˆ??",
    image: "/assets/service/2.png",
    className: "service-card--retouch"
  }
];

const serviceHighlights = [
  "?ˆì¹ë¬¸ì‹  ?”ì?? ?¼êµ´ ë¹„ìœ¨ ê¸°ë°˜ ë§ì¶¤ ?¼ì¸ ?¤ê³„",
  "ê²°ëˆˆ??ì½¤ë³´?ˆì¹: ?¸ìƒê³?ì·¨í–¥??ë§ëŠ” ?œí˜„ ë°©ì‹ ?œì•ˆ",
  "ë¦¬í„°ì¹?ë³´ì •: ? ì??¥ê³¼ ë°€??ë°¸ëŸ°??ê°œì„ ",
  "ë°˜ì˜êµ??ˆì¹: ë©”ì´?¬ì—… ?œê°„ ?¨ì¶•ê³??ë ·???¸ìƒ ?„ì„±"
];

const priceMenus = [
  { name: "?ì—°?ˆì¹", price: "ë¬¸ì˜" },
  { name: "ì½¤ë³´?ˆì¹", price: "ë¬¸ì˜" },
  { name: "ë¦¬í„°ì¹?ë³´ì •", price: "ë¬¸ì˜" }
];

const reservationProcess = [
  "?ë‹´: ê¸°ì¡´ ?ˆì¹ ?íƒœ/?¼ë? ?€???í•˜???¸ìƒ ì²´í¬",
  "?”ì?? ê³¨ê²©ê³?ë¹„ìœ¨??ë§ì¶˜ ë§ì¶¤ ?ˆì¹ ?¼ì¸ ?œì•ˆ",
  "?œìˆ : ?„ìƒ ê¸°ì? ê¸°ë°˜???¬ì„¸??ì§„í–‰",
  "? í”„?°ì??? ?ˆê°/ì°©ìƒ‰ ?¨ê³„ë³?ê´€ë¦¬ë²• ?ˆë‚´"
];

const businessInfo = [
  { label: "?í˜¸", value: "?¤í??¼ë˜??(STYLE LASH)" },
  { label: "?…ì¢…", value: "?ˆì¹ë¬¸ì‹ /ë°˜ì˜êµ? },
  { label: "?€???°ë½ì²?, value: "0507-1405-3087" },
  { label: "?ˆì•½ ì±„ë„", value: "?¸ìŠ¤?€ê·¸ë¨ DM @stylelash_kr" },
  { label: "?´ì˜?œê°„", value: "ë§¤ì¼ 11:00 - 21:00" },
  { label: "?´ë¬´", value: "ê³µíœ´?? },
  { label: "?„ë¡œëª?ì£¼ì†Œ", value: "ê²½ê¸° êµ°í¬???°ë³¸ë¡?23ë²ˆê¸¸ 4-21 ë¯¸ì„±ë¹Œë”© 3ì¸? },
  { label: "ì§€ë²?ì£¼ì†Œ", value: "ê²½ê¸° êµ°í¬???°ë³¸??1131-1" }
];

const faqItems = [
  {
    q: "ì²˜ìŒ ë°©ë¬¸?¸ë° ?´ë–¤ ?œìˆ ??ë§ëŠ”ì§€ ëª¨ë¥´ê² ì–´??",
    a: "?¬ì „ ?ë‹´?ì„œ ê³¨ê²©, ê¸°ì¡´ ?ˆì¹ ?íƒœ, ?‰ì†Œ ë©”ì´?¬ì—… ?µê????•ì¸????ê°€???ì—°?¤ëŸ¬???ˆì¹ë¬¸ì‹  ë°©í–¥?¼ë¡œ ?ˆë‚´?œë¦½?ˆë‹¤."
  },
  {
    q: "?ˆì•½?€ ?´ë–»ê²?ì§„í–‰?˜ë‚˜??",
    a: "?¸ìŠ¤?€ê·¸ë¨ DM?¼ë¡œ ?±í•¨, ?¬ë§ ? ì§œ/?œê°„, ?¬ë§ ?œìˆ ??ë³´ë‚´ì£¼ì‹œë©?ê°€?¥í•œ ?¬ë¡¯???ˆë‚´?œë¦½?ˆë‹¤."
  },
  {
    q: "?ˆì¹ë¬¸ì‹  ??ê´€ë¦¬ê? ì¤‘ìš”?œê???",
    a: "ì´ˆê¸° ?ˆê° ê¸°ê°„ ê´€ë¦¬ê? ì°©ìƒ‰ ê²°ê³¼??ì§ì ‘ ?í–¥??ì¤ë‹ˆ?? ?¸ì•ˆ/ë³´ìŠµ/ì£¼ì˜?¬í•­?€ ?œìˆ  ì§í›„ ?ì„¸???ˆë‚´?´ë“œë¦½ë‹ˆ??"
  }
];

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": `${siteUrl}#beautysalon`,
  name: "?¤í??¼ë˜??,
  image: `${siteUrl}/assets/hero/1.png`,
  url: siteUrl,
  telephone: "+82-507-1405-3087",
  sameAs: [instagramUrl, naverPlaceUrl, naverReviewUrl],
  address: {
    "@type": "PostalAddress",
    streetAddress: "?°ë³¸ë¡?23ë²ˆê¸¸ 4-21 ë¯¸ì„±ë¹Œë”© 3ì¸?,
    addressLocality: "êµ°í¬??,
    addressRegion: "ê²½ê¸°??,
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
  priceRange: "?©â‚©",
  keywords: ["?ˆì¹ë¬¸ì‹ ", "ë°˜ì˜êµ¬ëˆˆ??, "ì½¤ë³´?ˆì¹", "?ì—°?ˆì¹", "?°ë³¸?ˆì¹ë¬¸ì‹ "]
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
          <a href={reservationUrl} target="_blank" rel="noreferrer" className="nav-cta">
            ?ˆì•½ë¬¸ì˜
          </a>
        </div>
        <details className="mobile-menu">
          <summary aria-label="ë©”ë‰´ ?´ê¸°">Menu</summary>
          <div className="mobile-menu-panel">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <a href={reservationUrl} target="_blank" rel="noreferrer">
              ?ˆì•½ë¬¸ì˜
            </a>
          </div>
        </details>
      </header>

      <main className="site-main">
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
              ë¶€?œëŸ¬???¸ìƒ ë³€?”ì? ? ëª…??ê²°ê³¼. ?¤í??¼ë˜?¬ëŠ” ?ˆì¹ë¬¸ì‹  ?”ì?¸ì„ ???ì—°?¤ëŸ½ê³??¸ë ¨???¼ìƒ
              ë£¨í‹´?¼ë¡œ ?„ì„±?©ë‹ˆ??
            </p>
            <div className="hero-actions">
              <a href="#pricing" className="btn-main">
                ê°€ê²?ë³´ê¸°
              </a>
              <a href="#contact" className="btn-sub">
                ?ˆì•½ ë°©ë²•
              </a>
            </div>
            <div className="hero-metrics">
              <article>
                <span>Review</span>
                <strong>18 + 43</strong>
              </article>
              <article>
                <span>Open</span>
                <strong>11:00-21:00</strong>
              </article>
              <article>
                <span>Closed</span>
                <strong>ê³µíœ´??/strong>
              </article>
            </div>
          </div>
          <div className="hero-visual reveal">
            <Image
              src="/assets/hero/1.png"
              alt="STYLE LASH ë©”ì¸ ë¹„ì£¼??
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
            <h2>?œì„ ??ë¨¸ë¬´???”í…Œ??/h2>
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
                  <Image
                    src={card.image}
                    alt={`${card.subtitle} ?œìˆ  ?´ë?ì§€`}
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
            <h2>?ì—°?¤ëŸ½ê²? ?•ì‹¤?˜ê²Œ</h2>
          </div>
          <BeforeAfterSlider />
        </section>

        <section className="pricing" id="pricing">
          <div className="pricing-left reveal">
            <div className="section-head">
              <p>Pricing</p>
              <h2>?œìˆ  ë©”ë‰´ / ê°€ê²?/h2>
            </div>
            <p className="price-note">ê°€ê²?ê¸°ì?: 2026-02-14 ?¤ì´ë²??Œë ˆ?´ìŠ¤ ê³µê°œ ?•ë³´ (ë³€??ê°€??</p>
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
            <h2>ë§¤ì¥ ?•ë³´</h2>
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
              <Image src="/assets/review/1.png" alt="ê³ ê° ë¦¬ë·° ë¬´ë“œ ?´ë?ì§€" fill quality={72} sizes="100vw" />
            </div>
            <div className="review-copy">
              <p>?¤ì´ë²?ê¸°ì? ë¦¬ë·°</p>
              <strong>ë°©ë¬¸?ë¦¬ë·?18 Â· ë¸”ë¡œê·¸ë¦¬ë·?43</strong>
              <a href={naverReviewUrl} target="_blank" rel="noreferrer">
                ?¤ì´ë²??Œë ˆ?´ìŠ¤ ë³´ê¸°
              </a>
              <a href={communityUrl} className="review-board-link">
                ÈÄ±â °Ô½ÃÆÇ ¹Ù·Î°¡±â
              </a>
            </div>
          </div>
        </section>

        <section className="experience">
          <div className="section-head reveal">
            <p>Flow</p>
            <h2>?ˆì•½ ?„ë¡œ?¸ìŠ¤</h2>
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
            <h2>?ì£¼ ë¬»ëŠ” ì§ˆë¬¸</h2>
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
          <h2>?í•˜?œëŠ” ? ì§œë¥?ë³´ë‚´ì£¼ì‹œë©?ë¹ ë¥´ê²??ˆì•½ ?ˆë‚´?œë¦´ê²Œìš”.</h2>
          <div className="contact-actions">
            <a href={reservationUrl} target="_blank" rel="noreferrer" className="btn-main">
              {reservationCtaLabel}
            </a>
            <a href={naverMapUrl} target="_blank" rel="noreferrer" className="btn-sub">
              ?¤ì´ë²?ì§€???„ì¹˜ ?•ì¸
            </a>
          </div>
        </section>
      </main>

      <a href={reservationUrl} target="_blank" rel="noreferrer" className="floating-cta">
        {reservationCtaLabel}
      </a>
      <FloatingToolButton />
    </>
  );
}


