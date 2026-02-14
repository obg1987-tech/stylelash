import Image from "next/image";
import BeforeAfterSlider from "./before-after-slider";
import FloatingToolButton from "../components/floating-tool-button";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylash.vercel.app";
const instagramUrl = "https://www.instagram.com/stylelash_kr?igsh=N3B1N2J5aWY2dWhr";
const kakaoChannelUrl = "";
const reservationUrl = kakaoChannelUrl || instagramUrl;
const reservationCtaLabel = kakaoChannelUrl
  ? "移댁뭅?ㅽ넚 梨꾨꼸 臾몄쓽?섍린"
  : "?몄뒪?洹몃옩 DM 臾몄쓽?섍린";
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
    subtitle: "?덉뜾臾몄떊 ?붿옄??,
    copy: "怨④꺽怨?洹쇱쑁 ?먮쫫??怨좊젮???먯뿰?ㅻ읇怨??먮졆???덉뜾 ?쇱씤???ㅺ퀎?⑸땲??",
    image: "/assets/service/1.png",
    className: "service-card--brow-tattoo"
  },
  {
    title: "Retouch & Balance",
    subtitle: "由ы꽣移?蹂댁젙 ?붿옄??,
    copy: "湲곗〈 ?덉뜾 ?곹깭? ?쇰? ??낆쓣 諛섏쁺??諛?꾩? 寃곗쓣 ?뺢탳?섍쾶 蹂댁젙?⑸땲??",
    image: "/assets/service/2.png",
    className: "service-card--retouch"
  }
];

const serviceHighlights = [
  "?덉뜾臾몄떊 ?붿옄?? ?쇨뎬 鍮꾩쑉 湲곕컲 留욎땄 ?쇱씤 ?ㅺ퀎",
  "寃곕늿??肄ㅻ낫?덉뜾: ?몄긽怨?痍⑦뼢??留욌뒗 ?쒗쁽 諛⑹떇 ?쒖븞",
  "由ы꽣移?蹂댁젙: ?좎??κ낵 諛??諛몃윴??媛쒖꽑",
  "諛섏쁺援??덉뜾: 硫붿씠?ъ뾽 ?쒓컙 ?⑥텞怨??먮졆???몄긽 ?꾩꽦"
];

const priceMenus = [
  { name: "?먯뿰?덉뜾", price: "臾몄쓽" },
  { name: "肄ㅻ낫?덉뜾", price: "臾몄쓽" },
  { name: "由ы꽣移?蹂댁젙", price: "臾몄쓽" }
];

const reservationProcess = [
  "?곷떞: 湲곗〈 ?덉뜾 ?곹깭/?쇰? ????먰븯???몄긽 泥댄겕",
  "?붿옄?? 怨④꺽怨?鍮꾩쑉??留욎텣 留욎땄 ?덉뜾 ?쇱씤 ?쒖븞",
  "?쒖닠: ?꾩깮 湲곗? 湲곕컲???ъ꽭??吏꾪뻾",
  "?좏봽?곗??? ?덇컖/李⑹깋 ?④퀎蹂?愿由щ쾿 ?덈궡"
];

