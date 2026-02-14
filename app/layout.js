import { Plus_Jakarta_Sans, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

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

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "STYLE LASH | 눈썹문신 & 반영구 디자인",
    template: "%s | STYLE LASH"
  },
  description:
    "군포 산본 스타일래쉬. 눈썹문신, 반영구 눈썹, 리터치 보정까지 1:1 맞춤 디자인으로 완성하는 STYLE LASH",
  applicationName: "STYLE LASH",
  keywords: [
    "스타일래쉬",
    "눈썹문신",
    "반영구눈썹",
    "콤보눈썹",
    "자연눈썹",
    "눈썹리터치",
    "군포눈썹문신",
    "산본눈썹문신",
    "stylelash_kr"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "STYLE LASH",
    title: "STYLE LASH | 눈썹문신 & 반영구 디자인",
    description:
      "군포 산본 스타일래쉬. 눈썹문신, 반영구 눈썹, 리터치 보정까지 1:1 맞춤 디자인.",
    images: [
      {
        url: "/og/main.png",
        width: 1200,
        height: 630,
        alt: "STYLE LASH"
      },
      {
        url: "/og/sqare.png",
        width: 1200,
        height: 1200,
        alt: "STYLE LASH Square"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "STYLE LASH | 눈썹문신 & 반영구 디자인",
    description:
      "군포 산본 스타일래쉬. 눈썹문신, 반영구 눈썹, 리터치 보정 1:1 맞춤 디자인.",
    images: ["/og/main.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  category: "beauty"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}

