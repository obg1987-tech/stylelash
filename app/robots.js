const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylash.vercel.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/community", "/snap", "/brow-preview"],
        disallow: ["/api/"]
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/community", "/snap", "/brow-preview"],
        disallow: ["/api/"]
      },
      {
        userAgent: "Yeti",
        allow: ["/", "/community", "/snap", "/brow-preview"],
        disallow: ["/api/"]
      }
    ],
    sitemap: [`${siteUrl}/sitemap.xml`],
    host: siteUrl
  };
}

