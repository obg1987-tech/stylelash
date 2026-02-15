import { Plus_Jakarta_Sans, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import SiteStructuredData from "../components/site-structured-data";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stylash.vercel.app";

const verificationOther = {
  ...(process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
    ? { "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION }
    : {}),
  ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
    ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
    : {})
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "STYLE LASH | Eyebrow Tattoo & Retouch",
    template: "%s | STYLE LASH"
  },
  description:
    "Gunpo Sanbon eyebrow tattoo studio. 1:1 face mapping, natural brow design, retouch care, and booking guidance.",
  applicationName: "STYLE LASH",
  keywords: [
    "style lash",
    "eyebrow tattoo",
    "eyebrow retouch",
    "gunpo eyebrow",
    "sanbon eyebrow",
    "반영구 눈썹",
    "눈썹문신",
    "구포 눈썹문신"
  ],
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/"
    }
  },
  icons: {
    icon: "/og/sqare.png",
    apple: "/og/sqare.png",
    shortcut: "/og/sqare.png"
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "STYLE LASH",
    title: "STYLE LASH | Eyebrow Tattoo & Retouch",
    description:
      "Gunpo Sanbon eyebrow tattoo studio. 1:1 face mapping and natural brow retouch service.",
    images: [
      {
        url: "/og/main.png",
        width: 1200,
        height: 630,
        alt: "STYLE LASH main visual"
      },
      {
        url: "/og/sqare.png",
        width: 1200,
        height: 1200,
        alt: "STYLE LASH logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "STYLE LASH | Eyebrow Tattoo & Retouch",
    description:
      "Gunpo Sanbon eyebrow tattoo studio. 1:1 face mapping and natural brow retouch service.",
    images: ["/og/main.png"]
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(Object.keys(verificationOther).length ? { other: verificationOther } : {})
  },
  category: "beauty",
  referrer: "origin-when-cross-origin"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable}`}>
        <SiteStructuredData />
        {children}
      </body>
    </html>
  );
}
