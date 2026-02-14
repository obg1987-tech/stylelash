const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylash.vercel.app";

export default function sitemap() {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/brow-preview`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7
    }
  ];
}

