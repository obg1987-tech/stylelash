const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylash.vercel.app";
const instagramUrl = "https://www.instagram.com/stylelash_kr";
const naverPlaceUrl = "https://m.place.naver.com/place/778319613/home";
const naverReviewUrl = "https://m.place.naver.com/place/778319613/review/visitor";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}#organization`,
  name: "STYLE LASH",
  url: siteUrl,
  logo: `${siteUrl}/og/sqare.png`,
  sameAs: [instagramUrl, naverPlaceUrl, naverReviewUrl]
};

const beautySalonSchema = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": `${siteUrl}#beauty-salon`,
  name: "STYLE LASH",
  image: `${siteUrl}/og/main.png`,
  url: siteUrl,
  telephone: "+82-507-1405-3087",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Misung Building 3F, 23 Gosan-ro",
    addressLocality: "Gunpo-si",
    addressRegion: "Gyeonggi-do",
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
  sameAs: [instagramUrl, naverPlaceUrl, naverReviewUrl]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}#website`,
  url: siteUrl,
  name: "STYLE LASH",
  inLanguage: "ko-KR"
};

export default function SiteStructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(beautySalonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
