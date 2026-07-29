import type { Metadata } from "next";
import { Shippori_Mincho, Noto_Sans_JP, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { shop } from "@/data/shop";
import StructuredData from "@/components/seo/StructuredData";

const shippori = Shippori_Mincho({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-shippori",
  preload: false,
});

const notoSans = Noto_Sans_JP({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans",
  preload: false,
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
});

const TITLE = "新宿の高級かき氷専門店｜氷菓飯店 龍園";
const DESCRIPTION = shop.description;

export const metadata: Metadata = {
  metadataBase: new URL(shop.siteUrl),
  title: {
    default: TITLE,
    template: "%s｜氷菓飯店 龍園",
  },
  description: DESCRIPTION,
  keywords: [
    "新宿 かき氷",
    "新宿 かき氷専門店",
    "新宿 高級かき氷",
    "東京 かき氷",
    "新宿 スイーツ",
    "新宿 和スイーツ",
    "氷菓飯店 龍園",
  ],
  alternates: {
    canonical: shop.siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: shop.siteUrl,
    siteName: shop.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: `${shop.siteUrl}/images/ogp.jpg`,
        width: 1200,
        height: 630,
        alt: "氷菓飯店 龍園 - 新宿の高級かき氷専門店",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${shop.siteUrl}/images/ogp.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="js">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${shippori.variable} ${notoSans.variable} ${cormorant.variable} grain antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
