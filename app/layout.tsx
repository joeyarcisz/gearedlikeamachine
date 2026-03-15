import type { Metadata } from "next";
import { Rajdhani, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gearedlikeamachine.com"),
  title: "Geared Like A Machine | Video Production & Equipment Rentals",
  description:
    "Engineered to Move Audiences. Cinema-grade video production, equipment rentals, and content creation for brands that demand results. Based in Texas, working globally.",
  keywords: [
    "video production",
    "equipment rentals",
    "brand films",
    "commercials",
    "social media content",
    "corporate video",
    "cinema production",
    "production gear rental",
  ],
  openGraph: {
    title: "Geared Like A Machine | Video Production & Equipment Rentals",
    description:
      "Engineered to Move Audiences. Cinema-grade video production and professional equipment rentals for brands that demand results. Based in Dallas-Fort Worth, Texas.",
    type: "website",
    locale: "en_US",
    siteName: "Geared Like A Machine",
    url: "https://gearedlikeamachine.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Geared Like A Machine | Video Production & Equipment Rentals" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geared Like A Machine | Video Production & Equipment Rentals",
    description:
      "Engineered to Move Audiences. Cinema-grade video production and professional equipment rentals. Dallas-Fort Worth, TX.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.gearedlikeamachine.com/#organization",
                  name: "Geared Like A Machine",
                  legalName: "Geared Like A Machine LLC",
                  url: "https://www.gearedlikeamachine.com",
                  logo: "https://www.gearedlikeamachine.com/logo-white.svg",
                  description:
                    "Commercial video production and equipment rentals based in Dallas, Texas. Available worldwide.",
                  telephone: "(682) 229-7699",
                  email: "hello@gearedlikeamachine.com",
                  sameAs: [
                    "https://www.instagram.com/geared.like.a.machine",
                    "https://vimeo.com/gearedlikeamachine",
                  ],
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://www.gearedlikeamachine.com/#localbusiness",
                  additionalType: "https://schema.org/ProfessionalService",
                  name: "Geared Like A Machine",
                  url: "https://www.gearedlikeamachine.com",
                  telephone: "(682) 229-7699",
                  email: "hello@gearedlikeamachine.com",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Dallas",
                    addressRegion: "TX",
                    addressCountry: "US",
                  },
                  areaServed: "Worldwide",
                  priceRange: "$$",
                  parentOrganization: {
                    "@id": "https://www.gearedlikeamachine.com/#organization",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${rajdhani.variable} ${inter.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