const businessInfo = [
  { label: "?곹샇", value: "?ㅽ??쇰옒??(STYLE LASH)" },
  { label: "?낆쥌", value: "?덉뜾臾몄떊/諛섏쁺援? },
  { label: "????곕씫泥?, value: "0507-1405-3087" },
  { label: "?덉빟 梨꾨꼸", value: "?몄뒪?洹몃옩 DM @stylelash_kr" },
  { label: "?댁쁺?쒓컙", value: "留ㅼ씪 11:00 - 21:00" },
  { label: "?대Т", value: "怨듯쑕?? },
  { label: "?꾨줈紐?二쇱냼", value: "寃쎄린 援고룷???곕낯濡?23踰덇만 4-21 誘몄꽦鍮뚮뵫 3痢? },
  { label: "吏踰?二쇱냼", value: "寃쎄린 援고룷???곕낯??1131-1" }
];

const faqItems = [
  {
    q: "泥섏쓬 諛⑸Ц?몃뜲 ?대뼡 ?쒖닠??留욌뒗吏 紐⑤Ⅴ寃좎뼱??",
    a: "?ъ쟾 ?곷떞?먯꽌 怨④꺽, 湲곗〈 ?덉뜾 ?곹깭, ?됱냼 硫붿씠?ъ뾽 ?듦????뺤씤????媛???먯뿰?ㅻ윭???덉뜾臾몄떊 諛⑺뼢?쇰줈 ?덈궡?쒕┰?덈떎."
  },
  {
    q: "?덉빟? ?대뼸寃?吏꾪뻾?섎굹??",
    a: "?몄뒪?洹몃옩 DM?쇰줈 ?깊븿, ?щ쭩 ?좎쭨/?쒓컙, ?щ쭩 ?쒖닠??蹂대궡二쇱떆硫?媛?ν븳 ?щ’???덈궡?쒕┰?덈떎."
  },
  {
    q: "?덉뜾臾몄떊 ??愿由ш? 以묒슂?쒓???",
    a: "珥덇린 ?덇컖 湲곌컙 愿由ш? 李⑹깋 寃곌낵??吏곸젒 ?곹뼢??以띾땲?? ?몄븞/蹂댁뒿/二쇱쓽?ы빆? ?쒖닠 吏곹썑 ?곸꽭???덈궡?대뱶由쎈땲??"
  }
];

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": `${siteUrl}#beautysalon`,
  name: "?ㅽ??쇰옒??,
  image: `${siteUrl}/assets/hero/1.png`,
  url: siteUrl,
  telephone: "+82-507-1405-3087",
  sameAs: [instagramUrl, naverPlaceUrl, naverReviewUrl],
  address: {
    "@type": "PostalAddress",
    streetAddress: "?곕낯濡?23踰덇만 4-21 誘몄꽦鍮뚮뵫 3痢?,
    addressLocality: "援고룷??,
    addressRegion: "寃쎄린??,
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
  priceRange: "?⒱궔",
  keywords: ["?덉뜾臾몄떊", "諛섏쁺援щ늿??, "肄ㅻ낫?덉뜾", "?먯뿰?덉뜾", "?곕낯?덉뜾臾몄떊"]
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
            ?덉빟臾몄쓽
          </a>
        </div>
        <details className="mobile-menu">
          <summary aria-label="硫붾돱 ?닿린">Menu</summary>
          <div className="mobile-menu-panel">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <a href={reservationUrl} target="_blank" rel="noreferrer">
              ?덉빟臾몄쓽
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
              遺?쒕윭???몄긽 蹂?붿? ?좊챸??寃곌낵. ?ㅽ??쇰옒?щ뒗 ?덉뜾臾몄떊 ?붿옄?몄쓣 ???먯뿰?ㅻ읇怨??몃젴???쇱긽
              猷⑦떞?쇰줈 ?꾩꽦?⑸땲??
            </p>
            <div className="hero-actions">
              <a href="#pricing" className="btn-main">
                媛寃?蹂닿린
              </a>
              <a href="#contact" className="btn-sub">
                ?덉빟 諛⑸쾿
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
                <strong>怨듯쑕??/strong>
              </article>
            </div>
          </div>
          <div className="hero-visual reveal">
            <Image
              src="/assets/hero/1.png"
              alt="STYLE LASH 硫붿씤 鍮꾩＜??
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
            <h2>?쒖꽑??癒몃Т???뷀뀒??/h2>
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
                    alt={`${card.subtitle} ?쒖닠 ?대?吏`}
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
            <h2>?먯뿰?ㅻ읇寃? ?뺤떎?섍쾶</h2>
          </div>
          <BeforeAfterSlider />
        </section>

        <section className="pricing" id="pricing">
          <div className="pricing-left reveal">
            <div className="section-head">
              <p>Pricing</p>
              <h2>?쒖닠 硫붾돱 / 媛寃?/h2>
            </div>
            <p className="price-note">媛寃?湲곗?: 2026-02-14 ?ㅼ씠踰??뚮젅?댁뒪 怨듦컻 ?뺣낫 (蹂??媛??</p>
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
            <h2>留ㅼ옣 ?뺣낫</h2>
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
              <Image src="/assets/review/1.png" alt="怨좉컼 由щ럭 臾대뱶 ?대?吏" fill quality={72} sizes="100vw" />
            </div>
            <div className="review-copy">
              <p>?ㅼ씠踰?湲곗? 由щ럭</p>
              <strong>諛⑸Ц?먮━酉?18 쨌 釉붾줈洹몃━酉?43</strong>
              <a href={naverReviewUrl} target="_blank" rel="noreferrer">
                ?ㅼ씠踰??뚮젅?댁뒪 蹂닿린
              </a>
              <a href={communityUrl} className="review-board-link">
                후기 게시판 바로가기
              </a>
            </div>
          </div>
        </section>

        <section className="experience">
          <div className="section-head reveal">
            <p>Flow</p>
            <h2>?덉빟 ?꾨줈?몄뒪</h2>
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
            <h2>?먯＜ 臾삳뒗 吏덈Ц</h2>
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
          <h2>?먰븯?쒕뒗 ?좎쭨瑜?蹂대궡二쇱떆硫?鍮좊Ⅴ寃??덉빟 ?덈궡?쒕┫寃뚯슂.</h2>
          <div className="contact-actions">
            <a href={reservationUrl} target="_blank" rel="noreferrer" className="btn-main">
              {reservationCtaLabel}
            </a>
            <a href={naverMapUrl} target="_blank" rel="noreferrer" className="btn-sub">
              ?ㅼ씠踰?吏???꾩튂 ?뺤씤
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


