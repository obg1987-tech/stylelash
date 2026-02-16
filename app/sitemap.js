const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylash.vercel.app";
const deployedAt = process.env.NEXT_PUBLIC_DEPLOYED_AT || new Date().toISOString();
const lastModified = new Date(deployedAt);

export default function sitemap() {
  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${siteUrl}/og/main.png`]
    },
    {
      url: `${siteUrl}/community`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/snap`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.75
    },
    {
      url: `${siteUrl}/brow-preview`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.65
    }
  ];
}

